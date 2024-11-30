import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Button, Image, ScrollView, Platform, Linking, Modal } from 'react-native';
import { containerStyles, textStyles, buttonStyles, PALETTE } from '../styles/Styles';
import MapView, { Marker } from 'react-native-maps';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Client from './Client';
import { useState } from 'react';
import { CLIENT_COUNT, convertDate } from '../utils/Function';
import { Data } from '../context/Data';
import { useContext } from 'react';
import Validate from './Validate';
import HistoryClient from './HistoryClient';

export default function Info({handleVisible, selectedClient}){

    const [visible, setVisible] = useState(false)
    const [visibleValidation, setVisibleValidation] = useState(false)
    const {setRefresh, isIOS} = useContext(Data)
    const [visibleHistory, setVisibleHistory] = useState(false)

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


    function handleValidate(){
        setVisibleValidation(old=>!old)
    }

    function handleVisibleClient(){
        setRefresh(old=>!old)
        setVisible(old=>!old)

    }

    function handleUpdateClient(){
        handleVisibleClient()
    }

    function handleHistory(){
        setVisibleHistory(old=>!old)
    }



    return(
        <ScrollView style={{backgroundColor:PALETTE.primary, paddingTop:isIOS ? "35%" : "15%", width:"100%"}}>
        <Modal visible={visibleHistory} animationType="slide">
            <HistoryClient 
                handleVisible={handleHistory} 
                clientGroupID={selectedClient.groupUID}
            />
        </Modal>

        <Modal visible={visible} animationType="slide">
            <Client 
                handleVisibleParent={handleVisible}
                handleVisible={handleVisibleClient} 
                selectedClient={selectedClient} 
                action="Ajouter commande"
                title='Nouvelle Commande'
            />
        </Modal>
        <Modal visible={visibleValidation} animationType="fade" transparent>
            <Validate 
                handleVisible={handleValidate} 
                handleVisibleParent={handleVisible}
                selectedClient={selectedClient} 
            />
        </Modal>

        <View style={containerStyles.clientContainer}>
            <View style={{flex:1, flexDirection:"row", marginTop:isIOS ? "-10%" : "0%", justifyContent:"center", paddingHorizontal:"5%"}}>
                <TouchableOpacity style={{marginLeft:"0%", zIndex:99}} onPress={handleVisible}>
                    <MaterialIcons name="arrow-back" size={30} color={PALETTE.white} />
                </TouchableOpacity>
                <Text style={{...textStyles.title, fontSize:25, marginRight:"-2%", alignSelf:"center", flex:1}}>Information client</Text>
                <TouchableOpacity style={{marginLeft:"0%", zIndex:99}} onPress={handleHistory}>
                    <MaterialIcons name="history-edu" size={30} style={{marginTop:2, zIndex:99}} color={PALETTE.success} />
                </TouchableOpacity>
            </View>

            <View style={{width:"100%", justifyContent:"center",alignItems:"center", marginTop:"5%"}}>
                <View style={{alignItems:"flex-start", width:"78%"}}>
                    <Text style={textStyles.primaryText}>Nom : <Text style={{color:PALETTE.tertiary}}>{selectedClient.nom}</Text></Text>
                    <Text style={textStyles.primaryText}>Date d'ajout : <Text style={{color:PALETTE.tertiary}}>{convertDate(selectedClient.dateAjout)}</Text></Text>
                    <Text style={textStyles.primaryText}>Prix total : <Text style={{color:PALETTE.success}}>{selectedClient.prixTotal} DZD</Text></Text>
                </View>
                <MapView
                    style={{ width: "80%", height: 100, borderRadius : 10, marginVertical: 20 }}
                    initialRegion={clientCoordinates}
                >
                    <Marker coordinate={clientCoordinates} />
                </MapView>


                <View style={{flexDirection:"row", alignItems:"center", marginTop:5}}>
                    <TouchableOpacity style={{marginBottom:5, flexDirection:"row", alignItems:"flex-end"}} onPress={() => openMap(selectedClient.adresse)}>
                        <Text style={textStyles.primaryText}>Adresse : {selectedClient.adresse}</Text>
                        <SimpleLineIcons name="share-alt" size={20} color={PALETTE.white} style={{marginLeft:5}} />
                    </TouchableOpacity>
                </View>

            </View>
            <View style={containerStyles.cakeContainer}>
                <View style={{ width: "27%", flexDirection: "column" }}>
                    <Image source={require('../images/gateau1.jpg')} style={containerStyles.cake} />
                    <Text style={textStyles.cakeNumber}>{selectedClient.nbGateau}</Text>
                    <Text style={{...textStyles.cakeNumber, fontSize:10, color:PALETTE.tertiary}}>{selectedClient.prixGateau1} DZD</Text>

                </View>

                <View style={{ width: "27%", flexDirection: "column" }}>
                    <Image source={require('../images/gateau2.jpg')} style={containerStyles.cake} />
                    <Text style={textStyles.cakeNumber}>{selectedClient.nbGateau2}</Text>
                    <Text style={{...textStyles.cakeNumber, fontSize:10, color:PALETTE.tertiary}}>{selectedClient.prixGateau2} DZD</Text>

                </View>

                <View style={{ width: "27%", flexDirection: "column" }}>
                    <Image source={require('../images/gateau3.jpg')} style={containerStyles.cake} />
                    <Text style={textStyles.cakeNumber}>{selectedClient.nbGateau3}</Text>
                    <Text style={{...textStyles.cakeNumber, fontSize:10, color:PALETTE.tertiary}}>{selectedClient.prixGateau3} DZD</Text>
                </View>
            </View>

            <View style={{marginVertical:"4%"}}/>
            <TouchableOpacity onPress={handleUpdateClient} style={{...buttonStyles.primaryButton, height:50, marginBottom:"3%"}}>
                <Text style={textStyles.secondaryText}>Nouvelle commande</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{...buttonStyles.secondaryButton, height:50, borderColor:PALETTE.error}} onPress={handleValidate}>
                <Text style={{...textStyles.secondaryText, color:PALETTE.error}}>Supprimer Client</Text>
            </TouchableOpacity>
        </View>
        </ScrollView>
    )
}

