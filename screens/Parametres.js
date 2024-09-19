
import React, {useEffect, useRef} from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { containerStyles, PALETTE, textStyles } from '../styles/Styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';

export default function Parametres(){
    const lottieRef = useRef(null)

    useEffect(() => {
        if (lottieRef.current) {
          setTimeout(() => {
            lottieRef.current?.play();
          }, 100);
        }
    }, [lottieRef.current]);

    return(
        <SafeAreaView style={containerStyles.mainContainer}>
            <View style={{...containerStyles.lottieContainer, backgroundColor:PALETTE.primary}}>
                <MaterialIcons name="settings" size={24} color={PALETTE.white} />
                <Text style={{...textStyles.title, fontSize:26}}>Rien pour l'instant !</Text>
                <LottieView 
                    ref={lottieRef}
                    source={require('../lottie/cake.json')} 
                    autoPlay 
                    loop 
                    speed={1.2}
                    style={{width:300,height:300,marginBottom:"5%", marginLeft:"7%"}}
                    renderMode={"SOFTWARE"}
                />
            </View>
        </SafeAreaView>
    ); 
}