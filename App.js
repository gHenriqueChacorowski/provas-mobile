import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Context, Provider } from "./src/context/authContext";
import { SafeAreaProvider } from 'react-native-safe-area-context';

import CustomDrawer from './src/components/CustomDrawer';
import Login from './src/screens/Login';

import InicioScreen from './src/screens/Inicio';
import RealizarProvaScreen from './src/screens/RealizarProva';
import VisualizarProvaScreen from './src/screens/VisualizarProva';
import ProvaScreen from './src/screens/Prova';
import LoginTokenScreen from './src/screens/LoginToken';
import ConsultarProvaScreen from './src/screens/ConsultarProva';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function HomeStack() {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />} initialRouteName="Inicio" screenOptions={{ headerTitle: '', headerStyle: { backgroundColor: '#FCFCFC' } }}>
      <Drawer.Screen name="Inicio" component={InicioScreen} />
      <Drawer.Screen name="VisualizarProva" component={VisualizarProvaScreen} />
      <Drawer.Screen name="RealizarProva" component={RealizarProvaScreen} />
      <Drawer.Screen name="Prova" component={ProvaScreen} />
      <Drawer.Screen name="ConsultarProva" component={ConsultarProvaScreen} />
    </Drawer.Navigator>
  )
}

const App = () => {
  const { state } = useContext(Context);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {
          state.isLogged 
          ? 
            <Stack.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
          : 
          state.isLoggedToken 
          ? 
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          :
            <Stack.Screen name="LoginToken" component={LoginTokenScreen} options={{ headerShown: false }} />
        }
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default () => {
  return (
    <Provider>
      <SafeAreaProvider>
        <App />
      </SafeAreaProvider>
    </Provider>
  )
}