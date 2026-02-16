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

    useEffect(()=>{
        console.log("[INFO] Client changed : ", selectedClient)
    },[selectedClient])

    function openMap(address) {
        const query = encodeURIComponent(address || ''); // garde-fou
        const url = Platform.select({
            ios: `comgooglemaps://?q=${query}`, 
            android: `geo:0,0?q=${query}`,      
        });

        if (Platform.OS === "ios") {
            Linking.canOpenURL(url).then((supported) => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
            }
            });
        } else {
            Linking.openURL(url);
        }
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
        {/* Monte les Modals enfants uniquement quand visibles + onRequestClose pour Android */}
        {visibleHistory && (
          <Modal visible animationType="slide" onRequestClose={handleHistory}>
              <HistoryClient 
                  handleVisible={handleHistory} 
                  clientGroupID={selectedClient?.groupUID}
              />
          </Modal>
        )}

        {visible && (
          <Modal visible animationType="slide" onRequestClose={handleVisibleClient}>
              <Client 
                  handleVisibleParent={handleVisible}
                  handleVisible={handleVisibleClient} 
                  selectedClient={selectedClient} 
                  action="Ajouter commande"
                  title='Nouvelle Commande'
              />
          </Modal>
        )}

        {visibleValidation && (
          <Modal visible animationType="fade" transparent onRequestClose={handleValidate}>
              <Validate 
                  handleVisible={handleValidate} 
                  handleVisibleParent={handleVisible}
                  selectedClient={selectedClient} 
              />
          </Modal>
        )}

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

            <View style={{width:"100%", justifyContent:"center", marginLeft: "20%", alignItems:"flex-start", marginTop:"5%"}}>
                <View style={{alignItems:"flex-start", width:"78%"}}>
                    <Text style={textStyles.primaryText}>Nom : <Text style={{color:PALETTE.tertiary}}>{selectedClient?.nom ?? '—'}</Text></Text>
                    <Text style={textStyles.primaryText}>Date d'ajout : <Text style={{color:PALETTE.tertiary}}>
                      {selectedClient?.dateAjout ? convertDate(selectedClient.dateAjout) : '—'}
                    </Text></Text>
                    <Text style={textStyles.primaryText}>Prix total : <Text style={{color:PALETTE.success}}>{selectedClient?.prixTotal ?? 0} DZD</Text></Text>
                </View>

                {/* Fix Android: pas de MapView dans un Modal -> remplace par un bouton d'ouverture Maps */}
                {Platform.OS === 'android' ? (
                  <TouchableOpacity
                    onPress={() => openMap(selectedClient?.adresse)}
                    style={{ 
                        width: "80%", height: 100, borderRadius : 10, marginVertical: 20, backgroundColor:'rgba(255,255,255,0.08)', 
                        alignItems:'center', justifyContent:'center' }}
                  >
                    <Text style={{color:PALETTE.white}}>Ouvrir l'adresse dans Maps</Text>
                  </TouchableOpacity>
                ) : (
                  <MapView
                      style={{ width: "80%", height: 100, borderRadius : 10, marginVertical: 20 }}
                      initialRegion={clientCoordinates}
                  >
                      <Marker coordinate={clientCoordinates} />
                  </MapView>
                )}

                <View style={{flexDirection:"row", alignItems:"center", marginTop:5}}>
                    <TouchableOpacity style={{marginBottom:5, flexDirection:"row", alignItems:"flex-end"}} onPress={() => openMap(selectedClient?.adresse)}>
                        <Text style={textStyles.primaryText}>Adresse : {selectedClient?.adresse ?? '—'}</Text>
                        <SimpleLineIcons name="share-alt" size={20} color={PALETTE.white} style={{marginLeft:5}} />
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:"row", alignItems:"center", marginTop:5}}>
                    <Text style={textStyles.primaryText}>Secteur : {selectedClient?.secteur ?? '—'}</Text>
                </View>

            </View>
            <View style={containerStyles.cakeContainer}>
                <View style={{ width: "27%", flexDirection: "column" }}>
                    <Image source={require('../images/gateau1.jpg')} style={containerStyles.cake} />
                    <Text style={textStyles.cakeNumber}>{selectedClient?.nbGateau ?? 0}</Text>
                    <Text style={{...textStyles.cakeNumber, fontSize:10, color:PALETTE.tertiary}}>{selectedClient?.prixGateau1 ?? 0} DZD</Text>
                </View>

                <View style={{ width: "27%", flexDirection: "column" }}>
                    <Image source={require('../images/gateau2.jpg')} style={containerStyles.cake} />
                    <Text style={textStyles.cakeNumber}>{selectedClient?.nbGateau2 ?? 0}</Text>
                    <Text style={{...textStyles.cakeNumber, fontSize:10, color:PALETTE.tertiary}}>{selectedClient?.prixGateau2 ?? 0} DZD</Text>
                </View>

                <View style={{ width: "27%", flexDirection: "column" }}>
                    <Image source={require('../images/gateau3.jpg')} style={containerStyles.cake} />
                    <Text style={textStyles.cakeNumber}>{selectedClient?.nbGateau3 ?? 0}</Text>
                    <Text style={{...textStyles.cakeNumber, fontSize:10, color:PALETTE.tertiary}}>{selectedClient?.prixGateau3 ?? 0} DZD</Text>
                </View>
            </View>

            <View style={{marginVertical:"4%"}}/>
            <TouchableOpacity onPress={handleUpdateClient} style={{...buttonStyles.primaryButton, height:50, marginBottom:"3%"}}>
                <Text style={textStyles.secondaryText}>Plus d'actions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{...buttonStyles.secondaryButton, height:50, borderColor:PALETTE.error}} onPress={handleValidate}>
                <Text style={{...textStyles.secondaryText, color:PALETTE.error}}>Supprimer Client</Text>
            </TouchableOpacity>
        </View>
        </ScrollView>
    )
}
