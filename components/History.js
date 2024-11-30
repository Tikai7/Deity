import React, { useState, useContext } from "react"
import { ScrollView, View, Text, TouchableOpacity, Modal } from "react-native"
import { PALETTE } from "../styles/Styles"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { textStyles, containerStyles } from "../styles/Styles";
import FlashMessage, { showMessage } from "react-native-flash-message";
import HistoryCakes from "./HistoryCakes";
import { Data } from "../context/Data";
export default function History({handleVisible}){

    const [visibleCake, setVisibleCake] = useState(false);
    const [historyType, setHistoryType] = useState("");
    const [infoType, setInfoType] = useState("");
    const {isIOS} = useContext(Data)

    function handleErrorMessage(){
        showMessage({
            message: "Fonctionnalité disponible dans \nCommandes > Client > Historique",
            type: "info",
            duration: 5000,
            icon: "info",
        });
    }

    function handleHistoryTypeInfo(type, info){
        setHistoryType(type);
        setInfoType(info);
        handleVisibleCakes();
    }

    function handleVisibleCakes(){
        setVisibleCake(old=>!old);
    }

    return(
        <ScrollView style={{backgroundColor:PALETTE.primary, paddingTop:isIOS ? "35%" : "15%", width:"100%"}}>
            <View style={containerStyles.mainContainer}>
                <View style={{flex:1,flexDirection:"row",marginTop: isIOS ? "-10%" : "0%", marginBottom:"5%", justifyContent:"space-around"}}>
                    <TouchableOpacity style={{marginLeft:"10%", zIndex:99}} onPress={handleVisible}>
                        <MaterialIcons name="arrow-back" size={30} color={PALETTE.white} />
                    </TouchableOpacity>
                    <Text style={{...textStyles.title, fontSize:25, marginRight:"0%", alignSelf:"center"}}>Historique</Text>
                </View>
            </View>
            <Modal visible={visibleCake} animationType='slide' transparent={true} >
                <HistoryCakes handleVisible={handleVisibleCakes} history_type={historyType} info_type={infoType} />
            </Modal>

            <View style={containerStyles.parametersContainer}>
                    
                    <TouchableOpacity style={{width:"100%"}} onPress={() => handleHistoryTypeInfo("stock_history","Stock")}>
                        <View style={{
                            ...containerStyles.commandeContainer, 
                            marginTop:"0%", 
                            backgroundColor:PALETTE.primary,
                            flexDirection: 'row', 
                            alignItems: 'center'
                        }}>
                            <MaterialIcons name="history-edu" size={24} color={PALETTE.white} style={{ marginRight: 10 }} />
                            <Text style={textStyles.primaryText}>Historique des stocks</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={{width:"100%"}} onPress={() => handleHistoryTypeInfo("prices_history","Prix")}>
                        <View style={{
                            ...containerStyles.commandeContainer, 
                            backgroundColor:PALETTE.primary,
                            flexDirection: 'row', 
                            alignItems: 'center'
                        }}>
                            <MaterialIcons name="history-edu" size={24} color={PALETTE.white} style={{ marginRight: 10 }} />
                            <Text style={textStyles.primaryText}>Historique des prix produits</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={{width:"100%"}} onPress={handleErrorMessage}>
                        <View style={{
                            ...containerStyles.commandeContainer, 
                            backgroundColor:PALETTE.primary,
                            flexDirection: 'row', 
                            alignItems: 'center'
                        }}>
                            <MaterialIcons name="history-edu" size={24} color={PALETTE.white} style={{ marginRight: 10 }} />
                            <Text style={textStyles.primaryText}>Historique des commandes</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <FlashMessage position="top" style={{marginTop: isIOS ? "-35%" : "0%"}} />
        </ScrollView>
    );
}