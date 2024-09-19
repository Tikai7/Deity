
import React, {useContext} from "react";
import { View, Text, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import { containerStyles, PALETTE, textStyles } from "../styles/Styles";
import { deleteItem, getMyData, storeMyData } from '../utils/DataManager';
import { CLIENT_COUNT } from "../utils/Function";
import { Data } from "../context/Data";



export default function Validate({handleVisible,handleVisibleParent, selectedClient }){

    const {setRefresh} = useContext(Data)

    async function deleteClient() {
        await deleteItem(`${selectedClient.key}`)
        // const clientCount = await getMyData(CLIENT_COUNT)
        // await storeMyData(CLIENT_COUNT, clientCount-1)
        setRefresh(old=>!old)
        handleVisible()
        handleVisibleParent()
    }
    

    return(
        <View style={{...containerStyles.mainContainer, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
            <View style={ {
                width: 300,
                padding: 20,
                backgroundColor: PALETTE.white,
                borderRadius: 10,
                alignItems: 'center',
            }}>
               <Text style={textStyles.secondaryText}>Voulez vous vraiment supprimer {'\n'}{selectedClient.nom} ?</Text>

                <View style={{flexDirection:"row", justifyContent:"space-around", width:"100%", marginTop:20}}>
                    <TouchableOpacity onPress={handleVisible} style={{backgroundColor:PALETTE.primary, padding:10, borderRadius:5}}>
                        <Text style={textStyles.primaryText}>Annuler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={deleteClient} style={{backgroundColor:PALETTE.error, padding:10, borderRadius:5}}>
                        <Text style={textStyles.primaryText}>Supprimer</Text>
                    </TouchableOpacity>
                </View>
                

            </View>
        </View>
    );
}