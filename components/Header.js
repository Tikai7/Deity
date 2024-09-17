import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { containerStyles, textStyles, PALETTE } from '../styles/Styles';
import { Entypo } from '@expo/vector-icons'; 

export default function Header({route,navigation}) {

    function handleDrawer(){
        navigation.openDrawer()
    }

    return (
        <View style={containerStyles.headerContainer}>
            <Text style={textStyles.headerText}>{route.name}</Text>
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