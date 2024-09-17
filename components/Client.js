import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard, Modal } from 'react-native';
import { buttonStyles, containerStyles, PALETTE, textStyles } from '../styles/Styles';
import AntDesign from '@expo/vector-icons/AntDesign';
import Check from './Check';
import { generateUID, CLIENT_COUNT } from '../utils/Function';
import { storeMyData, getMyData } from '../utils/DataManager';
import { Data } from '../context/Data';
import { waitingTime } from '../utils/Function';
import { CAKE } from '../utils/Function';
import FlashMessage from "react-native-flash-message";

import { showMessage, hideMessage } from "react-native-flash-message";


export default function Client({ handleVisible }) {

    const [nom, setNom] = useState("");
    const [adresse, setAdresse] = useState("");
    const [nbGateau, setNbGateau] = useState(0);
    const [nbGateau2, setNbGateau2] = useState(0);
    const [nbGateau3, setNbGateau3] = useState(0);

    const[stockGateau, setStockGateau] = useState(0);
    const[stockGateau2, setStockGateau2] = useState(0);
    const[stockGateau3, setStockGateau3] = useState(0);

    const [visible, setVisible] = useState(false);
    const [state, setState] = useState(false);

    const {refresh, setRefresh} = useContext(Data)


    async function handleAnimation(time) {
        setVisible(true);
        setTimeout(() => {
            setVisible(false);
            handleVisible();
        } , time);
    }

    useEffect(() => {
        const getData = async () => {
            const g1 = await getMyData(`${CAKE}1`)
            const g2 = await getMyData(`${CAKE}2`)
            const g3 = await getMyData(`${CAKE}3`)
            
            console.log("[INFO] Stock Gateau 1 : ", g1)
            console.log("[INFO] Stock Gateau 2 : ", g2)
            console.log("[INFO] Stock Gateau 3 : ", g3)

            if (g1 !== null)
                setStockGateau(g1)
            else
                setStockGateau(0)
            if (g2 !== null)
                setStockGateau2(g2)
            else
                setStockGateau2(0)
            if (g3 !== null)
                setStockGateau3(g3)
            else
                setStockGateau3(0)
        }

        getData()
    },[refresh])
    
    function notGoodClient(){
        if ((!nbGateau && !nbGateau2 && !nbGateau3)){
            showMessage({
                message: "Le nombre de gateaux doit être supérieure à 0",
                type: "danger",
            });
            return true
        }

        if (nom == "" || adresse == ""){
            showMessage({
                message: "Le nom et l'adresse doivent être renseigné",
                type: "danger",
            });
            return true
        }

        return false
    }

    async function handleAddClient() {
        try {

            if (notGoodClient())
                return

            await storeMyData(`${CAKE}1`, (stockGateau-nbGateau))
            await storeMyData(`${CAKE}2`, (stockGateau2-nbGateau2))
            await storeMyData(`${CAKE}3`, (stockGateau3-nbGateau3))

            uid = generateUID("CLIENT")
            let clientCount = await getMyData(CLIENT_COUNT)


            if (clientCount === null)
                clientCount = 0
            else 
                clientCount = parseInt(clientCount);
            
            console.log("[INFO] Client count : ", clientCount)
            const s = await storeMyData(
                (`${clientCount+1}`), {
                    nom: nom,
                    adresse: adresse,
                    nbGateau: nbGateau,
                    nbGateau2: nbGateau2,
                    nbGateau3: nbGateau3,
                    dateAjout : new Date(),
                    uid: uid
                }
            )
            console.log("[INFO] Client stored state: ", s)
            const s2 = await storeMyData(CLIENT_COUNT, `${clientCount+1}`)
            console.log("[INFO] Client count stored state: ", s2)
            setState(s && s2);
            handleAnimation(waitingTime);
        } catch (error) {
            console.error("[ERROR] Error storing client data: ", error);
            setState(false);
            handleAnimation(waitingTime);
        }
        finally{
            setRefresh((old)=>!old)
        }
    }

    function handleCake1(text) {
        if (/^\d*$/.test(text)) {
            const value = parseInt(text, 10)
            if (value <= stockGateau || isNaN(value))
                setNbGateau(text === "" ? 0 : value);
            else
                showMessage({
                    message: "Vous n'en avez pas suffisamment en stock",
                    type: "warning",
                });
            
        }
    }

    function handleCake2(text) {
        if (/^\d*$/.test(text)) {
            const value = parseInt(text, 10)
            console.log(value)
            console.log(value === NaN)
            if (value <= stockGateau2 || isNaN(value))
                setNbGateau2(text === "" ? 0 : value);
            else
                showMessage({
                    message: "Vous n'en avez pas suffisamment en stock",
                    type: "warning",
                });
        
        }
    }

    function handleCake3(text) {
        if (/^\d*$/.test(text)) {
            const value = parseInt(text, 10)
            if (value <= stockGateau3 || isNaN(value))
                setNbGateau3(text === "" ? 0 : value);
            else
                showMessage({
                    message: "Vous n'en avez pas suffisamment en stock",
                    type: "warning",
                });
        }
    }

    function handleScreenTap() {
        Keyboard.dismiss();
    }

    return (
        <TouchableWithoutFeedback onPress={handleScreenTap}>
            <View style={containerStyles.clientContainer}>
                <Modal visible={visible} animationType='fade' transparent={true} >
                    <Check state={state} title={"Client ajouté !"} />
                </Modal>

                <AntDesign name="addusergroup" size={30} color={PALETTE.white} />                
                <Text style={textStyles.title}>Bienvenue à ...</Text>

                <TextInput onChangeText={(e)=>setNom(e)} placeholder="Nom" style={containerStyles.inputContainer} />
                <TextInput onChangeText={(e)=>setAdresse(e)} placeholder="Adresse" style={containerStyles.inputContainer} />

                <View style={containerStyles.cakeContainer}>
                    <View style={{ width: "27%", flexDirection: "column" }}>
                        <Image source={require('../images/gateau1.jpg')} style={containerStyles.cake} />
                        <TextInput 
                            keyboardType='numeric' 
                            onChangeText={handleCake1} 
                            style={textStyles.cakeNumber}
                            placeholder='0'
                        />
                    </View>

                    <View style={{ width: "27%", flexDirection: "column" }}>
                        <Image source={require('../images/gateau3.jpg')} style={containerStyles.cake} />
                        <TextInput 
                            keyboardType='numeric' 
                            onChangeText={handleCake2} 
                            style={textStyles.cakeNumber}
                            placeholder='0'
                        />
                    </View>

                    <View style={{ width: "27%", flexDirection: "column" }}>
                        <Image source={require('../images/gateau2.jpg')} style={containerStyles.cake} />
                        <TextInput 
                            keyboardType='numeric' 
                            onChangeText={handleCake3} 
                            style={textStyles.cakeNumber}
                            placeholder='0'
                        />
                    </View>
                </View>

                <View style={{flex:0.1}}></View>
                <TouchableOpacity onPress={()=>handleAddClient()} style={{ ...buttonStyles.primaryButton, height:50, marginTop: "10%" }}>
                    <Text style={textStyles.secondaryText}>Ajoutez</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleVisible} style={{...buttonStyles.secondaryButton, height:50,}}>
                    <Text style={textStyles.primaryText}>Annuler</Text>
                </TouchableOpacity>
                <FlashMessage position="top"/>
            </View>
        </TouchableWithoutFeedback>
    );
}
