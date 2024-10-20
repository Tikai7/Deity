import React, {useEffect, useRef, useState} from 'react';
import { Modal, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { containerStyles, PALETTE, textStyles } from '../styles/Styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Prices from '../components/Prices';
import Ionicons from '@expo/vector-icons/Ionicons';
import History from '../components/History';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Database from '../components/Database';

export default function Parametres() {
    const lottieRef = useRef(null);
    const [visiblePrices, setVisiblePrices] = useState(false);  
    const [visibleData, setVisibleData] = useState(false);
    const [visibleHistory, setVisibleHistory] = useState(false);


    useEffect(() => {
        if (lottieRef.current) {
            setTimeout(() => {
                lottieRef.current?.play();
            }, 100);
        }
    }, [lottieRef.current]);

    function handleVisible(type) {
        if (type === "prices"){
            setVisiblePrices((old) => !old);
            setVisibleData(false);
            setVisibleHistory(false);
        }
        else if (type === "data"){
            setVisibleData((old) => !old);
            setVisiblePrices(false);
            setVisibleHistory(false);
        }
        else if (type === "history"){
            setVisibleHistory((old) => !old);
            setVisiblePrices(false);
            setVisibleData(false);
        }
    }

    return (
        <SafeAreaView style={containerStyles.mainContainer}>
            <Ionicons name="settings-outline" style={{marginTop:"10%"}} size={24} color="white" />
            <Text style={{...textStyles.title, fontSize:26}}>Des choses à régler ?</Text>
            <ScrollView style={{...containerStyles.scrollViewContainer, width:"100%", backgroundColor:PALETTE.primary}}>
                <Modal visible={visiblePrices} animationType='slide' >
                    <Prices handleVisible={() => handleVisible("prices")} />
                </Modal>

                <Modal visible={visibleHistory} animationType='slide' >
                    <History handleVisible={() => handleVisible("history")} />
                </Modal>

                <Modal visible={visibleData} animationType='slide' >
                    <Database handleVisible={() => handleVisible("data")} />
                </Modal>

                <View style={containerStyles.parametersContainer}>
                    
                    <TouchableOpacity style={{width:"100%"}} onPress={() => handleVisible("prices")}>
                        <View style={{
                            ...containerStyles.commandeContainer, 
                            marginTop:"0%", 
                            backgroundColor:PALETTE.primary,
                            flexDirection: 'row', 
                            alignItems: 'center'
                        }}>
                            <MaterialIcons name="attach-money" size={24} color={PALETTE.white} style={{ marginRight: 10 }} />
                            <Text style={textStyles.primaryText}>Prix produits</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={{width:"100%"}} onPress={() => handleVisible("history")}>
                        <View style={{
                            ...containerStyles.commandeContainer, 
                            backgroundColor:PALETTE.primary,
                            flexDirection: 'row', 
                            alignItems: 'center'
                        }}>
                            <MaterialIcons name="history" size={24} color={PALETTE.white} style={{ marginRight: 10 }} />
                            <Text style={textStyles.primaryText}>Historique</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={{width:"100%"}} onPress={() => handleVisible("data")}>
                        <View style={{
                            ...containerStyles.commandeContainer, 
                            backgroundColor:PALETTE.primary,
                            flexDirection: 'row', 
                            alignItems: 'center',
                        }}>
                            {/* <MaterialCommunityIcons name="database-sync-outline" size={24} color="black" /> */}
                            <MaterialCommunityIcons name="database-outline" size={24} color={PALETTE.white} style={{ marginRight: 10 }} />
                            <Text style={textStyles.primaryText}>Données</Text>
                        </View>
                    </TouchableOpacity>

                </View>
            </ScrollView>

            {/* <View style={{...containerStyles.lottieContainer, backgroundColor:PALETTE.primary}}>
                <MaterialIcons name="settings" size={24} color={PALETTE.white} />
                <Text style={{...textStyles.title, fontSize:26}}>Rien pour l'instant !</Text>
                <LottieView 
                    ref={lottieRef}
                    source={require('../lottie/cake.json')} 
                    autoPlay 
                    loop 
                    speed={1.2}
                    style={{width:300, height:300, marginBottom:"5%", marginLeft:"7%"}}
                    renderMode={"SOFTWARE"}
                />
            </View> */}
        </SafeAreaView>
    ); 
}
