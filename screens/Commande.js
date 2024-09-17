
import React, {useState, useEffect, useContext} from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import { containerStyles, textStyles } from '../styles/Styles';
import { getMyData, storeMyData, clearAll } from '../utils/DataManager';
import { CLIENT_COUNT } from '../utils/Function';
import { Data } from '../context/Data';
import Nothing from '../components/Nothing';

export default function Commande(){

    const [client, setClient] = useState([]);
    const {refresh, setRefresh} = useContext(Data)


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
                commandes.push(c)
            } 
            setClient(commandes)
        }
        getData()
    }, [refresh]);

    useEffect(() => {
        console.log("[INFO] Client : ", client)
    }, [client])


    function renderClient({item}) {
        return (
            <View style={containerStyles.commandeContainer}>
                <Text style={textStyles.clientName}>{item.nom}</Text>
                <Text style={textStyles.clientAddress}>{item.adresse}</Text>
                <View style={containerStyles.orderDetails}>
                    <Text>
                        <Image source={require('../images/gateau1.jpg')} style={{...containerStyles.cake, marginRight:4,borderRadius:4, width:50, height:50}} /> 
                        {item.nbGateau || "N/A"}
                    </Text>
                    <Text>
                        <Image source={require('../images/gateau2.jpg')} style={{...containerStyles.cake, marginRight:4,borderRadius:4, width:50, height:50}} /> 
                        {item.nbGateau2 || "N/A"}
                    </Text>
                    <Text>
                        <Image source={require('../images/gateau3.jpg')} style={{...containerStyles.cake, marginRight:4,borderRadius:4, width:50, height:50}} /> 
                        {item.nbGateau3 || "N/A"}
                    </Text>
                </View>
                <TouchableOpacity style={containerStyles.button} onPress={() => alert(`Details for ${item.nom}`)}>
                    <Text style={textStyles.buttonText}>Voir détails</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (client.length<1)
        return <Nothing/>


    return(
        <SafeAreaView style={containerStyles.mainContainer}>
            <Text style={{...textStyles.title, fontSize:28, marginTop:"10%"}}>À qui vendre ?</Text>
            <FlatList
                data={client}
                keyExtractor={(item) => item.uid}
                renderItem={({item}) => renderClient({item})}
                style={{width:"100%"}}
            />
        </SafeAreaView>
    ); 
}