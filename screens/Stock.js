import React, { useContext, useEffect, useState } from 'react';
import {
    Text, ScrollView, View, TextInput, Image,
    Keyboard, TouchableWithoutFeedback, TouchableOpacity, Modal
} from 'react-native';
import { buttonStyles, containerStyles, PALETTE, textStyles } from '../styles/Styles';
import { storeMyData } from '../utils/DataManager';
import Check from '../components/Check';
import { cakeStockKey, readCakeStock } from '../utils/CakesConfig';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Data } from '../context/Data';
import { waitingTime } from '../utils/Function';
import useCakes from '../hooks/useCakes';

export default function Stock() {
    const { refresh, setRefresh } = useContext(Data);
    const { cakes } = useCakes();

    const [quantities, setQuantities] = useState({});
    const [visible, setVisible]       = useState(false);
    const [state, setState]           = useState(false);

    useEffect(() => {
        if (cakes.length === 0) return;
        const load = async () => {
            const newQty = {};
            for (const cake of cakes) {
                // readCakeStock cherche nouveau format puis ancien en fallback
                newQty[cake.id] = await readCakeStock(cake.id);
            }
            setQuantities(newQty);
        };
        load();
    }, [cakes, refresh]);

    async function handleAnimation(time) {
        setVisible(true);
        setTimeout(() => setVisible(false), time);
    }

    async function addToHistory(entry) {
        try {
            const { getMyData, storeMyData: store } = await import('../utils/DataManager');
            const history = await getMyData("stock_history");
            const updated = history ? [...history, entry] : [entry];
            await store("stock_history", updated);
            return true;
        } catch { return false; }
    }

    async function handleConfirm() {
        try {
            let ok = true;
            for (const cake of cakes) {
                const s = await storeMyData(cakeStockKey(cake.id), quantities[cake.id] ?? 0);
                if (!s) ok = false;
            }

            const histEntry = { date: new Date() };
            for (const cake of cakes) {
                histEntry[`gateau_${cake.id}`] = quantities[cake.id] ?? 0;
                // alias rétro-compat
                if (cake.id === 1) histEntry.gateau1 = quantities[1] ?? 0;
                if (cake.id === 2) histEntry.gateau2 = quantities[2] ?? 0;
                if (cake.id === 3) histEntry.gateau3 = quantities[3] ?? 0;
            }

            const s4 = await addToHistory(histEntry);
            setState(ok && s4);
            handleAnimation(waitingTime);
        } catch {
            setState(false);
            handleAnimation(waitingTime);
        } finally {
            setRefresh(old => !old);
        }
    }

    function handleChange(cakeId, text) {
        if (/^\d*$/.test(text)) {
            setQuantities(prev => ({ ...prev, [cakeId]: text === "" ? 0 : parseInt(text, 10) }));
        }
    }

    return (
        <ScrollView style={{ backgroundColor: PALETTE.primary, paddingTop: "10%", width: "100%" }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={containerStyles.mainContainer}>
                    <Modal visible={visible} animationType='fade' transparent={true}>
                        <Check state={state} title={"Stock mis à jour !"} />
                    </Modal>

                    <MaterialIcons name="trolley" size={24} color={PALETTE.white} />
                    <Text style={{ ...textStyles.title, marginBottom: "5%", fontSize: 26 }}>On fait le plein ?!</Text>

                    <View style={{ ...containerStyles.cakeContainer, flexWrap: "wrap", width: "100%" }}>
                        {cakes.length % 2 !== 0 && (
                            <View style={{ width: "50%", alignItems: "center" }}>
                                <MaterialCommunityIcons name="chef-hat" size={100} color={PALETTE.white} />
                            </View>
                        )}
                        {cakes.map(cake => (
                            <View key={cake.id} style={{ width: "50%", alignItems: "center", flexDirection: "column" }}>
                                <Image
                                    source={typeof cake.image === 'string' ? { uri: cake.image } : cake.image}
                                    style={{ ...containerStyles.cake, width: 120, height: 120 }}
                                />
                                <Text style={{ color: PALETTE.tertiary, fontSize: 12, marginTop: 4 }}>{cake.name}</Text>
                                <TextInput
                                    keyboardType='numeric'
                                    onChangeText={text => handleChange(cake.id, text)}
                                    style={{ ...textStyles.cakeNumber, fontSize: 18, width: "35%", marginTop: "5%", marginBottom: "10%", color: PALETTE.white }}
                                    value={String(quantities[cake.id] ?? 0)}
                                    maxLength={5}
                                />
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity onPress={handleConfirm} style={{ ...buttonStyles.primaryButton, marginTop: "10%", height: 50 }}>
                        <Text style={textStyles.secondaryText}>Confirmer</Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
    );
}