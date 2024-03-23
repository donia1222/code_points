import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from './screens/ThemeContext'; // Asegúrate de que la ruta sea correcta
import HomeScreen from './screens/HomeScreen';
import UserProfile from './screens/Userprofile';
import Registro from './screens/Registro';
import Usuarios from './screens/Usuarios';
import Login from './screens/Login';
import InfoNegocio from './screens/InfoNegocio';
import NegociosRegistro from './screens/NegociosRegistro';
import LoginNegocios from './screens/LoginNegocios';
import UserProfiletest from './screens/UserProfiletest';
import SuscripcionScreeen from './screens/SuscripcionScreeen';
import UserSuscripcionScree from './screens/UserSuscripcionScree';
import { Ionicons } from '@expo/vector-icons';
import { Modal, View, Text, TouchableOpacity,  Image, Platform } from 'react-native';
// En la parte superior de tu AppNavigation.js o donde lo necesites
import { navigationRef, navigate } from './NavigationService'; // Asegúrate de que la ruta sea correcta
import { Dimensions, StyleSheet } from 'react-native';
import headerImage from './assets/imagenes/headerImage.png'; // Asegúrate de actualizar esta ruta
import LinearGradient from 'react-native-linear-gradient';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

import { LogBox } from 'react-native';
LogBox.ignoreLogs([
  "Sending `onAnimatedValueUpdate` with no listeners registered.",
]);



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
function MyTabs() {
    const { theme } = useTheme();
    const styles = getStyles(theme);

    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false, // Cambia esto a true para que se muestre el header
          tabBarStyle: {
            backgroundColor: theme === 'dark' ? '#7c7c7c00' : '#7c7c7c00',
            position: 'absolute',
            bottom: 25,
            borderTopWidth: 0,
            left: 20,
            right: 20,
            elevation: 0,
            height: 85,
            borderRadius: 50,
          },
          tabBarLabelStyle: { color: theme === 'dark' ? 'white' : 'black' },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Usuario') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'UserProfiletest') {
              iconName = focused ? 'star' : 'star-outline';
            }else if (route.name === 'Negocios') {
              iconName = focused ? 'business' : 'business-outline';
            }
            // Puedes agregar más condiciones para otros íconos de pestañas aquí
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="FidelizaQR" component={LoginNegocios} />
      </Tab.Navigator>
    );
  }


  

function AppNavigation() {

  const [modalVisible, setModalVisible] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Home'); // Estado para controlar la ruta inicial
  const { theme } = useTheme();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);


  useEffect(() => {
    setModalVisible(true);
  }, []);


  useEffect(() => {
    // Mostrar el modal al cargar la app
    setModalVisible(true);
  }, []);



  return (
    <NavigationContainer ref={navigationRef}>
       <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerStyle: { backgroundColor: theme === 'dark' ? 'black' : '#fff' },
          headerTintColor: theme === 'dark' ? 'white' : 'black',
          headerShown: false, // Cambia esto según tus necesidades
        }}
      >
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="Registro" component={Registro} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Usuario" component={UserProfile} />
        <Stack.Screen name="SuscripcionScreeen" component={SuscripcionScreeen} />
        <Stack.Screen name="UserSuscripcionScree" component={UserSuscripcionScree} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="NegociosRegistro" component={NegociosRegistro} />
        <Stack.Screen name="NegociosLogin" component={LoginNegocios} />
        <Stack.Screen name="Negocios" component={LoginNegocios} />
        <Stack.Screen name="UserProfiletest" component={UserProfiletest} />
        <Stack.Screen name="InfoNegocio" component={InfoNegocio} />
        {/* Agrega más pantallas según sea necesario */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const getStyles = (theme) => StyleSheet.create({
  modalView: {
    width: windowWidth,
    height: windowHeight,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'center', // Centra el contenido verticalmente
    alignItems: 'center', // Centra el contenido horizontalmente
    backgroundColor: theme === 'dark' ? '#1c1c1c' : '#f0f0f0',
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: theme === 'dark' ? '#EEEEEE' : '#333',
  },
  headerImage: {
    width: 100, // Ajusta según tus necesidades
    height: 100, // Ajusta según tus necesidades
    marginBottom: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: theme === 'dark' ? '#EEEEEE' : '#333',
    fontSize: 21,
  },
  modalTextheader: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: 'bold',
    color: theme === 'dark' ? '#5bdfd3' : '#333',
    fontSize: 32,
    marginBottom: 50,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: "#5bdfd3", // Ajusta el color según tu tema
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    width: 200, // Ajusta según tus necesidades
  },
  buttonText: {
    color: theme === 'dark' ? '#333' : '#333',
    marginLeft: 10,
    fontSize: 18,
  },
  switchContainer: {
    position: 'absolute',
    top: 60, // Ajusta según sea necesario para tu layout
    right: 25, // Ajusta según sea necesario para tu layout
    zIndex: 1, // Asegúrate de que el switch se muestre por encima de otros elementos si es necesario
  },
});


async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        alert('You will not receive push notifications.');
        return;
    }

    token = (await Notifications.getExpoPushTokenAsync({ projectId: '2c7f6f97-22ef-4406-b6ff-19b47d844ef7' })).data;
    console.log(token);

    // Envía el token al servidor
    if (token) {
        fetch('https://mycode.lweb.ch/notificaciones/notificaciones.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },  
            body: JSON.stringify({ token: token }),
        })
        .then(response => response.text())
        .then(data => {
            console.log('Token enviado al servidor:', data);
        })
        .catch((error) => {
            console.error('Error al enviar el token:', error);
        });
    }
} else {
    alert('Must use physical device for Push Notifications');
}

return token;
}


export default AppNavigation;

