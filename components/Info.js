import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
    View, Text, TouchableOpacity, Image, ScrollView,
    Platform, Linking, Modal
} from 'react-native';
import { containerStyles, textStyles, buttonStyles, PALETTE } from '../styles/Styles';
import MapView, { Marker } from 'react-native-maps';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Client from './Client';
import { convertDate } from '../utils/Function';
import { Data } from '../context/Data';
import Validate from './Validate';
import HistoryClient from './HistoryClient';
import { getCakeQty, getCakePrice } from '../utils/CakesConfig';
import useCakes from '../hooks/useCakes';

export default function Info({ handleVisible, selectedClient }) {
    const [showClient, setShowClient]         = useState(false);
    const [showValidate, setShowValidate]     = useState(false);
    const [showHistory, setShowHistory]       = useState(false);
    const { setRefresh, isIOS } = useContext(Data);
    const { cakes } = useCakes();

    const clientCoordinates = {
        latitude: 36.737232, longitude: 3.086472,
        latitudeDelta: 0.01, longitudeDelta: 0.01,
    };

    function openMap(address) {
        const query = encodeURIComponent(address || '');
        if (Platform.OS === "ios") {
            const url = `comgooglemaps://?q=${query}`;
            Linking.canOpenURL(url).then(ok =>
                Linking.openURL(ok ? url : `https://www.google.com/maps/search/?api=1&query=${query}`)
            );
        } else {
            Linking.openURL(`geo:0,0?q=${query}`);
        }
    }

    // ── Handlers stables (useCallback pour éviter re-renders inutiles) ────────
    const handleValidate     = useCallback(() => setShowValidate(v => !v), []);
    const handleHistory      = useCallback(() => setShowHistory(v => !v), []);
    const handleUpdateClient = useCallback(() => {
        setRefresh(old => !old);
        setShowClient(v => !v);
    }, [setRefresh]);

    // Appelé par Validate après suppression réussie — remonte deux niveaux
    const handleAfterDelete = useCallback(() => {
        setShowValidate(false);
        handleVisible();          // ferme Info → retour à la liste
    }, [handleVisible]);

    return (
        <ScrollView 
            style={{ backgroundColor: PALETTE.primary, width: "100%" }}
            contentContainerStyle={{ paddingTop: isIOS ? "27%" : "15%", paddingBottom: 50, flexGrow: 1 }}
        >
            {showHistory && (
                <Modal visible animationType="slide" onRequestClose={handleHistory}>
                    <HistoryClient handleVisible={handleHistory} clientGroupID={selectedClient?.groupUID} />
                </Modal>
            )}
            {showClient && (
                <Modal visible animationType="slide" onRequestClose={handleUpdateClient}>
                    <Client
                        handleVisibleParent={handleVisible}
                        handleVisible={handleUpdateClient}
                        selectedClient={selectedClient}
                        action="Ajouter commande"
                        title='Nouvelle Commande'
                    />
                </Modal>
            )}
            {showValidate && (
                <Modal visible animationType="fade" transparent onRequestClose={handleValidate}>
                    <Validate
                        handleVisible={handleValidate}
                        handleVisibleParent={handleAfterDelete}
                        selectedClient={selectedClient}
                    />
                </Modal>
            )}

            <View style={containerStyles.clientContainer}>
                {/* Header */}
                <View style={{ flex: 1, flexDirection: "row", marginTop: isIOS ? "-10%" : "0%", justifyContent: "center", paddingHorizontal: "5%" }}>
                    <TouchableOpacity style={{ zIndex: 99 }} onPress={handleVisible}>
                        <MaterialIcons name="arrow-back" size={30} color={PALETTE.white} />
                    </TouchableOpacity>
                    <Text style={{ ...textStyles.title, fontSize: 25, alignSelf: "center", flex: 1 }}>
                        Information client
                    </Text>
                    <TouchableOpacity onPress={handleHistory}>
                        <MaterialIcons name="history-edu" size={30} style={{ marginTop: 2 }} color={PALETTE.success} />
                    </TouchableOpacity>
                </View>

                {/* Infos texte */}
                <View style={{ width: "100%", justifyContent: "center", marginLeft: "20%", alignItems: "flex-start", marginTop: "5%" }}>
                    <View style={{ alignItems: "flex-start", width: "78%" }}>
                        <Text style={textStyles.primaryText}>Nom : <Text style={{ color: PALETTE.tertiary }}>{selectedClient?.nom ?? '—'}</Text></Text>
                        <Text style={textStyles.primaryText}>Date d'ajout : <Text style={{ color: PALETTE.tertiary }}>
                            {selectedClient?.dateAjout ? convertDate(selectedClient.dateAjout) : '—'}
                        </Text></Text>
                        <Text style={textStyles.primaryText}>Prix total : <Text style={{ color: PALETTE.success }}>{selectedClient?.prixTotal ?? 0} DZD</Text></Text>
                    </View>

                    {Platform.OS === 'android' ? (
                        <TouchableOpacity
                            onPress={() => openMap(selectedClient?.adresse)}
                            style={{ width: "80%", height: 100, borderRadius: 10, marginVertical: 20, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <Text style={{ color: PALETTE.white }}>Ouvrir l'adresse dans Maps</Text>
                        </TouchableOpacity>
                    ) : (
                        <MapView style={{ width: "80%", height: 100, borderRadius: 10, marginVertical: 20 }} initialRegion={clientCoordinates}>
                            <Marker coordinate={clientCoordinates} />
                        </MapView>
                    )}

                    <TouchableOpacity style={{ marginBottom: 5, flexDirection: "row", alignItems: "flex-end" }} onPress={() => openMap(selectedClient?.adresse)}>
                        <Text style={textStyles.primaryText}>Adresse : {selectedClient?.adresse ?? '—'}</Text>
                        <SimpleLineIcons name="share-alt" size={20} color={PALETTE.white} style={{ marginLeft: 5 }} />
                    </TouchableOpacity>
                    <Text style={textStyles.primaryText}>Secteur : {selectedClient?.secteur ?? '—'}</Text>
                </View>

                {/* ── Grille gâteaux — utilise getCakeQty/Price pour rétro-compat ── */}
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
                            <Text style={{ ...textStyles.cakeNumber, fontSize: 16 }}>
                                {getCakeQty(selectedClient, cake.id)}
                            </Text>
                            <Text style={{ ...textStyles.cakeNumber, fontSize: 10, color: PALETTE.tertiary }}>
                                {getCakePrice(selectedClient, cake.id)} DZD
                            </Text>
                        </View>
                    ))}
                </View>

                <View style={{ marginVertical: "3%" }} />
                <TouchableOpacity onPress={handleUpdateClient} style={{ ...buttonStyles.primaryButton, height: 50, marginBottom: "3%" }}>
                    <Text style={textStyles.secondaryText}>Plus d'actions</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...buttonStyles.secondaryButton, height: 50, borderColor: PALETTE.error }} onPress={handleValidate}>
                    <Text style={{ ...textStyles.secondaryText, color: PALETTE.error }}>Supprimer Client</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}