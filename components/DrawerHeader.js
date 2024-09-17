
import React from 'react';
import { View, Image } from 'react-native';
import { containerStyles } from '../styles/Styles';


export default function DrawerHeader() {
    return (
        <View style={containerStyles.drawerImageContainer}>
            <Image
                source={require('../images/logoDeity.jpg')}
                style={containerStyles.drawerImage}
            />
        </View>
    );
}