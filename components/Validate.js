import React, { useContext, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { containerStyles, PALETTE, textStyles } from "../styles/Styles";
import { deleteItem } from '../utils/DataManager';
import { Data } from "../context/Data";

export default function Validate({ handleVisible, handleVisibleParent, selectedClient }) {
    const { setRefresh } = useContext(Data);
    // Guard : empêche un double-appel si l'utilisateur tape vite
    const deleting = useRef(false);

    async function deleteClient() {
        if (deleting.current) return;
        deleting.current = true;
        try {
            console.log("[INFO] Deleting client:", selectedClient);
            await deleteItem(`${selectedClient.key}`);
            setRefresh(old => !old);
            // handleVisibleParent remonte jusqu'à la liste (ferme Info + rafraîchit)
            handleVisibleParent();
        } catch (e) {
            console.error("[ERROR] deleteClient:", e);
            deleting.current = false;
        }
    }

    return (
        <View style={{ ...containerStyles.mainContainer, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{
                width: 300, padding: 20,
                backgroundColor: PALETTE.white,
                borderRadius: 10, alignItems: 'center',
            }}>
                <Text style={textStyles.secondaryText}>
                    Voulez vous vraiment supprimer {'\n'}{selectedClient?.nom} ?
                </Text>
                <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%", marginTop: 20 }}>
                    <TouchableOpacity
                        onPress={handleVisible}
                        style={{ backgroundColor: PALETTE.primary, padding: 10, borderRadius: 5 }}
                    >
                        <Text style={textStyles.primaryText}>Annuler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={deleteClient}
                        style={{ backgroundColor: PALETTE.error, padding: 10, borderRadius: 5 }}
                    >
                        <Text style={textStyles.primaryText}>Supprimer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}