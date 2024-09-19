
import React, {useContext, useEffect, useState} from 'react';
import { Text, ScrollView, View, TextInput, Image, Keyboard, TouchableWithoutFeedback, TouchableOpacity, Modal } from 'react-native';
import { buttonStyles, containerStyles, PALETTE, textStyles } from '../styles/Styles';
import { getMyData, storeMyData } from '../utils/DataManager';
import Check from '../components/Check';
import { CAKE } from '../utils/Function';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Data } from '../context/Data';
import { waitingTime } from '../utils/Function';

export default function Stock(){

    const [nbGateau, setNbGateau] = useState(0);
    const [nbGateau2, setNbGateau2] = useState(0);
    const [nbGateau3, setNbGateau3] = useState(0);
    const [visible, setVisible] = useState(false);
    const [state, setState] = useState(false);
    const {refresh, setRefresh} = useContext(Data)


    useEffect(() => {
        const getData = async () => {
            const g1 = await getMyData(`${CAKE}1`)
            const g2 = await getMyData(`${CAKE}2`)
            const g3 = await getMyData(`${CAKE}3`)
            
            console.log("[INFO] Stock Gateau 1 : ", g1)
            console.log("[INFO] Stock Gateau 2 : ", g2)
            console.log("[INFO] Stock Gateau 3 : ", g3)

            if (g1 !== null)
                setNbGateau(g1)
            else
                setNbGateau(0)
            if (g2 !== null)
                setNbGateau2(g2)
            else
                setNbGateau2(0)
            if (g3 !== null)
                setNbGateau3(g3)
            else
                setNbGateau3(0)
        }

        getData()
    },[refresh])


    async function handleAnimation(time) {
        setVisible(true);
        setTimeout(() => {
            setVisible(false);
        } , time);
    }


    async function handleConfirm() {
        try {
            const s = await storeMyData(`${CAKE}1`, nbGateau)
            const s2 = await storeMyData(`${CAKE}2`, nbGateau2)
            const s3 = await storeMyData(`${CAKE}3`, nbGateau3)

            setState(s && s2 && s3);
            handleAnimation(waitingTime);
        } catch (error) {
            console.error("[ERROR] Error storing client stock: ", error);
            setState(false);
            handleAnimation(waitingTime);
        } 
        finally{
            setRefresh((old)=>!old)
        }
    }




    function handleCake1(text) {
        if (/^\d*$/.test(text)) {
            setNbGateau(text === "" ? 0 : parseInt(text, 10));
        }
    }

    function handleCake2(text) {
        if (/^\d*$/.test(text)) {
            setNbGateau2(text === "" ? 0 : parseInt(text, 10));
        }
    }

    function handleCake3(text) {
        if (/^\d*$/.test(text)) {
            setNbGateau3(text === "" ? 0 : parseInt(text, 10));
        }
    }

    function handleKeyboard(){
        Keyboard.dismiss()
    }

    return(
        <ScrollView style={{backgroundColor:PALETTE.primary, paddingTop:"10%", width:"100%"}}>
        <TouchableWithoutFeedback onPress={handleKeyboard}>
            <View style={containerStyles.mainContainer}>              
                <Modal visible={visible} animationType='fade' transparent={true} >
                    <Check state={state} title={"Stock mis à jour !"} />
                </Modal>  
                <MaterialIcons name="trolley" size={24} color={PALETTE.white} />
                <Text style={{...textStyles.title, marginBottom:"5%", fontSize:26}}>On fait le plein ?!</Text>
                <View style={{...containerStyles.cakeContainer,flexWrap:"wrap", width:"100%"}}>
                    <View style={{ width: "50%", alignItems:"center", flexDirection: "column" }}>
                        <MaterialIcons name="cake" size={100} style={{marginBottom:"20%"}} color={PALETTE.white} />
                    </View>
                    <View style={{ width: "50%", alignItems:"center", flexDirection: "column" }}>
                        <Image source={require('../images/gateau1.jpg')} style={{...containerStyles.cake, width:120, height:120}} />
                        <TextInput 
                            keyboardType='numeric' 
                            onChangeText={handleCake1} 
                            style={{...textStyles.cakeNumber, fontSize:18, width:"30%", marginTop:"5%", marginBottom:"10%",color:PALETTE.white}}
                            defaultValue={nbGateau.toString()}
                        />
                    </View>
                    <View style={{ width: "50%", alignItems:"center", flexDirection: "column" }}>
                        <Image source={require('../images/gateau3.jpg')} style={{...containerStyles.cake, width:120, height:120}} />
                        <TextInput 
                            keyboardType='numeric' 
                            onChangeText={handleCake2} 
                            style={{...textStyles.cakeNumber, fontSize:18, width:"30%", marginTop:"5%", marginBottom:"10%",color:PALETTE.white}}
                            defaultValue={nbGateau2.toString()}
                        />
                    </View>
                    <View style={{ width: "50%", alignItems:"center", flexDirection: "column" }}>
                        <Image source={require('../images/gateau2.jpg')} style={{...containerStyles.cake, width:120, height:120}} />
                        <TextInput 
                            keyboardType='numeric' 
                            onChangeText={handleCake3} 
                            style={{...textStyles.cakeNumber, fontSize:18, width:"30%", marginTop:"5%", marginBottom:"10%",color:PALETTE.white}}
                            defaultValue={nbGateau3.toString()}
                        />
                    </View>
                </View>
                <TouchableOpacity onPress={()=>handleConfirm()} style={{ ...buttonStyles.primaryButton, marginTop:"10%",height:50}}>
                    <Text style={textStyles.secondaryText}>Confirmer</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
        </ScrollView>
    ); 
}