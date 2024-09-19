import React, {useEffect, useRef} from "react";
import { View,Text } from "react-native";
import { containerStyles, PALETTE, textStyles } from "../styles/Styles";
import LottieView from "lottie-react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Nothing({text}) {
    const lottieRef = useRef(null)

    useEffect(() => {
        if (lottieRef.current) {
          setTimeout(() => {
            lottieRef.current?.play();
          }, 100);
        }
    }, [lottieRef.current]);

    return(
        <View style={{...containerStyles.lottieContainer, backgroundColor:PALETTE.primary}}>
            <MaterialIcons name="shopping-cart-checkout" size={24} color={PALETTE.white} />
            <Text style={{...textStyles.title, fontSize:26}}>{text}</Text>
            <LottieView 
                ref={lottieRef}
                source={require('../lottie/nothing.json')} 
                autoPlay 
                loop 
                speed={1.2}
                style={{width:300,height:300,marginBottom:"5%"}}
                renderMode={"SOFTWARE"}
            />
        </View>
    )
    
}