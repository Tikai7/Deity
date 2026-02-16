import React from 'react';
import { Text, View, TouchableOpacity, Modal } from 'react-native';
import { containerStyles, textStyles, PALETTE } from '../styles/Styles';
import { Entypo } from '@expo/vector-icons'; 
import { useState } from 'react';
import Feather from '@expo/vector-icons/Feather';
import Commande from '../screens/Commande';

export default function Header({route,navigation}) {

    const [visibleClients, setVisibleClients] = useState(false)

    function handleDrawer(){
        navigation.openDrawer()
    }

    function handleShowClient(){
        setVisibleClients(old=>!old)
    }

    return (
        <View style={containerStyles.headerContainer}>
            <Modal visible={visibleClients} animationType='slide' >
                <Commande isOnlyToShowClients={true} handleVisibleClients={handleShowClient}/>
            </Modal>

            {
                route.name == "Acceuil" ? 
                    <TouchableOpacity onPress={handleShowClient}>
                        <Feather 
                            style={{alignItems:"flex-start", paddingRight:"5%"}}
                            name="users"
                            size={24}
                            color={PALETTE.white}
                        />         
                    </TouchableOpacity>
                : null
            }
            {
                route.name == "Acceuil" ? 
                <Text style={{...textStyles.headerText, marginLeft:'0%'}}>{route.name}</Text> : 
                <Text style={{...textStyles.headerText}}>{route.name}</Text>
            }
            <TouchableOpacity onPress={handleDrawer}>
                <Entypo 
                    style={{alignItems:"flex-start",paddingLeft:"5%"}} 
                    name="menu"  
                    size={27} 
                    color={PALETTE.white} 
                />
            </TouchableOpacity>
        </View>
    )
}