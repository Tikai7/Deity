import React, {useEffect, useRef} from "react";
import { View,Text } from "react-native";
import { containerStyles, PALETTE, textStyles } from "../styles/Styles";
import LottieView from "lottie-react-native";

export default function Nothing() {
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
            <Text style={textStyles.title}>Vous n'avez pas de commandes !</Text>
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