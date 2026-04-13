import React, { useState, useEffect, useContext } from 'react';
import {
    View, Text, SafeAreaView, TextInput, FlatList,
    TouchableOpacity, Image, Modal
} from 'react-native';
import { containerStyles, PALETTE, textStyles } from '../styles/Styles';
import { getMyData } from '../utils/DataManager';
import { CLIENT_COUNT } from '../utils/Function';
import { Data } from '../context/Data';
import Nothing from '../components/Nothing';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Info from '../components/Info';
import { cakeKey, getCakeQty } from '../utils/CakesConfig';
import useCakes from '../hooks/useCakes';

export default function Commande({ isOnlyToShowClients, handleVisibleClients }) {
    const [client, setClient]                   = useState([]);
    const [visible, setVisible]                 = useState(false);
    const [clientItem, setClientItem]           = useState({});
    const { refresh, isIOS }                    = useContext(Data);
    const [search, setSearch]                   = useState('');
    const [filteredClients, setFilteredClients] = useState([]);
    const { cakes }                             = useCakes();

    useEffect(() => {
        if (cakes.length === 0) return;
        const getData = async () => {
            let clientCount = await getMyData(CLIENT_COUNT);
            clientCount = clientCount ? parseInt(clientCount) : 0;
            
            const commandes = [];
            for (let i = 1; i <= clientCount; i++) {
                const c = await getMyData(`${i}`);
                if (c) {
                    c.key = `${i}`;
                    commandes.push(c);
                }
            }

            commandes.sort((a, b) => new Date(b.dateAjout) - new Date(a.dateAjout));

            if (isOnlyToShowClients) {
                const unique = await buildUniqueCommandes(commandes);
                setClient(unique);
                setFilteredClients(unique);
            } else {
                setClient(commandes);
                setFilteredClients(commandes);
            }
        };
        getData();
    }, [refresh, cakes]);

    useEffect(() => {
        if (search === '') setFilteredClients(client);
    }, [search]);

    async function buildUniqueCommandes(commandes) {
        const unique = [];
        for (const commande of commandes) {
            const idx     = unique.findIndex(c => c.nom === commande.nom);
            const history = await getMyData(commande.groupUID + "_history");
            const totals  = getTotalFromHistory(history);

            if (idx === -1) {
                const entry = { ...commande, prixTotal: totals.prixTotal };
                for (const cake of cakes) entry[cakeKey(cake.id)] = totals.qty[cake.id] ?? 0;
                unique.push(entry);
            } else {
                unique[idx].prixTotal += totals.prixTotal;
                for (const cake of cakes) {
                    unique[idx][cakeKey(cake.id)] = (unique[idx][cakeKey(cake.id)] ?? 0) + (totals.qty[cake.id] ?? 0);
                }
            }
        }
        return unique;
    }

    function getTotalFromHistory(history) {
        const emptyQty = {};
        cakes.forEach(c => { emptyQty[c.id] = 0; });

        if (!history || history.length === 0) return { qty: emptyQty, prixTotal: 0 };

        // getCakeQty gère automatiquement ancien ET nouveau format
        const qty = {};
        cakes.forEach(c => { qty[c.id] = getCakeQty(history[0], c.id); });
        let prixTotal = history[0].prixTotal ?? 0;
        let prev = history[0];

        for (let i = 1; i < history.length; i++) {
            const cur = history[i];
            if (cur.isUpdated) {
                cakes.forEach(c => {
                    qty[c.id] -= getCakeQty(prev, c.id);
                    qty[c.id] += getCakeQty(cur,  c.id);
                });
                prixTotal -= prev.prixTotal ?? 0;
                prixTotal += cur.prixTotal  ?? 0;
            } else {
                cakes.forEach(c => { qty[c.id] += getCakeQty(cur, c.id); });
                prixTotal += cur.prixTotal ?? 0;
            }
            prev = cur;
        }
        return { qty, prixTotal };
    }

    function handleSearch(text) {
        setSearch(text);
        if (text) {
            const up = text.toUpperCase();
            setFilteredClients(client.filter(item =>
                (item.nom     ?? '').toUpperCase().includes(up) ||
                (item.adresse ?? '').toUpperCase().includes(up) ||
                (item.secteur ?? '').toUpperCase().includes(up)
            ));
        } else {
            setFilteredClients(client);
        }
    }

    function handleVisible()     { setVisible(old => !old); }
    function handleSeeMore(item) { setClientItem({ ...item }); setVisible(true); }

    function renderClient({ item }) {
        return (
            <TouchableOpacity
                style={{ width: "100%" }}
                onPress={isOnlyToShowClients ? () => {} : () => handleSeeMore(item)}
            >
                <View style={containerStyles.commandeContainer}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={textStyles.clientName}>{item.nom}</Text>
                        <Text style={textStyles.clientName}>{item.prixTotal} DZD</Text>
                    </View>
                    <Text style={textStyles.clientAddress}>{item.adresse}</Text>

                    <View style={{ ...containerStyles.orderDetails, flexWrap: "wrap" }}>
                        {cakes.map(cake => (
                            <View key={cake.id} style={{ flexDirection: "row", alignItems: "center", marginRight: 8, marginTop: 4 }}>
                                <Image
                                    source={typeof cake.image === 'string' ? { uri: cake.image } : cake.image}
                                    style={{ width: 30, height: 30, borderRadius: 4 }}
                                />
                                <Text style={{ color: PALETTE.primary, marginLeft: 2 }}>
                                    {/* getCakeQty lit l'ancien OU le nouveau format */}
                                    {getCakeQty(item, cake.id)}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {!isOnlyToShowClients && (
                        <View style={containerStyles.button}>
                            <Text style={textStyles.buttonText}>Voir détails</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    }

    if (client.length < 1) {
        return (
            <Nothing
                text={isOnlyToShowClients ? "Vous n'avez aucun clients !" : "Vous n'avez aucune \ncommandes !"}
                handleBack={isOnlyToShowClients ? handleVisibleClients : null}
            />
        );
    }

    return (
        <SafeAreaView style={containerStyles.mainContainer}>
            {!isOnlyToShowClients && <MaterialIcons name="sell" size={24} style={{ marginTop: "10%" }} color={PALETTE.white} />}
            {!isOnlyToShowClients && <Text style={{ ...textStyles.title, fontSize: 26 }}>À qui vendre ?</Text>}
            {isOnlyToShowClients && (
                <View style={{ flexDirection: "row", marginTop: "5%", marginBottom: "5%", alignItems: "center", justifyContent: "space-around" }}>
                    <TouchableOpacity style={{ marginLeft: "5%", zIndex: 99 }} onPress={handleVisibleClients}>
                        <MaterialIcons name="arrow-back" size={30} color={PALETTE.white} />
                    </TouchableOpacity>
                    <Text style={{ ...textStyles.title, marginBottom: 0, marginLeft: "-12%", fontSize: 25, alignSelf: "center" }}>Clients</Text>
                </View>
            )}

            <View style={containerStyles.searchBar}>
                <MaterialIcons name="search" size={20} color={PALETTE.primary} />
                <TextInput
                    style={{ height: 40, flex: 1, marginLeft: 5 }}
                    placeholder="Rechercher par nom ou adresse..."
                    value={search}
                    onChangeText={handleSearch}
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={() => handleSearch('')}>
                        <MaterialIcons name="close" size={20} color="gray" />
                    </TouchableOpacity>
                )}
            </View>

            <Modal visible={visible} animationType='slide'>
                <Info handleVisible={handleVisible} selectedClient={clientItem} />
            </Modal>

            <FlatList
                data={filteredClients}
                keyExtractor={item => item.uid}
                renderItem={({ item }) => renderClient({ item })}
                style={{ width: "100%" }}
            />
        </SafeAreaView>
    );
}