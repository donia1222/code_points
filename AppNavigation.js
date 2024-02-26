import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from './screens/ThemeContext'; // Asegúrate de que la ruta sea correcta
import HomeScreen from './screens/HomeScreen';
import UserProfile from './screens/Userprofile';
import Registro from './screens/Registro';
import Usuarios from './screens/Usuarios';
import Login from './screens/Login';
import NegociosRegistro from './screens/NegociosRegistro';
import LoginNegocios from './screens/LoginNegocios';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
    const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: theme === 'dark' ? 'black' : '#fff' },
        headerStyle: { backgroundColor: theme === 'dark' ? 'black' : '#fff' },
        tabBarLabelStyle: { color: theme === 'dark' ? 'white' : 'black' },
        headerTintColor: theme === 'dark' ? 'white' : 'black',
        headerShown: false, // Cambia esto a true para que se muestre el header
      })}
    >
      <Tab.Screen name="Home" component={UserProfile} />
      <Tab.Screen name="LoginNegocios" component={LoginNegocios} />
    </Tab.Navigator>
  );
}

function AppNavigation() {
  const { theme } = useTheme(); // Usa el tema desde tu contexto de tema

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme === 'dark' ? '#333' : '#fff' },
          headerTintColor: theme === 'dark' ? 'white' : 'black',
        }}
      >
        <Stack.Screen name="Tabs" component={MyTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Registro" component={Registro} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Usuarios" component={Usuarios} />
        <Stack.Screen name="NegociosRegistro" component={NegociosRegistro} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;

