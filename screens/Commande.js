
import React, {useState, useEffect, useContext} from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Image, Modal } from 'react-native';
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
                const uniqueCommandes = buildUniqueCommandes(commandes)
                setClient(uniqueCommandes)
            }
            else
                setClient(commandes)
        }
        getData()
    }, [refresh]);

    useEffect(() => {
        console.log("[INFO] Client : ", client)
    }, [client])

    function buildUniqueCommandes(commandes){
        // agger les commandes par client (additioner les quantités des gâteaux et les prix)
        // le nom est la clé d'identification d'un client, si deux commandes ont le même nom et la même adresse, alors c'est le même client
        const uniqueCommandes = []
        commandes.forEach((commande) => {
            const index = uniqueCommandes.findIndex((c) => c.nom === commande.nom)
            if (index === -1) {
                uniqueCommandes.push(commande)
            }
            else {
                uniqueCommandes[index].nbGateau += commande.nbGateau
                uniqueCommandes[index].nbGateau2 += commande.nbGateau2
                uniqueCommandes[index].nbGateau3 += commande.nbGateau3
                uniqueCommandes[index].prixTotal += commande.prixTotal
            }
        })
        return uniqueCommandes
    }


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


            <Modal visible={visible} animationType='slide'>
                <Info handleVisible={handleVisible} selectedClient={clientItem}/>
            </Modal>
            <FlatList
                ListHeaderComponent={
                    isOnlyToShowClients ?
                    <View style={{ flex: 1, flexDirection: "row", marginTop: "10%", marginBottom: "5%", alignItems:"center",justifyContent: "space-around" }}>
                        <TouchableOpacity style={{marginLeft:"5%", zIndex: 99 }} onPress={handleVisibleClients}>
                            <MaterialIcons name="arrow-back" size={30} color={PALETTE.white} />
                        </TouchableOpacity>
                        <Text style={{ ...textStyles.title, marginBottom:0, marginLeft:"-12%", fontSize: 25, alignSelf: "center" }}>Clients</Text>
                    </View> : null
                }
                data={client}
                keyExtractor={(item) => item.uid}
                renderItem={({item}) => renderClient({item})}
                style={{width:"100%"}}
            />
        </SafeAreaView>
    ); 
}