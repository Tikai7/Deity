import { NavigationContainer } from '@react-navigation/native';
import DrawerMenu from './router/Drawer';
import { useEffect } from 'react';
import { migrateStorage } from './utils/Migration';
import { clearAll } from './utils/DataManager';

export default function App() {

    useEffect(() => {
        // Migration transparente : tourne une seule fois,
        // l'utilisateur ne voit rien, ses données sont converties automatiquement.
		// clearAll()

        // migrateStorage();
        console.log("[INFO] App started");
    }, []);

    return (
        <NavigationContainer>
            <DrawerMenu />
        </NavigationContainer>
    );
}