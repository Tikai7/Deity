import { NavigationContainer } from '@react-navigation/native';
import DrawerMenu from './router/Drawer';
import { useEffect } from 'react';
import { clearAll } from './utils/DataManager';

export default function App() {

	useEffect(() => {
		// clearAll()
		console.log("[INFO] App started")
	}, [])

    return (
		<NavigationContainer>
			<DrawerMenu />
		</NavigationContainer>
    );
}
