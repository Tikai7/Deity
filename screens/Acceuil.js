
import React, {useRef, useEffect, useState} from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, Modal } from 'react-native';
import { buttonStyles, containerStyles, PALETTE, textStyles } from '../styles/Styles';
import AntDesign from '@expo/vector-icons/AntDesign';
import LottieView from 'lottie-react-native';
import Client from '../components/Client';


export default function Acceuil(){

	const [visible, setVisible] = useState(false);
    const lottieRef = useRef(null)

    useEffect(() => {
        if (lottieRef.current) {
          setTimeout(() => {
            lottieRef.current?.play();
          }, 100);
        }
    }, [lottieRef.current]);

	function handleVisible(){
		setVisible((old)=>!old);
	}
    return(
        <SafeAreaView style={containerStyles.mainContainer}>
			<Modal visible={visible} animationType='slide' >
				<Client handleVisible={handleVisible}/>
			</Modal>

            <View style={containerStyles.lottieContainer}>
                <LottieView 
                    ref={lottieRef}
                    source={require('../lottie/new_client.json')} 
                    autoPlay 
                    loop 
                    speed={1.2}
                    style={{width:300,height:300,marginBottom:"5%"}}
                    renderMode={"SOFTWARE"}
                />
            </View>
			<TouchableOpacity onPress={handleVisible} style={{...buttonStyles.primaryButton, flexDirection:"row", justifyContent:"space-around"}}>
				<View style={{marginLeft:"10%"}}>
					<AntDesign name="plus" size={24} color={PALETTE.primary} />
				</View>
				<Text style={{...textStyles.secondaryText, flex: 1, marginLeft:"-15%"}}>Ajoutez un client</Text>
			</TouchableOpacity>
        </SafeAreaView>
    ); 
}