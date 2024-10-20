// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection, getDocs } from "firebase/firestore";
import { CLIENT_COUNT, convertDate } from "../utils/Function";
import { getMyData, storeMyData } from "../utils/DataManager";
import { CAKE } from "../utils/Function";
import { getDoc } from "firebase/firestore/lite";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: process.env.deitysecret,
  authDomain: "deity-4bd00.firebaseapp.com",
  projectId: "deity-4bd00",
  storageBucket: "deity-4bd00.appspot.com",
  messagingSenderId: "999078750817",
  appId: "1:999078750817:web:454461e6f289371db65820"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// connect to firebase
export const db = getFirestore(app);

export async function exportAllData(setRefresh){
    try {
        DATA_EXPORTED = true

        let version = await getMyData("version")
        if (version === null) {
            version = 1
            await storeMyData("version", version)
        } 

        const g1 = await getMyData(`${CAKE}1`)
        const g2 = await getMyData(`${CAKE}2`)
        const g3 = await getMyData(`${CAKE}3`)

        const prixG1 = await getMyData(`${CAKE}1_price`)
        const prixG2 = await getMyData(`${CAKE}2_price`)
        const prixG3 = await getMyData(`${CAKE}3_price`)
            
        const pricesHistoryData = await getMyData("prices_history");
        const stockHistoryData = await getMyData("stock_history");

        let clientCount = await getMyData(CLIENT_COUNT)
        if (clientCount === null) 
            clientCount = 0 
        else
            clientCount = parseInt(clientCount)

        let clients = []
        for (let i = 1; i <= clientCount; i++) {
            const c = await getMyData(`${i}`)
            if (c !== null)
                clients.push(c)
        } 
        let clientHistory = []
        for (let i = 0; i < clients.length; i++) {
            const c = await getMyData(clients[i].groupID + "_history")
            if (c !== null)
                clientHistory.push(c)
        }

        const data = {
            "nbClient": clientCount,
            "nbGateau1": g1,
            "nbGateau2": g2,
            "nbGateau3": g3,
            "prixGateau1": prixG1,
            "prixGateau2": prixG2,
            "prixGateau3": prixG3,
            "pricesHistory": pricesHistoryData,
            "stockHistory": stockHistoryData,
            "clients": clients,
            "clientHistory": clientHistory,
            "temp" : false,
            "date": new Date(),
            "version": version
        }

        // push data to firebase firestore not using storeMyData CAUSE IT'S NOT WORKING

        // push data to firebase firestore
        await addDoc(collection(db, "LocalData"), data);
        await storeMyData("version", version+1)
        setRefresh(old=>!old)
        return DATA_EXPORTED
    }
    catch (error) {
        console.error("[ERROR] Error exporting data: ", error);
        return !DATA_EXPORTED
    }
}

export async function loadAllData(setRefresh){
    try {
        DATA_LOADED = true
        const doc = await getDocs(collection(db, "LocalData"));
        if (doc.size > 0) {
            // get the last doc
            console.log("[INFO] Loading data...")
            const lastDoc = doc.docs[doc.size - 1]
            console.log("[INFO] Last doc: ", lastDoc.id)
            const data = lastDoc.data()
            await storeMyData("version", data.version)
            await storeMyData(CLIENT_COUNT, data.nbClient)

            await storeMyData(`${CAKE}1`, data.nbGateau1)
            await storeMyData(`${CAKE}2`, data.nbGateau2)
            await storeMyData(`${CAKE}3`, data.nbGateau3)
            await storeMyData(`${CAKE}1_price`, data.prixGateau1)
            await storeMyData(`${CAKE}2_price`, data.prixGateau2)
            await storeMyData(`${CAKE}3_price`, data.prixGateau3)


            await storeMyData("prices_history", data.pricesHistory)
            await storeMyData("stock_history", data.stockHistory)

            for (let i = 0; i < data.clients.length; i++) {
                await storeMyData(`${i+1}`, data.clients[i])
            }
            for (let i = 0; i < data.clients.length; i++) {
                for (let j = 0; j < data.clientHistory?.length; j++) {
                    if (
                        data.clientHistory[j] !== null && data.clientHistory[j] !== undefined
                        && data.clientHistory[j][0].groupUID === data.clients[i].groupUID
                    ){
                        await storeMyData(data.clients[i].groupUID + "_history", data.clientHistory[j])
                        break
                    }
                }
            }

            setRefresh(old=>!old)
            console.log("[INFO] Data loaded successfully")
            return DATA_LOADED
        }
        return !DATA_LOADED
    } catch (error) {
        console.error("[ERROR] Error loading data: ", error);
        return !DATA_LOADED
    }
}