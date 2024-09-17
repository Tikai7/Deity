import React from 'react'
import { View,Text,ScrollView, TouchableOpacity, SafeAreaView } from 'react-native'
import { containerStyles, textStyles, buttonStyles, PALETTE } from '../styles/Styles'
import DrawerHeader from './DrawerHeader'
import { useContext } from 'react'
import { Data } from '../context/Data'

export default function CustomDrawer({navigation}) {
    
    const allCategories = ["Acceuil","Stock","Commandes","Paramètres"]
    const {currentScreen, setCurrentScreen} = useContext(Data)


    function handleParcours(p){
        setCurrentScreen(p)
        navigation.navigate(p)
    }

    function renderCategories({element}) {
        return (
            <View key={element}>
                <TouchableOpacity 
                    onPress={()=>{handleParcours(element)}} 
                    style={{...buttonStyles.drawerButton, backgroundColor: currentScreen === element ? PALETTE.primary : PALETTE.white}}
                >
                    <Text style={{...textStyles.drawerText, color: currentScreen === element ? PALETTE.white : PALETTE.primary}}>{element}</Text>
                </TouchableOpacity>
                <View style={containerStyles.lineContainer}/>
            </View>
        )
    }

    return (
        <SafeAreaView style={containerStyles.drawerContainer}>
            <DrawerHeader/>
            <ScrollView style={containerStyles.scrollViewContainer}>
                {allCategories.map(element => renderCategories({element}))}
            </ScrollView>
        </SafeAreaView>
    )
}