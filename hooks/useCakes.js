/**
 * useCakes — hook central
 * Charge la liste complète des gâteaux (statiques + dynamiques)
 * et se rafraîchit quand `refresh` change dans le contexte Data.
 *
 * Usage :
 *   const { cakes, reloadCakes } = useCakes();
 */

import { useState, useEffect, useContext } from 'react';
import { loadAllCakes } from '../utils/CakesConfig';
import { Data } from '../context/Data';

export default function useCakes() {
    const [cakes, setCakes] = useState([]);
    const { refresh } = useContext(Data);

    async function reloadCakes() {
        const all = await loadAllCakes();
        setCakes(all);
    }

    useEffect(() => {
        reloadCakes();
    }, [refresh]);

    return { cakes, reloadCakes };
}
