import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard, Modal, ScrollView } from 'react-native';
import { buttonStyles, containerStyles, PALETTE, textStyles } from '../styles/Styles';
import AntDesign from '@expo/vector-icons/AntDesign';
import Check from './Check';
import { generateUID, CLIENT_COUNT } from '../utils/Function';
import { storeMyData, getMyData } from '../utils/DataManager';
import { Data } from '../context/Data';
import { waitingTime } from '../utils/Function';
import { CAKE } from '../utils/Function';
import FlashMessage from "react-native-flash-message";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { showMessage } from "react-native-flash-message";


export default function Client({ 
    handleVisible, handleVisibleParent, selectedClient, title="Bienvenue à ..." , action="Ajouter",
    isHome=false

}) {

    const [placeholderNom, setPlaceholderNom] = useState("Nom")
    const [placeholderAdresse, setPlaceholderAdresse] = useState("Adresse")
    const [placeholderSecteur, setPlaceholderSecteur] = useState("Secteur")
    const [placeholderGateau1, setPlaceholderGateau1] = useState("0")
    const [placeholderGateau2, setPlaceholderGateau2] = useState("0")
    const [placeholderGateau3, setPlaceholderGateau3] = useState("0")

    const [placeholderPriceGateau1, setPlaceholderPriceGateau1] = useState("0 DZD")
    const [placeholderPriceGateau2, setPlaceholderPriceGateau2] = useState("0 DZD")
    const [placeholderPriceGateau3, setPlaceholderPriceGateau3] = useState("0 DZD")
    

    const [nom, setNom] = useState("");
    const [adresse, setAdresse] = useState("");
    const [secteur, setSecteur] = useState("");
    const [nbGateau, setNbGateau] = useState(0);
    const [nbGateau2, setNbGateau2] = useState(0);
    const [nbGateau3, setNbGateau3] = useState(0);
    const [dateAjout, setDateAjout] = useState(new Date());

    const [stockGateau, setStockGateau] = useState(0);
    const [stockGateau2, setStockGateau2] = useState(0);
    const [stockGateau3, setStockGateau3] = useState(0);

    const [prixGateau1, setPrixGateau1] = useState(0)
    const [prixGateau2, setPrixGateau2] = useState(0)
    const [prixGateau3, setPrixGateau3] = useState(0)


    const [visible, setVisible] = useState(false);
    const [state, setState] = useState(false);

    
    const {refresh, setRefresh, isIOS} = useContext(Data)


    async function handleAnimation(time) {
        setVisible(true);
        
        setTimeout(() => {
            setVisible(false);
        }, time);
    
        setTimeout(() => {
            handleVisible();
        }, time + 100); 

        setTimeout(() => {
            handleVisibleParent();
        }, (time + time/2)); 
        
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

        const setDataIfExist = () => {

            if (selectedClient !== undefined){

                if (selectedClient?.nom !== undefined){
                    setNom(selectedClient.nom)
                    setPlaceholderNom(selectedClient.nom)
                }

                if (selectedClient?.adresse !== undefined){
                    setAdresse(selectedClient.adresse)
                    setPlaceholderAdresse(selectedClient.adresse)
                }

                if (selectedClient?.secteur !== undefined){
                    setSecteur(selectedClient.secteur)
                    setPlaceholderSecteur(selectedClient.secteur)
                }

                if (selectedClient?.nbGateau !== undefined){
                    setNbGateau(selectedClient.nbGateau)
                    setPlaceholderGateau1(`${selectedClient.nbGateau}`)
                }

                if (selectedClient?.nbGateau2 !== undefined){
                    setNbGateau2(selectedClient.nbGateau2)
                    setPlaceholderGateau2(`${selectedClient.nbGateau2}`)
                }

                if (selectedClient?.nbGateau3 !== undefined){
                    setNbGateau3(selectedClient.nbGateau3)
                    setPlaceholderGateau3(`${selectedClient.nbGateau3}`)
                }

                if (selectedClient?.dateAjout !== undefined){
                    setDateAjout(selectedClient.dateAjout)
                }

                if (selectedClient?.prixGateau1 !== undefined){
                    setPrixGateau1(selectedClient.prixGateau1)
                    setPlaceholderPriceGateau1(`${selectedClient.prixGateau1} DZD`)
                }
                if (selectedClient?.prixGateau2 !== undefined){
                    setPrixGateau2(selectedClient.prixGateau2)
                    setPlaceholderPriceGateau2(`${selectedClient.prixGateau2} DZD`)
                }
                if (selectedClient?.prixGateau3 !== undefined){
                    setPrixGateau3(selectedClient.prixGateau3)
                    setPlaceholderPriceGateau3(`${selectedClient.prixGateau3} DZD`)
                }

            }
            console.log("[INFO] Selected client : ", selectedClient)

        }

        getData()
        setDataIfExist()

    },[refresh])

    useEffect(()=>{
          const setDataIfExist = () => {

            if (selectedClient !== undefined){

                if (selectedClient?.nom !== undefined){
                    setNom(selectedClient.nom)
                    setPlaceholderNom(selectedClient.nom)
                }

                if (selectedClient?.adresse !== undefined){
                    setAdresse(selectedClient.adresse)
                    setPlaceholderAdresse(selectedClient.adresse)
                }

                if (selectedClient?.nbGateau !== undefined){
                    setNbGateau(selectedClient.nbGateau)
                    setPlaceholderGateau1(`${selectedClient.nbGateau}`)
                }

                if (selectedClient?.nbGateau2 !== undefined){
                    setNbGateau2(selectedClient.nbGateau2)
                    setPlaceholderGateau2(`${selectedClient.nbGateau2}`)
                }

                if (selectedClient?.nbGateau3 !== undefined){
                    setNbGateau3(selectedClient.nbGateau3)
                    setPlaceholderGateau3(`${selectedClient.nbGateau3}`)
                }

                if (selectedClient?.dateAjout !== undefined){
                    setDateAjout(selectedClient.dateAjout)
                }

                if (selectedClient?.prixGateau1 !== undefined){
                    setPrixGateau1(selectedClient.prixGateau1)
                    setPlaceholderPriceGateau1(`${selectedClient.prixGateau1} DZD`)
                }
                if (selectedClient?.prixGateau2 !== undefined){
                    setPrixGateau2(selectedClient.prixGateau2)
                    setPlaceholderPriceGateau2(`${selectedClient.prixGateau2} DZD`)
                }
                if (selectedClient?.prixGateau3 !== undefined){
                    setPrixGateau3(selectedClient.prixGateau3)
                    setPlaceholderPriceGateau3(`${selectedClient.prixGateau3} DZD`)
                }
            }
            console.log("[INFO] Selected client changed : ", selectedClient)

        }

        setDataIfExist()
    },[selectedClient])

    async function addToHistory(client) {
        try {
            const history = await getMyData(client.groupUID+"_history")
            if (history === null){
                await storeMyData(client.groupUID+"_history", [client])
            }
            else{
                const newHistory = [...history, client]
                await storeMyData(client.groupUID+"_history", newHistory)
            }
            return true
        } catch (error) {
            console.error("[ERROR] Error storing client data in history: ", error);
            return false
        }
    }

    
    function notGoodClient(){


        if ((!nbGateau && !nbGateau2 && !nbGateau3)){
            showMessage({
                message: "Le nombre de gateaux doit être supérieure à 0",
                type: "danger",
            });
            return true
        }

        if (nom == "" || adresse == "" || secteur == ""){
            showMessage({
                message: "Le nom, l'adresse et le secteur doivent être renseignés",
                type: "danger",
            });
            return true
        }

        if ((prixGateau1 <= 0) || (prixGateau2 <= 0) || (prixGateau3 <= 0)){
            showMessage({
                message: "Le prix des gateaux ne peut pas être négatif ou non renseigné",
                type: "danger",
            });
            return true
        }

        return false
    }

    async function handleAddClient(isUpdating) {
        try {

            if (notGoodClient()){
                console.log("[WARNING] Client not completed")
                return
            }

            let totalCake1 = stockGateau - nbGateau 
            let totalCake2 = stockGateau2 - nbGateau2 
            let totalCake3 = stockGateau3 - nbGateau3 

            if (selectedClient?.nbGateau !== undefined && isUpdating){
                totalCake1 += selectedClient.nbGateau
            }

            if (selectedClient?.nbGateau2 !== undefined && isUpdating){
                totalCake2 += selectedClient.nbGateau2
            }

            if (selectedClient?.nbGateau3 !== undefined && isUpdating){
                totalCake3 += selectedClient.nbGateau3
            }   

            if (totalCake1 < 0 || totalCake2 < 0 || totalCake3 < 0){
                console.log("[ERROR] Stock insuffisant")
                showMessage({
                    message: "Le Stock est insuffisant !",
                    type: "danger",
                });
                return 
            }
            
            await storeMyData(`${CAKE}1`, totalCake1)
            await storeMyData(`${CAKE}2`, totalCake2)
            await storeMyData(`${CAKE}3`, totalCake3)

            let uid = generateUID("CLIENT")
            let groupUID = generateUID("GROUP")
            if (selectedClient?.groupUID !== undefined){
                groupUID = selectedClient.groupUID
            }


            let clientCount = await getMyData(CLIENT_COUNT)


            if (clientCount === null)
                clientCount = 0
            else 
                clientCount = parseInt(clientCount);
            
            console.log("[INFO] Client count : ", clientCount)

            const keyToStore =  selectedClient?.key || `${clientCount+1}`
            const client = {
                nom: nom,
                key : keyToStore,
                adresse: adresse,
                nbGateau: nbGateau,
                nbGateau2: nbGateau2,
                nbGateau3: nbGateau3,
                dateAjout : dateAjout,
                dateAjoutDB : new Date(),
                secteur: secteur,
                prixTotal: (nbGateau * prixGateau1) + (nbGateau2 * prixGateau2) + (nbGateau3 * prixGateau3),
                prixGateau1: prixGateau1,
                prixGateau2: prixGateau2,
                prixGateau3: prixGateau3,
                uid: uid,
                groupUID: groupUID,
                isUpdated : isUpdating
            }

            const s = await storeMyData(keyToStore, client)
            console.log("[INFO] Client stored state: ", s)
            
            let s3 = true
            if (action !== "Ajouter commande"){
                clientCount = clientCount+1
                s3 = await addToHistory(client)
                console.log("[INFO] Client added to history : ", s3)
            }
            else{
                s3 = await addToHistory(client)
                console.log("[INFO] Client added to history : ", s3)
            }
            

            const s2 = await storeMyData(CLIENT_COUNT, `${clientCount}`)
            console.log("[INFO] Client count stored state: ", s2)
            setState(s && s2 && s3);
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
            if (!(value <= stockGateau || isNaN(value)))
                showMessage({
                    message: "Attention, vous n'en avez pas suffisamment en stock si vous souhaitez ajouter une commande",
                    type: "warning",
                });
            setNbGateau(text === "" ? 0 : value);
        }
    }

    function handleCake2(text) {
        if (/^\d*$/.test(text)) {
            const value = parseInt(text, 10)
            if (!(value <= stockGateau2 || isNaN(value)))
                showMessage({
                    message: "Attention, vous n'en avez pas suffisamment en stock si vous souhaitez ajouter une commande",
                    type: "warning",
                });

            setNbGateau2(text === "" ? 0 : value);

        }
    }

    function handleCake3(text) {
        if (/^\d*$/.test(text)) {
            const value = parseInt(text, 10)
            if (!(value <= stockGateau3 || isNaN(value)))
                showMessage({
                    message: "Attention, vous n'en avez pas suffisamment en stock si vous souhaitez ajouter une commande",
                    type: "warning",
                });

            setNbGateau3(text === "" ? 0 : value);
        }
    }

    function handleScreenTap() {
        Keyboard.dismiss();
    }

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

    return (
        <TouchableWithoutFeedback onPress={handleScreenTap}>
            <ScrollView style={{backgroundColor:PALETTE.primary, paddingTop: isIOS ? "35%" : "15%", width:"100%"}}>
            <View style={containerStyles.clientContainer}>


                <View style={{flex:1,flexDirection:"row",marginTop: isIOS ? "-10%" : "0%", marginBottom:"10%", justifyContent:"space-around"}}>
                    <TouchableOpacity style={{marginLeft:"10%", zIndex:99}} onPress={handleVisible}>
                        <MaterialIcons name="arrow-back" size={30} color={PALETTE.white} />
                    </TouchableOpacity>
                    <Text style={{...textStyles.title, fontSize:25, marginLeft:"-8%"}}>{title}</Text>
                    {/* <AntDesign name="addusergroup" size={30} color={PALETTE.white} />                 */}

                </View>
                <Modal visible={visible} animationType='fade' transparent={true} >
                    <Check state={state} title={action !== "Ajouter commande" ? "Client ajouté !" : "Client modifié !"} />
                </Modal>

                {/* <AntDesign name="addusergroup" size={30} color={PALETTE.white} />                
                <Text style={textStyles.title}>{title}</Text> */}

                <TextInput defaultValue={action==="Ajouter commande" ? placeholderNom : ""} maxLength={30} onChangeText={(e)=>setNom(e)} placeholder={placeholderNom} style={containerStyles.inputContainer} />
                <TextInput defaultValue={action==="Ajouter commande" ? placeholderAdresse: ""} maxLength={40} onChangeText={(e)=>setAdresse(e)} placeholder={placeholderAdresse} style={containerStyles.inputContainer} />
                <TextInput defaultValue={action==="Ajouter commande" ? placeholderSecteur : ""} maxLength={30} onChangeText={(e)=>setSecteur(e)} placeholder={placeholderSecteur} style={containerStyles.inputContainer} />
                
                <View style={containerStyles.cakeContainer}>
                    <View style={{ width: "27%", flexDirection: "column" }}>
                        <Image source={require('../images/gateau1.jpg')} style={containerStyles.cake} />
                        <TextInput 
                            keyboardType='numeric' 
                            onChangeText={handleCake1} 
                            style={textStyles.cakeNumber}
                            placeholder={placeholderGateau1}
                            maxLength={5}
                        />
                        <View style={{height:"5%"}}/>

                        <TextInput 
                            keyboardType='numeric' 
                            onChangeText={(text) => handleCakePrice(text, "1")} 
                            style={textStyles.cakePrice}
                            placeholder={placeholderPriceGateau1}
                            maxLength={4}
                        />
                    </View>

                    <View style={{ width: "27%", flexDirection: "column" }}>
                        <Image source={require('../images/gateau2.jpg')} style={containerStyles.cake} />
                        <TextInput 
                            keyboardType='numeric' 
                            onChangeText={handleCake2} 
                            style={textStyles.cakeNumber}
                            placeholder={placeholderGateau2}
                            maxLength={5}
                        />
                        <View style={{height:"5%"}}/>

                        <TextInput 
                            keyboardType='numeric' 
                            onChangeText={(text) => handleCakePrice(text, "2")} 
                            style={textStyles.cakePrice}
                            placeholder={placeholderPriceGateau2}
                            maxLength={4}
                        />
                    </View>

                    <View style={{ width: "27%", flexDirection: "column" }}>
                        <Image source={require('../images/gateau3.jpg')} style={containerStyles.cake} />
                        <TextInput 
                            keyboardType='numeric' 
                            onChangeText={handleCake3} 
                            style={textStyles.cakeNumber}
                            placeholder={placeholderGateau3}
                            maxLength={5}
                        />
                        <View style={{height:"5%"}}/>
                        <TextInput 
                            keyboardType='numeric' 
                            onChangeText={(text) => handleCakePrice(text, "3")} 
                            style={textStyles.cakePrice}
                            placeholder={placeholderPriceGateau3}
                            maxLength={4}
                        />
                    </View>
                </View>

                <View style={{flex:0.1}}></View>
                <TouchableOpacity onPress={()=>handleAddClient(false)} style={{ ...buttonStyles.primaryButton, height:50, marginTop: "20%" }}>
                    <Text style={textStyles.secondaryText}>{action}</Text>
                </TouchableOpacity>

                {action !== "Ajouter" && 
                    <TouchableOpacity onPress={()=>handleAddClient(true)} style={{...buttonStyles.secondaryButton, height:50,}}>
                        <Text style={textStyles.primaryText}>Modifier la commande</Text>
                    </TouchableOpacity>
                }

            </View>
            <FlashMessage position="top" style={{marginTop: isIOS ? "-35%" : "0%"}}/>

            </ScrollView>
        </TouchableWithoutFeedback>
    );
}
