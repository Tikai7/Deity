import React, { useEffect, useRef, useState } from 'react';
import { Modal, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { containerStyles, PALETTE, textStyles } from '../styles/Styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ScrollView } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import History from '../components/History';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Database from '../components/Database';
import ManageCakes from '../components/ManageCakes';

export default function Parametres() {
    const lottieRef = useRef(null);
    const [visibleData, setVisibleData]       = useState(false);
    const [visibleHistory, setVisibleHistory] = useState(false);
    const [visibleCakes, setVisibleCakes]     = useState(false);

    useEffect(() => {
        if (lottieRef.current) {
            setTimeout(() => lottieRef.current?.play(), 100);
        }
    }, [lottieRef.current]);

    function handleVisible(type) {
        setVisibleData(type === "data" ? old => !old : false);
        setVisibleHistory(type === "history" ? old => !old : false);
        setVisibleCakes(type === "cakes" ? old => !old : false);
    }

    return (
        <SafeAreaView style={containerStyles.mainContainer}>
            <Ionicons name="settings-outline" style={{ marginTop: "10%" }} size={24} color="white" />
            <Text style={{ ...textStyles.title, fontSize: 26 }}>Des choses à régler ?</Text>

            <ScrollView style={{ ...containerStyles.scrollViewContainer, width: "100%", backgroundColor: PALETTE.primary }}>

                <Modal visible={visibleHistory} animationType='slide'>
                    <History handleVisible={() => handleVisible("history")} />
                </Modal>

                <Modal visible={visibleData} animationType='slide'>
                    <Database handleVisible={() => handleVisible("data")} />
                </Modal>

                <Modal visible={visibleCakes} animationType='slide'>
                    <ManageCakes handleVisible={() => handleVisible("cakes")} />
                </Modal>

                <View style={containerStyles.parametersContainer}>

                    {/* Gérer les gâteaux ← NOUVEAU */}
                    <TouchableOpacity style={{ width: "100%" }} onPress={() => handleVisible("cakes")}>
                        <View style={{
                            ...containerStyles.commandeContainer,
                            backgroundColor: PALETTE.primary,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <MaterialCommunityIcons name="cake-variant-outline" size={24} color={PALETTE.white} style={{ marginRight: 10 }} />
                            <Text style={textStyles.primaryText}>Gérer les gâteaux</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Historique */}
                    <TouchableOpacity style={{ width: "100%" }} onPress={() => handleVisible("history")}>
                        <View style={{
                            ...containerStyles.commandeContainer,
                            backgroundColor: PALETTE.primary,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <MaterialIcons name="history" size={24} color={PALETTE.white} style={{ marginRight: 10 }} />
                            <Text style={textStyles.primaryText}>Historique</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Données */}
                    <TouchableOpacity style={{ width: "100%" }} onPress={() => handleVisible("data")}>
                        <View style={{
                            ...containerStyles.commandeContainer,
                            backgroundColor: PALETTE.primary,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <MaterialCommunityIcons name="database-outline" size={24} color={PALETTE.white} style={{ marginRight: 10 }} />
                            <Text style={textStyles.primaryText}>Données</Text>
                        </View>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
