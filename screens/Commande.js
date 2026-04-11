
import React, {useState, useEffect, useContext} from 'react';
import { View, Text, SafeAreaView, TextInput, FlatList, TouchableOpacity, Image, Modal } from 'react-native';
import { containerStyles, PALETTE, textStyles } from '../styles/Styles';
import { getMyData } from '../utils/DataManager';
import { CLIENT_COUNT } from '../utils/Function';
import { Data } from '../context/Data';
import Nothing from '../components/Nothing';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Info from '../components/Info';

export default function Commande({isOnlyToShowClients, handleVisibleClients}){

    const [client, setClient] = useState([]);
    const [visible, setVisible] = useState(false)
    const [clientItem, setClientItem] = useState({})
    const {refresh, isIOS} = useContext(Data)
    const [search, setSearch] = useState('');
    const [filteredClients, setFilteredClients] = useState([]);

    useEffect(() => {
        const getData = async()=>{
            let clientCount = await getMyData(CLIENT_COUNT)
            if (clientCount === null) 
                clientCount = 0 
            else
                clientCount = parseInt(clientCount)

            console.log("[INFO] Client count : ", clientCount)
            let commandes = []
            for (let i = 1; i <= clientCount; i++) {
                const c = await getMyData(`${i}`)
                if (c !== null)
                    commandes.push(c)
            } 
            commandes.sort((a,b) => new Date(b.dateAjout) - new Date(a.dateAjout))

            if (isOnlyToShowClients){
                const uniqueCommandes = await buildUniqueCommandes(commandes)
                setClient(uniqueCommandes)
                setFilteredClients(uniqueCommandes)
            }
            else {
                setClient(commandes)
                setFilteredClients(commandes)
            }
        }
        getData()
    }, [refresh]);

    useEffect(() => {
        if (search === '') {
            setFilteredClients(client);
        }
    }, [search]);

    useEffect(() => {
        console.log("[INFO] Client : ", client)
    }, [client])

    async function buildUniqueCommandes(commandes) {
        const uniqueCommandes = [];

        for (const commande of commandes) {
            const index = uniqueCommandes.findIndex((c) => c.nom === commande.nom);
            const temp_history = await getMyData(commande.groupUID + "_history");
            const temp_commande = getTotalFromHistory(temp_history);

            if (index === -1) {
                uniqueCommandes.push({
                    ...commande,
                    nbGateau: temp_commande.nbGateau,
                    nbGateau2: temp_commande.nbGateau2,
                    nbGateau3: temp_commande.nbGateau3,
                    prixTotal: temp_commande.prixTotal
                });
            } 
            else {
                uniqueCommandes[index].nbGateau += temp_commande.nbGateau;
                uniqueCommandes[index].nbGateau2 += temp_commande.nbGateau2;
                uniqueCommandes[index].nbGateau3 += temp_commande.nbGateau3;
                uniqueCommandes[index].prixTotal += temp_commande.prixTotal;
            }
        }

        return uniqueCommandes;
    }

    function getTotalFromHistory(history){

        if (history === null || history.length === 0)
            return {nbGateau:0, nbGateau2:0, nbGateau3:0, prixTotal:0}


        let nbGateau = history[0].nbGateau
        let nbGateau2 = history[0].nbGateau2
        let nbGateau3 = history[0].nbGateau3
        let prixTotal = history[0].prixTotal
        let old_commande = history[0]


        for (let i = 1; i < history.length; i++) {
            const commande = history[i]
            if (commande.isUpdated) {
                nbGateau -= old_commande.nbGateau 
                nbGateau2 -= old_commande.nbGateau2 
                nbGateau3 -= old_commande.nbGateau3
                prixTotal -= old_commande.prixTotal
                
                nbGateau += commande.nbGateau
                nbGateau2 += commande.nbGateau2
                nbGateau3 += commande.nbGateau3
                prixTotal += commande.prixTotal
            }
            else if (!commande.isUpdated) {
                nbGateau += commande.nbGateau
                nbGateau2 += commande.nbGateau2
                nbGateau3 += commande.nbGateau3
                prixTotal += commande.prixTotal            
            }
            old_commande = history[i]
        }


        return {nbGateau, nbGateau2, nbGateau3, prixTotal}
    }

    function handleSearch(text) {
        setSearch(text);
        if (text) {
            const textData = text.toUpperCase();
            const newData = client.filter((item) => {
                const nom = item.nom ? item.nom.toUpperCase() : '';
                const adresse = item.adresse ? item.adresse.toUpperCase() : '';
                const secteur = item.secteur ? item.secteur.toUpperCase() : '';
                console.log("Comparing:", textData, "with", nom, adresse, secteur);
                return (
                    nom.indexOf(textData) > -1 || 
                    adresse.indexOf(textData) > -1 || 
                    secteur.indexOf(textData) > -1
                );
            });
            console.log("Filtered Data:", newData);
            setFilteredClients(newData);
        } else {
            setFilteredClients(client);
        }
    };


    function handleVisible(){
        setVisible(old=>!old)
    }

    function handleSeeMore(item){
        if (item !== undefined){
            setClientItem({...item})
            handleVisible()
        }
    }

    function renderClient({item}) {
        return (
            <TouchableOpacity 
                style={{width:"100%"}} 
                onPress={
                    isOnlyToShowClients ? () => {} :
                    () => handleSeeMore(item)
                }
            >
                <View style={containerStyles.commandeContainer}>
                    <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                        <Text style={textStyles.clientName}>{item.nom}</Text>
                        <Text style={textStyles.clientName}>{item.prixTotal} DZD</Text>

                    </View>
                    <Text style={textStyles.clientAddress}>{item.adresse}</Text>
                    <View style={containerStyles.orderDetails}>
                        <Text style={{color:PALETTE.primary}}>
                            <Image source={require('../images/gateau1.jpg')} style={{...containerStyles.cake, marginRight:4,borderRadius:4, width:50, height:50}} /> 
                            {` ${item.nbGateau}` || "N/A"}
                        </Text>
                        <Text style={{color:PALETTE.primary}}>
                            <Image source={require('../images/gateau2.jpg')} style={{...containerStyles.cake, marginRight:4,borderRadius:4, width:50, height:50}} /> 
                            {` ${item.nbGateau2}` || "N/A"}
                        </Text>
                        <Text style={{color:PALETTE.primary}}>
                            <Image source={require('../images/gateau3.jpg')} style={{...containerStyles.cake, marginRight:4,borderRadius:4, width:50, height:50}} /> 
                            {` ${item.nbGateau3}` || "N/A"}
                        </Text>
                    </View>
                    {!isOnlyToShowClients && <View style={containerStyles.button}>
                        <Text style={textStyles.buttonText}>Voir détails</Text>
                    </View>}
                </View>
            </TouchableOpacity>

        );
    }

    if (client.length<1) {
        return (
            <Nothing 
                text={
                    isOnlyToShowClients ? "Vous n'avez aucun clients !" :
                    "Vous n'avez aucune \ncommandes !"
                }
                handleBack={isOnlyToShowClients ? handleVisibleClients : null}

            />
        )
    }


    return(
        <SafeAreaView style={containerStyles.mainContainer}>
            {!isOnlyToShowClients && <MaterialIcons name="sell" size={24} style={{marginTop:"10%"}} color={PALETTE.white} />}
            {!isOnlyToShowClients &&  <Text style={{...textStyles.title, fontSize:26}}>À qui vendre ?</Text>}
            {isOnlyToShowClients &&
                    <View style={{flexDirection: "row", marginTop: "5%", marginBottom: "5%", alignItems:"center",justifyContent: "space-around" }}>
                        <TouchableOpacity style={{marginLeft:"5%", zIndex: 99 }} onPress={handleVisibleClients}>
                            <MaterialIcons name="arrow-back" size={30} color={PALETTE.white} />
                        </TouchableOpacity>
                        <Text style={{ ...textStyles.title, marginBottom:0, marginLeft:"-12%", fontSize: 25, alignSelf: "center" }}>Clients</Text>
                    </View>
            }
            {/* --- BARRE DE RECHERCHE --- */}
            <View style={containerStyles.searchBar}>
                <MaterialIcons name="search" size={20} color={PALETTE.primary} />
                <TextInput
                    style={{ height: 40, flex: 1, marginLeft: 5 }}
                    placeholder="Rechercher par nom ou adresse..."
                    value={search}
                    onChangeText={(text) => handleSearch(text)}
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={() => handleSearch('')}>
                        <MaterialIcons name="close" size={20} color="gray" />
                    </TouchableOpacity>
                )}
            </View>

            <Modal visible={visible} animationType='slide'>
                <Info handleVisible={handleVisible} selectedClient={clientItem}/>
            </Modal>
            <FlatList
                ListHeaderComponent={null}
                data={filteredClients}
                keyExtractor={(item) => item.uid}
                renderItem={({item}) => renderClient({item})}
                style={{width:"100%"}}
            />
        </SafeAreaView>
    ); 
}