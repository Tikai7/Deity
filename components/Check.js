
import React from "react";
import { View, Text } from "react-native";
import LottieView from "lottie-react-native";
import { containerStyles, PALETTE, textStyles } from "../styles/Styles";

export default function Check({state, title}){
    return(
        <View style={{...containerStyles.mainContainer, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
            <View style={ {
                width: 300,
                padding: 20,
                backgroundColor: PALETTE.white,
                borderRadius: 10,
                alignItems: 'center',
            }}>
                <View>
                    <Text style={{
                        ...textStyles.secondaryText, 
                        fontSize:20, color
                        : state ? PALETTE.success : PALETTE.error
                    }}
                    >
                    {state ? `${title}` : "Une erreur est survenue"}
                    </Text>
                </View>
                <View>
                    <LottieView
                        source={state ? require("../lottie/check.json") : require("../lottie/error.json")}
                        autoPlay
                        loop
                        style={{width: state ? 200 : 300,height: state ? 200 : 300}}
                    />
                </View>
            </View>
        </View>
    );
}