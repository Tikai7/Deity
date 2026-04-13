import AsyncStorage from '@react-native-async-storage/async-storage';

export const STATIC_CAKES = [
    { id: 1, name: "Gâteau 1", image: require('../images/gateau1.jpg') },
    { id: 2, name: "Gâteau 2", image: require('../images/gateau2.jpg') },
    { id: 3, name: "Gâteau 3", image: require('../images/gateau3.jpg') },
    { id: 4, name: "Gâteau 4", image: require('../images/gateau4.jpg') },
    { id: 5, name: "Gâteau 5", image: require('../images/gateau5.jpg') },
];

// ── Clés nouvelles ───────────────────────────────────────────────────────────
export const cakeKey      = (id) => `nbGateau_${id}`;
export const cakePriceKey = (id) => `prixGateau_${id}`;
export const cakeStockKey = (id) => `CAKE_${id}`;

// ── Clés anciennes (fallback lecture) ────────────────────────────────────────
const LEGACY_QTY   = { 1: 'nbGateau',    2: 'nbGateau2',   3: 'nbGateau3'   };
const LEGACY_PRICE = { 1: 'prixGateau1', 2: 'prixGateau2', 3: 'prixGateau3' };
const LEGACY_STOCK = { 1: 'CAKE1',       2: 'CAKE2',        3: 'CAKE3'       };

/**
 * Lit la quantité d'un gâteau dans un objet commande.
 * Nouvelle clé en priorité, ancienne en fallback.
 */
export function getCakeQty(obj, id) {
    if (!obj) return 0;
    const v = obj[cakeKey(id)];
    if (v !== undefined && v !== null) return v;
    return obj[LEGACY_QTY[id]] ?? 0;
}

/**
 * Lit le prix d'un gâteau dans un objet commande.
 */
export function getCakePrice(obj, id) {
    if (!obj) return 0;
    const v = obj[cakePriceKey(id)];
    if (v !== undefined && v !== null) return v;
    return obj[LEGACY_PRICE[id]] ?? 0;
}

/**
 * Lit le stock d'un gâteau depuis AsyncStorage.
 * Cherche d'abord la nouvelle clé, puis l'ancienne.
 */
export async function readCakeStock(id) {
    const newVal = await AsyncStorage.getItem(cakeStockKey(id));
    if (newVal !== null) return JSON.parse(newVal);
    const oldKey = LEGACY_STOCK[id];
    if (oldKey) {
        const oldVal = await AsyncStorage.getItem(oldKey);
        if (oldVal !== null) return JSON.parse(oldVal);
    }
    return 0;
}

// ── Gâteaux dynamiques ───────────────────────────────────────────────────────
export const DYNAMIC_CAKES_KEY = "dynamic_cakes";

export async function loadAllCakes() {
    try {
        const raw = await AsyncStorage.getItem(DYNAMIC_CAKES_KEY);
        const dynamic = raw ? JSON.parse(raw) : [];
        return [...STATIC_CAKES, ...dynamic];
    } catch {
        return [...STATIC_CAKES];
    }
}

export async function saveDynamicCakes(dynamicCakes) {
    await AsyncStorage.setItem(DYNAMIC_CAKES_KEY, JSON.stringify(dynamicCakes));
}

export async function getDynamicCakes() {
    try {
        const raw = await AsyncStorage.getItem(DYNAMIC_CAKES_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}