import React from 'react';
import { View, Text, TouchableOpacity, Button, Image, ScrollView, Platform, Linking, Modal } from 'react-native';
import { containerStyles, textStyles, buttonStyles, PALETTE } from '../styles/Styles';
import MapView, { Marker } from 'react-native-maps';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Client from './Client';
import { useState } from 'react';
import { CLIENT_COUNT } from '../utils/Function';
import { Data } from '../context/Data';
import { useContext } from 'react';
import Validate from './Validate';

export default function Info({handleVisible, selectedClient}){

    const [visible, setVisible] = useState(false)
    const [visibleValidation, setVisibleValidation] = useState(false)
    const {setRefresh} = useContext(Data)

    const clientCoordinates = {
        latitude:  36.737232,  
        longitude:  3.086472,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    };

    function openMap(address){
        const url = Platform.select({
            ios: `http://maps.apple.com/?q=${address}`,
            android: `geo:0,0?q=${address}`,
        });
      
        Linking.openURL(url);
    }

    function convertDate(isoString){
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate
    }

    async function handleValidate(client){
        handleVisibleValidation()
    }

    function handleVisibleValidation(){
        setVisibleValidation(old=>!old)
    }

    async function handleValidate(client){
        handleVisibleValidation()
    }

    function handleVisibleClient(){
        setRefresh(old=>!old)
        setVisible(old=>!old)

    }

    function handleUpdateClient(){
        handleVisibleClient()
    }

    return(
        <ScrollView style={{backgroundColor:PALETTE.primary, paddingTop:"30%", width:"100%"}}>
        <Modal visible={visible} animationType="slide">
            <Client 
                handleVisibleParent={handleVisible}
                handleVisible={handleVisibleClient} 
                selectedClient={selectedClient} 
                action="Modifier"
                title='Modifier Client'
            />
        </Modal>
        <Modal visible={visibleValidation} animationType="fade" transparent>
            <Validate 
                handleVisible={handleVisibleValidation} 
                selectedClient={selectedClient} 
            />
        </Modal>

        <View style={containerStyles.clientContainer}>
            <View style={{flex:1,flexDirection:"row",marginTop:"-10%", justifyContent:"space-around"}}>
                <TouchableOpacity style={{marginLeft:"10%", zIndex:99}} onPress={handleVisible}>
                    <MaterialIcons name="arrow-back" size={30} color={PALETTE.white} />
                </TouchableOpacity>
                <Text style={{...textStyles.title, fontSize:25, marginRight:"2%", alignSelf:"center"}}>Information client</Text>
            </View>

            <View style={{width:"100%", justifyContent:"center",alignItems:"center", marginTop:"8%"}}>
                <View>
                    <Text style={textStyles.primaryText}>Nom : {selectedClient.nom}</Text>
                    <Text style={textStyles.primaryText}>Date d'ajout : {convertDate(selectedClient.dateAjout)}</Text>
                </View>
                <MapView
                    style={{ width: "80%", height: 100, marginVertical: 20 }}
                    initialRegion={clientCoordinates}
                >
                    <Marker coordinate={clientCoordinates} />
                </MapView>
                <View style={{flexDirection:"row", alignItems:"center", marginTop:5}}>
                    <Text style={textStyles.primaryText}>Adresse : {selectedClient.adresse}</Text>
                    <TouchableOpacity style={{marginLeft:5, marginBottom:5}} onPress={() => openMap(selectedClient.adresse)}>
                        <SimpleLineIcons name="share-alt" size={20} color={PALETTE.white} />
                    </TouchableOpacity>
                </View>

            </View>
            <View style={containerStyles.cakeContainer}>
                <View style={{ width: "27%", flexDirection: "column" }}>
                    <Image source={require('../images/gateau1.jpg')} style={containerStyles.cake} />
                    <Text style={textStyles.cakeNumber}>{selectedClient.nbGateau}</Text>
                </View>

                <View style={{ width: "27%", flexDirection: "column" }}>
                    <Image source={require('../images/gateau2.jpg')} style={containerStyles.cake} />
                    <Text style={textStyles.cakeNumber}>{selectedClient.nbGateau2}</Text>
                </View>

                <View style={{ width: "27%", flexDirection: "column" }}>
                    <Image source={require('../images/gateau3.jpg')} style={containerStyles.cake} />
                    <Text style={textStyles.cakeNumber}>{selectedClient.nbGateau3}</Text>
                </View>
            </View>

            <View style={{marginVertical:"4%"}}/>
            <TouchableOpacity onPress={handleUpdateClient} style={{...buttonStyles.secondaryButton, height:50, marginBottom:"3%"}}>
                <Text style={textStyles.primaryText}>Modifier Client</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{...buttonStyles.secondaryButton, height:50, borderColor:PALETTE.error}} onPress={() => handleValidate(selectedClient)}>
                <Text style={{...textStyles.secondaryText, color:PALETTE.error}}>Supprimer Client</Text>
            </TouchableOpacity>
        </View>
        </ScrollView>
    )
}