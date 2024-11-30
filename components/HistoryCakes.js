import { useRef, useEffect, useState, useContext } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { textStyles, containerStyles, PALETTE } from "../styles/Styles";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import LottieView from "lottie-react-native";
import { convertDate } from "../utils/Function";
import { getMyData } from "../utils/DataManager";
import { Data } from "../context/Data";

export default function HistoryCakes({handleVisible, history_type, info_type}){
    const [history, setHistory] = useState([]);
    const lottieRef = useRef(null);
    const {refresh, isIOS} = useContext(Data)

    useEffect(() => {
        const getHistory = async () => {
            const historyData = await getMyData(history_type);
            if (historyData === null) {
                console.log("[INFO] History is empty");
                return;
            }
            console.log("[INFO] History length : ", historyData.length);
            setHistory([...historyData]);
        };
        getHistory();
    }, [refresh]);

    function renderCommande({ item, index }) {
        return (
            <View key={index} style={{ justifyContent: "flex-start", alignItems: "flex-start", paddingVertical: 10, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: PALETTE.tertiary }}>
                <Text style={{ ...textStyles.primaryText, color: PALETTE.white }}>Modification #{index + 1}</Text>
                <Text style={{ ...textStyles.secondaryText, color: PALETTE.tertiary, marginTop: 2 }}>{`${info_type} gâteaux 1 : ${item.gateau1}`}</Text>
                <Text style={{ ...textStyles.secondaryText, color: PALETTE.tertiary, marginTop: 2 }}>{`${info_type} gâteaux 2 : ${item.gateau2}`}</Text>
                <Text style={{ ...textStyles.secondaryText, color: PALETTE.tertiary, marginTop: 2 }}>{`${info_type} gâteaux 3 : ${item.gateau3}`}</Text>
                <Text style={{ ...textStyles.secondaryText, color: PALETTE.tertiary, marginTop: 2 }}>{`Date de modification : ${convertDate(item.date)}`}</Text>
            </View>
        );
    }

    return (
        <View style={{ backgroundColor: PALETTE.primary, paddingTop: isIOS ? "25%" : "15%", paddingHorizontal: 35, flex: 1, paddingBottom:"10%"}}>
            <View style={{ flexDirection: "row", marginBottom: "5%", justifyContent: "space-around" }}>
                <TouchableOpacity onPress={handleVisible}>
                    <MaterialIcons name="arrow-back" size={30} color={PALETTE.white}/>
                </TouchableOpacity>
                <Text style={{ ...textStyles.title, fontSize: 25, alignSelf: "center" }}>{`Historique ${info_type}`}</Text>
            </View>
            
            {history.length === 0 ? (
                <View style={{ ...containerStyles.lottieContainer, backgroundColor: PALETTE.primary }}>
                    <MaterialIcons name="history" size={24} color={PALETTE.tertiary} />
                    <Text style={{ ...textStyles.title, color: PALETTE.tertiary, fontSize: 20 }}>Rien pour l'instant !</Text>
                    <LottieView
                        ref={lottieRef}
                        source={require('../lottie/cake.json')}
                        autoPlay
                        loop
                        speed={1.2}
                        style={{ width: 300, height: 300, marginBottom: "5%", marginLeft: "7%" }}
                        renderMode={"SOFTWARE"}
                    />
                </View>
            ) : (
                <FlatList
                    data={history}
                    renderItem={renderCommande}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
}
