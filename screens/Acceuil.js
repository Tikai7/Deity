
import React, {useRef, useEffect, useState} from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, Modal, Image} from 'react-native';
import { buttonStyles, containerStyles, PALETTE, textStyles } from '../styles/Styles';
import AntDesign from '@expo/vector-icons/AntDesign';
import LottieView from 'lottie-react-native';
import Client from '../components/Client';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


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
				<Client handleVisible={handleVisible} handleVisibleParent={()=>{}}/>
			</Modal>

            <View style={{...containerStyles.lottieContainer, marginTop:"-5%", marginBottom:"20%"}}>
                <MaterialCommunityIcons name="chef-hat" size={24} color="white" />
                <Text style={{...textStyles.title, fontSize:26}}>Bienvenue Patron</Text>
                <Image
                    source={require('../images/logoDeity.jpg')}
                    style={{width:200, height:200, borderRadius:40}}
                />              
            </View>
			<TouchableOpacity onPress={handleVisible} style={{...buttonStyles.primaryButton, flexDirection:"row", marginBottom:"15%", justifyContent:"space-around"}}>
				<View style={{marginLeft:"10%"}}>
					<AntDesign name="plus" size={24} color={PALETTE.primary} />
				</View>
				<Text style={{...textStyles.secondaryText, flex: 1, marginLeft:"-15%"}}>Ajoutez un client</Text>
			</TouchableOpacity>
        </SafeAreaView>
    ); 
}