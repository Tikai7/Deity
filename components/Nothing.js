import React, {useEffect, useRef, useContext} from "react";
import { View,Text,TouchableOpacity } from "react-native";
import { containerStyles, PALETTE, textStyles } from "../styles/Styles";
import LottieView from "lottie-react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Data } from "../context/Data";


export default function Nothing({text, handleBack}) {
    const lottieRef = useRef(null)
    const {isIOS} = useContext(Data)

    useEffect(() => {
        if (lottieRef.current) {
          setTimeout(() => {
            lottieRef.current?.play();
          }, 100);
        }
    }, [lottieRef.current]);

    return(
        <View style={{...containerStyles.lottieContainer, backgroundColor:PALETTE.primary}}>
            <View style={{flex:0.5,flexDirection: "row", marginTop: isIOS ? "-20%" : "0%", alignItems:"center",justifyContent: "space-around" }}>
                <TouchableOpacity style={{ marginRight: "-12%", zIndex: 99 }} onPress={handleBack}>
                    <MaterialIcons name="arrow-back" size={30} color={PALETTE.white} />
                </TouchableOpacity>
                <Text style={{ ...textStyles.title, marginBottom:0, fontSize: 25, marginRight: "-9%", alignSelf: "center" }}>Clients</Text>
                
            </View>
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