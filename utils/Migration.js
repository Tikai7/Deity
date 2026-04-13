import AsyncStorage from '@react-native-async-storage/async-storage';

const MIGRATION_KEY = '__migrated_v2';

/**
 * Migre toutes les données de l'ancien format vers le nouveau.
 * - Stocks : CAKE1/2/3 → CAKE_1/2/3
 * - Commandes & historique : nbGateau/nbGateau2/nbGateau3 → nbGateau_1/2/3
 *                            prixGateau1/2/3 → prixGateau_1/2/3
 * 
 * Idempotent : ne tourne qu'une seule fois grâce au flag __migrated_v2.
 */
export async function migrateStorage() {
    try {
        const already = await AsyncStorage.getItem(MIGRATION_KEY);
        if (already) return;

        console.log('[MIGRATION] Starting v2 migration...');

        // ── 1. Stocks ──────────────────────────────────────────────────────────
        for (const [oldKey, newKey] of [
            ['CAKE1', 'CAKE_1'],
            ['CAKE2', 'CAKE_2'],
            ['CAKE3', 'CAKE_3'],
        ]) {
            const val = await AsyncStorage.getItem(oldKey);
            if (val !== null) {
                await AsyncStorage.setItem(newKey, val);
                await AsyncStorage.removeItem(oldKey);
                console.log(`[MIGRATION] Stock ${oldKey} → ${newKey} = ${val}`);
            }
        }

        // ── 2. Commandes clients ───────────────────────────────────────────────
        const countRaw = await AsyncStorage.getItem('CLIENT_COUNT');
        const count = countRaw ? parseInt(countRaw, 10) : 0;

        for (let i = 1; i <= count; i++) {
            const raw = await AsyncStorage.getItem(`${i}`);
            if (!raw) continue;

            const client = JSON.parse(raw);
            const updated = migrateClientObject(client);
            await AsyncStorage.setItem(`${i}`, JSON.stringify(updated));
        }

        // ── 3. Historique de chaque client ─────────────────────────────────────
        // On récupère tous les groupUID depuis les commandes
        const groupUIDs = new Set();
        for (let i = 1; i <= count; i++) {
            const raw = await AsyncStorage.getItem(`${i}`);
            if (!raw) continue;
            const client = JSON.parse(raw);
            if (client.groupUID) groupUIDs.add(client.groupUID);
        }

        for (const groupUID of groupUIDs) {
            const histRaw = await AsyncStorage.getItem(`${groupUID}_history`);
            if (!histRaw) continue;

            const history = JSON.parse(histRaw);
            const updatedHistory = history.map(migrateClientObject);
            await AsyncStorage.setItem(`${groupUID}_history`, JSON.stringify(updatedHistory));
        }

        // ── 4. Marquer comme migré ─────────────────────────────────────────────
        await AsyncStorage.setItem(MIGRATION_KEY, '1');
        console.log('[MIGRATION] v2 migration complete ✓');

    } catch (err) {
        // On ne bloque jamais l'app en cas d'erreur de migration
        console.error('[MIGRATION] Error during migration:', err);
    }
}

/**
 * Transforme un objet commande/historique du vieux format vers le nouveau.
 * Ne touche pas aux clés déjà au bon format.
 */
function migrateClientObject(obj) {
    if (!obj) return obj;

    const result = { ...obj };

    // nbGateau  → nbGateau_1
    if (result.nbGateau  !== undefined && result['nbGateau_1'] === undefined) {
        result['nbGateau_1'] = result.nbGateau;
    }
    if (result.nbGateau2 !== undefined && result['nbGateau_2'] === undefined) {
        result['nbGateau_2'] = result.nbGateau2;
    }
    if (result.nbGateau3 !== undefined && result['nbGateau_3'] === undefined) {
        result['nbGateau_3'] = result.nbGateau3;
    }

    // prixGateau1 → prixGateau_1
    if (result.prixGateau1 !== undefined && result['prixGateau_1'] === undefined) {
        result['prixGateau_1'] = result.prixGateau1;
    }
    if (result.prixGateau2 !== undefined && result['prixGateau_2'] === undefined) {
        result['prixGateau_2'] = result.prixGateau2;
    }
    if (result.prixGateau3 !== undefined && result['prixGateau_3'] === undefined) {
        result['prixGateau_3'] = result.prixGateau3;
    }

    // On garde les anciennes clés pour la rétro-compat (elles ne gênent pas)
    return result;
}