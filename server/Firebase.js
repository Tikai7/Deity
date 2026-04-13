import { initializeApp } from "firebase/app";
import {
    getFirestore, addDoc, collection, getDocs,
    query, orderBy, limit, serverTimestamp
} from "firebase/firestore";
import { CLIENT_COUNT } from "../utils/Function";
import { getMyData, storeMyData } from "../utils/DataManager";
import { cakeStockKey, cakeKey, cakePriceKey, DYNAMIC_CAKES_KEY, loadAllCakes } from "../utils/CakesConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_DEITY_API_KEY,
    authDomain: "deity-4bd00.firebaseapp.com",
    projectId: "deity-4bd00",
    storageBucket: "deity-4bd00.appspot.com",
    messagingSenderId: "999078750817",
    appId: "1:999078750817:web:454461e6f289371db65820"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const q = query(collection(db, "LocalData"), orderBy("updatedAt", "desc"), limit(1));

// ── Migre un objet commande (vieilles clés → nouvelles) ───────────────────────
function migrateClientObj(obj) {
    if (!obj) return obj;
    const r = { ...obj };
    const map = [
        ['nbGateau',    'nbGateau_1'],
        ['nbGateau2',   'nbGateau_2'],
        ['nbGateau3',   'nbGateau_3'],
        ['prixGateau1', 'prixGateau_1'],
        ['prixGateau2', 'prixGateau_2'],
        ['prixGateau3', 'prixGateau_3'],
    ];
    for (const [old, nw] of map) {
        if (r[old] !== undefined && r[nw] === undefined) r[nw] = r[old];
    }
    return r;
}

// ─────────────────────────────────────────────────────────────────────────────
export async function exportAllData(setRefresh) {
    try {
        let version = await getMyData("version") ?? 1;
        const cakes = await loadAllCakes();

        const stocksByCake = {};
        for (const cake of cakes) {
            stocksByCake[`stock_${cake.id}`] = await getMyData(cakeStockKey(cake.id));
        }

        const pricesHistory = await getMyData("prices_history");
        const stockHistory  = await getMyData("stock_history");
        const dynamicCakes  = await getMyData(DYNAMIC_CAKES_KEY) ?? [];

        let clientCount = await getMyData(CLIENT_COUNT);
        clientCount = clientCount ? parseInt(clientCount) : 0;

        const clients = [];
        for (let i = 1; i <= clientCount; i++) {
            const c = await getMyData(`${i}`);
            if (c) clients.push(c);
        }

        const clientHistory = [];
        for (const c of clients) {
            const h = await getMyData(c.groupUID + "_history");
            if (h) clientHistory.push(...h);
        }

        await addDoc(collection(db, "LocalData"), {
            nbClient: clientCount,
            stocks: stocksByCake,
            pricesHistory, stockHistory, clients, clientHistory,
            dynamicCakes, temp: false,
            date: new Date(), version, updatedAt: serverTimestamp(),
        });

        await storeMyData("version", version + 1);
        setRefresh(old => !old);
        return true;
    } catch (error) {
        console.error("[ERROR] exportAllData:", error);
        return false;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
export async function loadAllData(setRefresh) {
    try {
        const snap = await getDocs(collection(db, "LocalData"));
        if (snap.size === 0) return false;

        const qs = await getDocs(q);
        if (qs.empty) return false;

        const data = qs.docs[0].data();
        console.log("[INFO] Loading version:", data.version);

        await storeMyData("version", data.version);
        await storeMyData(CLIENT_COUNT, data.nbClient);
        await storeMyData("prices_history", data.pricesHistory);
        await storeMyData("stock_history", data.stockHistory);

        if (data.dynamicCakes) await storeMyData(DYNAMIC_CAKES_KEY, data.dynamicCakes);

        // ── Stocks : nouveau format en priorité, ancien en fallback ──────────
        if (data.stocks) {
            for (const [key, value] of Object.entries(data.stocks)) {
                const id = parseInt(key.replace("stock_", ""), 10);
                await storeMyData(cakeStockKey(id), value);
            }
        } else {
            // Ancien format Firebase (nbGateau1/2/3)
            if (data.nbGateau1 !== undefined) await storeMyData(cakeStockKey(1), data.nbGateau1);
            if (data.nbGateau2 !== undefined) await storeMyData(cakeStockKey(2), data.nbGateau2);
            if (data.nbGateau3 !== undefined) await storeMyData(cakeStockKey(3), data.nbGateau3);
        }

        // ── Clients : migrer les clés à la volée ─────────────────────────────
        for (let i = 0; i < data.clients.length; i++) {
            const migrated = migrateClientObj(data.clients[i]);
            await storeMyData(`${i + 1}`, migrated);
        }

        // ── Historique client : migrer à la volée ────────────────────────────
        const grouped = {};
        if (Array.isArray(data.clientHistory)) {
            data.clientHistory.forEach(entry => {
                const g = entry.groupUID;
                if (!grouped[g]) grouped[g] = [];
                grouped[g].push(migrateClientObj(entry));
            });
        }
        for (const client of data.clients) {
            const h = grouped[client.groupUID];
            if (h) await storeMyData(client.groupUID + "_history", h);
        }

        // Marquer migration faite pour éviter re-run de Migration.js
        await AsyncStorage.setItem('__migrated_v2', '1');

        setRefresh(old => !old);
        return true;
    } catch (error) {
        console.error("[ERROR] loadAllData:", error);
        return false;
    }
}