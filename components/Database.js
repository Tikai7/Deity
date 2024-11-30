import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { containerStyles, textStyles, PALETTE, buttonStyles } from '../styles/Styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Check from './Check';
import { waitingTime } from '../utils/Function';
import { loadAllData, exportAllData } from '../server/Firebase';
import { Data } from '../context/Data';

export default function Database({ handleVisible }) {
    const [visible, setVisible] = useState(false);
    const [state, setState] = useState(false);
    const { isIOS, setRefresh } = useContext(Data);

    async function handleAnimation(time) {
        setVisible(true);
        setTimeout(() => {
            setVisible(false);
            handleVisible();
        }, time);
    }

    async function handleSync() {
        try {
            const s = await loadAllData(setRefresh);
            setState(s);
            handleAnimation(waitingTime);
        } catch (error) {
            console.log("[ERROR] ", error);
            handleAnimation(false);
        }
    }

    async function handleExport() {
        try {
            const s = await exportAllData(setRefresh);
            setState(s);
            handleAnimation(waitingTime);
        } catch (error) {
            console.log("[ERROR] ", error);
            handleAnimation(false);
        }
    }

    return (
        <ScrollView style={{ backgroundColor: PALETTE.primary, paddingTop: isIOS ? "35%" : "15%", width: "100%" }}>
            <View style={containerStyles.clientContainer}>
                <Modal visible={visible} animationType='fade' transparent={true}>
                    <Check state={state} title={"Synchronisation terminé"} />
                </Modal>

                <View style={{ flex: 1, flexDirection: "row", marginTop: isIOS ? "-10%" : "0%", marginBottom: "5%", justifyContent: "space-around" }}>
                    <TouchableOpacity style={{ marginLeft: "10%", zIndex: 99 }} onPress={handleVisible}>
                        <MaterialIcons name="arrow-back" size={30} color={PALETTE.white} />
                    </TouchableOpacity>
                    <Text style={{ ...textStyles.title, fontSize: 25, marginRight: "0%", alignSelf: "center" }}>Base de données</Text>
                </View>

                <TouchableOpacity onPress={handleExport} style={{ ...buttonStyles.primaryButton, height: 50, flexDirection: "row", marginTop: "40%", alignItems: "center" }}>
                    <MaterialCommunityIcons name="export" size={24} color={PALETTE.primary} style={{ marginRight: 10 }} />
                    <Text style={textStyles.secondaryText}>Exporter les données</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleSync} style={{ ...buttonStyles.secondaryButton, height: 50, marginBottom: "3%", flexDirection: "row", alignItems: "center" }}>
                    <MaterialCommunityIcons name="database-refresh" size={24} color={PALETTE.white} style={{ marginRight: 10 }} />
                    <Text style={textStyles.primaryText}>Recupérer les données</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
}
