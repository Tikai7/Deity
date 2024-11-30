import React from 'react';
import { useState, useEffect,useContext } from 'react';
import { View, Image, Text, TextInput, Keyboard, TouchableOpacity,TouchableWithoutFeedback, ScrollView, Modal } from 'react-native';
import { containerStyles, textStyles, PALETTE, buttonStyles } from '../styles/Styles';
import { getMyData,storeMyData } from '../utils/DataManager';
import { CAKE } from '../utils/Function';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { waitingTime } from '../utils/Function';
import Check from './Check';
import { showMessage } from "react-native-flash-message";
import { Data } from '../context/Data';

export default function Prices({handleVisible}){

    const {refresh, isIOS} = useContext(Data)

    const [placeholderGateau1, setPlaceholderGateau1] = useState("0 DZD")
    const [placeholderGateau2, setPlaceholderGateau2] = useState("0 DZD")
    const [placeholderGateau3, setPlaceholderGateau3] = useState("0 DZD")

    const [prixGateau1, setPrixGateau1] = useState(0)
    const [prixGateau2, setPrixGateau2] = useState(0)
    const [prixGateau3, setPrixGateau3] = useState(0)

    const [visible, setVisible] = useState(false);  
    const [state, setState] = useState(false);

    async function handleAnimation(time) {
        setVisible(true);
        setTimeout(() => {
            setVisible(false);
            handleVisible();
        } , time);
    }

    useEffect(() => {
        const getData = async () => {
            const prixG1 = await getMyData(`${CAKE}1_price`)
            const prixG2 = await getMyData(`${CAKE}2_price`)
            const prixG3 = await getMyData(`${CAKE}3_price`)
            
            console.log("[INFO] Prix Gateau 1 : ", prixG1)
            console.log("[INFO] Prix Gateau 2 : ", prixG2)
            console.log("[INFO] Prix Gateau 3 : ", prixG3)

            if (prixG1 !== null){
                setPrixGateau1(prixG1)
                setPlaceholderGateau1(`${prixG1} DZD`)
            }
            else
                setPrixGateau1(0)
            if (prixG2 !== null){
                setPrixGateau2(prixG2)
                setPlaceholderGateau2(`${prixG2} DZD`)
            }
            else
                setPrixGateau2(0)

            if (prixG3 !== null){
                setPrixGateau3(prixG3)
                setPlaceholderGateau3(`${prixG3} DZD`)
            }
            else
                setPrixGateau3(0)
        }

        getData()
    }, [refresh])

    function handleCakePrice(text, id) {
        if (/^\d*$/.test(text)) {
            const value = parseInt(text, 10)
            if (value < 0 || isNaN(value))
                showMessage({
                    message: "Le prix ne peut pas être négatif",
                    type: "warning",
                });       

            if (id === "1")
                setPrixGateau1(text === "" ? 0 : value);
            else if (id === "2")
                setPrixGateau2(text === "" ? 0 : value);
            else if (id === "3")
                setPrixGateau3(text === "" ? 0 : value);
        }
    }

    function handleScreenTap() {
        Keyboard.dismiss();
    }

    async function addToHistory(cakeInfo) {
        try {
            const history = await getMyData("prices_history")
            if (history === null){
                await storeMyData("prices_history", [cakeInfo])
            }
            else{
                const newHistory = [...history, cakeInfo]
                await storeMyData("prices_history", newHistory)
            }
            return true
        } catch (error) {
            console.error("[ERROR] Error storing cake prices data in history: ", error);
            return false
        }
    }

    async function handleConfirmPrices() {
        try {
            const s1 = await storeMyData(`${CAKE}1_price`, prixGateau1)
            const s2 = await storeMyData(`${CAKE}2_price`, prixGateau2)
            const s3 = await storeMyData(`${CAKE}3_price`, prixGateau3)
            const cakePrices = {
                "gateau1": prixGateau1,
                "gateau2": prixGateau2,
                "gateau3": prixGateau3,
                "date": new Date()
            }
            const s4 = await addToHistory(cakePrices)
            setState(s1 && s2 && s3 && s4);
            handleAnimation(waitingTime);
        } catch (error) {
            console.error("[ERROR] handleConfirmPrices : ", error)
            setState(false)
        }
    }


    return(
        <TouchableWithoutFeedback onPress={handleScreenTap}>
            <ScrollView style={{backgroundColor:PALETTE.primary, paddingTop: isIOS ? "35%" : "15%", width:"100%"}}>

            <View style={containerStyles.clientContainer}>
                <Modal visible={visible} animationType='fade' transparent={true} >
                    <Check state={state} title={"Prix modifiés !"} />
                </Modal>

                <View style={{flex:1,flexDirection:"row",marginTop:isIOS ? "-10%" : "0%", marginBottom:"5%", justifyContent:"space-around"}}>
                    <TouchableOpacity style={{marginLeft:"10%", zIndex:99}} onPress={handleVisible}>
                        <MaterialIcons name="arrow-back" size={30} color={PALETTE.white} />
                    </TouchableOpacity>
                    <Text style={{...textStyles.title, fontSize:25, marginRight:"0%", alignSelf:"center"}}>Prix des gâteaux</Text>
                </View>
                <View style={{...containerStyles.cakeContainer, flexDirection:"column", width:"100%"}}>
                    <View style={{ width: "90%",marginBottom:"5%", flexDirection: "row", justifyContent:"space-around" }}>
                        <Image source={require('../images/gateau1.jpg')} style={containerStyles.cake} />
                        <TextInput 
                            keyboardType='numeric' 
                            onChangeText={(e)=>handleCakePrice(e, "1")} 
                            style={{...textStyles.cakeNumber, width:"25%"}}
                            placeholder={placeholderGateau1}
                            maxLength={4}
                        />
                    </View>

                    <View style={{ width: "90%",marginBottom:"5%", flexDirection: "row", justifyContent:"space-around" }}>
                        <Image source={require('../images/gateau2.jpg')} style={containerStyles.cake} />
                        <TextInput 
                            keyboardType='numeric' 
                            onChangeText={(e)=>handleCakePrice(e, "2")} 
                            style={{...textStyles.cakeNumber, width:"25%"}}
                            placeholder={placeholderGateau2}
                            maxLength={4}
                        />
                    </View>

                    <View style={{ width: "90%",marginBottom:"5%", flexDirection: "row", justifyContent:"space-around" }}>
                        <Image source={require('../images/gateau3.jpg')} style={containerStyles.cake} />
                        <TextInput 
                            keyboardType='numeric' 
                            onChangeText={(e)=>handleCakePrice(e, "3")} 
                            style={{...textStyles.cakeNumber, width:"25%"}}
                            placeholder={placeholderGateau3}
                            maxLength={4}
                        />
                    </View>
                </View>
                <TouchableOpacity style={{...buttonStyles.secondaryButton, height:50, width:"70%"}} onPress={handleConfirmPrices}>
                    <Text style={textStyles.primaryText}>Confirmer</Text>
                </TouchableOpacity>
                
            </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}