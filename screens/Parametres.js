
import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { containerStyles, textStyles } from '../styles/Styles';

export default function Parametres(){
    return(
        <SafeAreaView style={containerStyles.mainContainer}>
            <Text style={textStyles.title}>T'es nul au foot</Text>
        </SafeAreaView>
    ); 
}