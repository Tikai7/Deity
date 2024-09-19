import { createDrawerNavigator } from '@react-navigation/drawer';
import Acceuil from '../screens/Acceuil';
import Stock from '../screens/Stock';
import Commande from '../screens/Commande';
import Parametres from '../screens/Parametres';
import Header from '../components/Header';
import CustomDrawer from '../components/CustomDrawer';
import React from 'react'
import { useState } from 'react';
import { Data } from '../context/Data';

const Drawer = createDrawerNavigator();

export default function DrawerMenu() {
	const [currentScreen, setCurrentScreen] = useState("Acceuil")
    const [refresh, setRefresh] = useState(false)
	const [invert, setInvert] = useState(false)

	
	const options = { header : (props) => <Header {...props} />}

	return (
		<Data.Provider value={{
			currentScreen, setCurrentScreen,
			refresh, setRefresh,
			invert, setInvert
        }}>
			<Drawer.Navigator
				drawerContent={(props) => <CustomDrawer {...props} />}
			>
				<Drawer.Screen name="Acceuil" component={Acceuil} options={options}/>
				<Drawer.Screen name="Stock" component={Stock}   options={options}/>
				<Drawer.Screen name="Commandes" component={Commande}   options={options}/>
				<Drawer.Screen name="Paramètres" component={Parametres}   options={options}/>
			</Drawer.Navigator>

		</Data.Provider>
	);
}