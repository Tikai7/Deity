import React, { useContext, useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, Image,
    TouchableWithoutFeedback, Keyboard, Modal, ScrollView
} from 'react-native';
import { buttonStyles, containerStyles, PALETTE, textStyles } from '../styles/Styles';
import Check from './Check';
import { generateUID, CLIENT_COUNT } from '../utils/Function';
import { storeMyData, getMyData } from '../utils/DataManager';
import { Data } from '../context/Data';
import { waitingTime } from '../utils/Function';
import FlashMessage from "react-native-flash-message";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { showMessage } from "react-native-flash-message";
import { cakeKey, cakePriceKey, cakeStockKey, getCakeQty, getCakePrice, readCakeStock } from '../utils/CakesConfig';
import useCakes from '../hooks/useCakes';

export default function Client({
    handleVisible, handleVisibleParent, selectedClient,
    title = "Bienvenue à ...", action = "Ajouter", isHome = false
}) {
    const { refresh, setRefresh, isIOS } = useContext(Data);
    const { cakes } = useCakes();

    const [nom, setNom]         = useState("");
    const [adresse, setAdresse] = useState("");
    const [secteur, setSecteur] = useState("");
    const [dateAjout, setDateAjout] = useState(new Date());

    const [quantities, setQuantities] = useState({});
    const [prices, setPrices]         = useState({});
    const [stocks, setStocks]         = useState({});

    const [placeholderNom, setPlaceholderNom]         = useState("Nom");
    const [placeholderAdresse, setPlaceholderAdresse] = useState("Adresse");
    const [placeholderSecteur, setPlaceholderSecteur] = useState("Secteur");

    const [visible, setVisible] = useState(false);
    const [state, setState]     = useState(false);

    useEffect(() => {
        if (cakes.length === 0) return;

        const init = async () => {
            // Stocks — readCakeStock gère ancien + nouveau format
            const newStocks = {};
            for (const cake of cakes) {
                newStocks[cake.id] = await readCakeStock(cake.id);
            }
            setStocks(newStocks);

            // Quantités & prix
            const newQty   = {};
            const newPrice = {};
            for (const cake of cakes) {
                // getCakeQty/Price lit ancien ET nouveau format
                newQty[cake.id]   = selectedClient ? getCakeQty(selectedClient, cake.id)   : 0;
                newPrice[cake.id] = selectedClient ? getCakePrice(selectedClient, cake.id) : 0;
            }

            if (selectedClient) {
                setPlaceholderNom(selectedClient.nom      ?? "Nom");
                setPlaceholderAdresse(selectedClient.adresse   ?? "Adresse");
                setPlaceholderSecteur(selectedClient.secteur   ?? "Secteur");
                setNom(selectedClient.nom      ?? "");
                setAdresse(selectedClient.adresse   ?? "");
                setSecteur(selectedClient.secteur   ?? "");
                if (selectedClient.dateAjout) setDateAjout(selectedClient.dateAjout);
            }

            setQuantities(newQty);
            setPrices(newPrice);
        };
        init();
    }, [cakes, refresh, selectedClient]);

    async function handleAnimation(time) {
        setVisible(true);
        setTimeout(() => setVisible(false), time);
        setTimeout(() => handleVisible(), time + 100);
        setTimeout(() => handleVisibleParent(), time + time / 2);
    }

    function notGoodClient() {
        const hasAnyCake = cakes.some(c => (quantities[c.id] ?? 0) > 0);
        if (!hasAnyCake) {
            showMessage({ message: "Le nombre de gâteaux doit être supérieur à 0", type: "danger" });
            return true;
        }
        if (!nom || !adresse || !secteur) {
            showMessage({ message: "Le nom, l'adresse et le secteur doivent être renseignés", type: "danger" });
            return true;
        }
        const badPrice = cakes.some(c => (quantities[c.id] ?? 0) > 0 && (prices[c.id] ?? 0) <= 0);
        if (badPrice) {
            showMessage({ message: "Le prix des gâteaux commandés ne peut pas être nul", type: "danger" });
            return true;
        }
        return false;
    }

    async function addToHistory(client) {
        try {
            const history = await getMyData(client.groupUID + "_history");
            const updated = history ? [...history, client] : [client];
            await storeMyData(client.groupUID + "_history", updated);
            return true;
        } catch { return false; }
    }

    async function handleAddClient(isUpdating) {
        try {
            if (notGoodClient()) return;

            // Vérification stock + calcul nouveaux stocks
            const newStocks = {};
            for (const cake of cakes) {
                let delta = (stocks[cake.id] ?? 0) - (quantities[cake.id] ?? 0);
                if (isUpdating) delta += getCakeQty(selectedClient, cake.id);
                if (delta < 0) {
                    showMessage({ message: "Le Stock est insuffisant !", type: "danger" });
                    return;
                }
                newStocks[cake.id] = delta;
            }

            for (const cake of cakes) {
                await storeMyData(cakeStockKey(cake.id), newStocks[cake.id]);
            }

            const uid      = generateUID("CLIENT");
            const groupUID = selectedClient?.groupUID ?? generateUID("GROUP");
            let clientCount = await getMyData(CLIENT_COUNT);
            clientCount = clientCount ? parseInt(clientCount) : 0;
            const keyToStore = selectedClient?.key ?? `${clientCount + 1}`;

            // Construit les champs gâteaux avec les nouvelles clés
            const cakeFields = {};
            let prixTotal = 0;
            for (const cake of cakes) {
                cakeFields[cakeKey(cake.id)]      = quantities[cake.id] ?? 0;
                cakeFields[cakePriceKey(cake.id)] = prices[cake.id]     ?? 0;
                prixTotal += (quantities[cake.id] ?? 0) * (prices[cake.id] ?? 0);
            }

            const client = {
                nom, key: keyToStore, adresse, secteur,
                dateAjout, dateAjoutDB: new Date(),
                prixTotal, uid, groupUID, isUpdated: isUpdating,
                ...cakeFields,
            };

            const s  = await storeMyData(keyToStore, client);
            const s3 = await addToHistory(client);
            let s2 = true;
            if (action !== "Ajouter commande") {
                s2 = await storeMyData(CLIENT_COUNT, `${clientCount + 1}`);
            }

            setState(s && s2 && s3);
            handleAnimation(waitingTime);
        } catch (err) {
            console.error("[ERROR]", err);
            setState(false);
            handleAnimation(waitingTime);
        } finally {
            setRefresh(old => !old);
        }
    }

    function handleQuantityChange(cakeId, text) {
        if (!/^\d*$/.test(text)) return;
        const value = text === "" ? 0 : parseInt(text, 10);
        if (!isNaN(value) && value > (stocks[cakeId] ?? 0)) {
            showMessage({ message: "Attention, stock insuffisant pour cette quantité", type: "warning" });
        }
        setQuantities(prev => ({ ...prev, [cakeId]: isNaN(value) ? 0 : value }));
    }

    function handlePriceChange(cakeId, text) {
        if (!/^\d*$/.test(text)) return;
        const value = text === "" ? 0 : parseInt(text, 10);
        setPrices(prev => ({ ...prev, [cakeId]: isNaN(value) ? 0 : value }));
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView 
                style={{ backgroundColor: PALETTE.primary, width: "100%" }}
                contentContainerStyle={{ paddingTop: isIOS ? "27%" : "15%", paddingBottom: 100, flexGrow: 1 }}
            >                
            <View style={containerStyles.clientContainer}>

                    <View style={{ flex: 1, flexDirection: "row", marginTop: isIOS ? "-10%" : "0%", marginBottom: "10%", justifyContent: "space-around" }}>
                        <TouchableOpacity style={{ marginLeft: "10%", zIndex: 99 }} onPress={handleVisible}>
                            <MaterialIcons name="arrow-back" size={30} color={PALETTE.white} />
                        </TouchableOpacity>
                        <Text style={{ ...textStyles.title, fontSize: 25, marginLeft: "-8%" }}>{title}</Text>
                    </View>

                    <Modal visible={visible} animationType='fade' transparent={true}>
                        <Check state={state} title={action !== "Ajouter commande" ? "Client ajouté !" : "Client modifié !"} />
                    </Modal>

                    <TextInput
                        defaultValue={action === "Ajouter commande" ? placeholderNom : ""}
                        maxLength={30} onChangeText={setNom}
                        placeholder={placeholderNom} placeholderTextColor={PALETTE.tertiary}
                        style={containerStyles.inputContainer}
                    />
                    <TextInput
                        defaultValue={action === "Ajouter commande" ? placeholderAdresse : ""}
                        maxLength={40} onChangeText={setAdresse}
                        placeholder={placeholderAdresse} placeholderTextColor={PALETTE.tertiary}
                        style={containerStyles.inputContainer}
                    />
                    <TextInput
                        defaultValue={action === "Ajouter commande" ? placeholderSecteur : ""}
                        maxLength={30} onChangeText={setSecteur}
                        placeholder={placeholderSecteur} placeholderTextColor={PALETTE.tertiary}
                        style={containerStyles.inputContainer}
                    />

                    <View style={{ ...containerStyles.cakeContainer, flexWrap: "wrap" }}>
                        {cakes.map(cake => (
                            <View key={cake.id} style={{
                                    width: "30%", flexDirection: "column", marginBottom: "4%",
                                    alignItems: "center", justifyContent: "center"
                                }}>
                                <Image
                                    source={typeof cake.image === 'string' ? { uri: cake.image } : cake.image}
                                    style={containerStyles.cake}
                                />
                                <Text style={{ ...textStyles.cakeNumber, fontSize: 10, color: PALETTE.tertiary, marginTop: 4 }}>
                                    {cake.name}
                                </Text>
                                <TextInput
                                    keyboardType='numeric'
                                    onChangeText={text => handleQuantityChange(cake.id, text)}
                                    style={textStyles.cakeNumber}
                                    placeholder={`${quantities[cake.id] ?? 0}`}
                                    placeholderTextColor={PALETTE.white}
                                    maxLength={5}
                                />
                                <View style={{ height: "2%" }} />
                                <TextInput
                                    keyboardType='numeric'
                                    onChangeText={text => handlePriceChange(cake.id, text)}
                                    style={textStyles.cakePrice}
                                    placeholder={prices[cake.id] ? `${prices[cake.id]} DZD` : "0 DZD"}
                                    placeholderTextColor={PALETTE.tertiary}
                                    maxLength={6}
                                />
                            </View>
                        ))}
                    </View>

                    <View style={{ flex: 0.1 }} />
                    <TouchableOpacity onPress={() => handleAddClient(false)} style={{ ...buttonStyles.primaryButton, height: 50, marginTop: "4%", marginBottom: "2%" }}>
                        <Text style={textStyles.secondaryText}>{action}</Text>
                    </TouchableOpacity>
                    {action !== "Ajouter" &&
                        <TouchableOpacity onPress={() => handleAddClient(true)} style={{ ...buttonStyles.secondaryButton, height: 50 }}>
                            <Text style={textStyles.primaryText}>Modifier la commande</Text>
                        </TouchableOpacity>
                    }
                </View>
                <FlashMessage position="top" style={{ marginTop: isIOS ? "-35%" : "0%" }} />
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}