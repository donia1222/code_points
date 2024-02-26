import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text ,TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from './ThemeContext'; // Asegúrate de que la ruta sea correcta

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [contraseña, setContraseña] = useState('');
    const { theme } = useTheme();
    const styles = getStyles(theme); // Aplica los estilos basados en el tema

    const iniciarSesion = async () => {
      try {
          const response = await axios.post('https://mycode.lweb.ch/negocios/login.php', { email, contraseña });
          const data = response.data;
          if (data.success) {
              Alert.alert('Éxito', 'Inicio de sesión exitoso');
  
              // Recupera el avatar previamente guardado si existe
              const storedAvatar = await AsyncStorage.getItem('userAvatar');
              const avatarData = storedAvatar ? JSON.parse(storedAvatar) : {};
  
              // Asegúrate de incluir el qrCodeIdentifier en los datos guardados
              const userDataToSave = {
                  ...data.user,
                  avatar: data.user.avatar || avatarData.avatar, // Mantén el avatar previo si es necesario
                  qrCodeIdentifier: data.user.qrCodeIdentifier, // Asegúrate de que esta línea se agregue correctamente
              };
  
              await AsyncStorage.setItem('userData', JSON.stringify(userDataToSave));
              await AsyncStorage.setItem('loggedIn', 'true');
              navigation.navigate('UserProfile', { userData: userDataToSave });
          } else {
              Alert.alert('Error', data.message);
          }
      } catch (error) {
          console.error(error);
          Alert.alert('Error', 'No se pudo conectar con el servidor');
      }
  };
  

    const registrarUsuario = () => {
        navigation.navigate('Registro');
    };

    return (
        <View style={styles.container}>
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input}   />
            <TextInput placeholder="Contraseña" value={contraseña} onChangeText={setContraseña} secureTextEntry style={styles.input} />
                    
            <TouchableOpacity onPress={iniciarSesion} style={styles.button}>
  <Text style={styles.buttonText}>Iniciar Sesión</Text>
</TouchableOpacity>


<TouchableOpacity onPress={registrarUsuario} style={styles.button}>
  <Text style={styles.buttonText}>¿No estás registrado? Regístrate aquí</Text>
</TouchableOpacity>
            
        </View>
    );
};

const getStyles = (theme) => StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? 'black' : '#f0f0f0',
      padding: 20,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: theme === 'dark' ? '#393E46' : 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      width: '80%',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      fontSize: 18,
      color: theme === 'dark' ? '#EEEEEE' : '#333',
    },
    text: {
        color: theme === 'dark' ? '#EEEEEE' : '#333', // Texto blanco para modo oscuro, negro para modo claro
        // Agrega aquí cualquier otro estilo común para texto, como tamaño de fuente, etc.
      },

container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme === 'dark' ? 'black' : '#f0f0f0',
},
input: {
  width: '90%',
  padding: 15,
  marginVertical: 10,
  borderWidth: 0, // Quitamos el borde
  backgroundColor: '#FFFFFF', // Fondo blanco para los inputs
  borderRadius: 30, // Bordes redondeados para los inputs
  fontSize: 16, // Tamaño de fuente un poco más grande
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5, // Sombras para dar un efecto elevado a los inputs
},
button: {
  backgroundColor: '#007BFF', // Un azul vibrante para el botón principal
  borderRadius: 20, // Bordes redondeados para el botón
  paddingVertical: 10,
  paddingHorizontal: 20,
  width: '90%',
  alignItems: 'center', // Asegurar que el texto del botón esté centrado
  marginTop: 10,
  shadowColor: "#000", // Sombras para dar un efecto elevado al botón
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
  marginTop: 10,
},
buttonText: {
  color: theme === 'dark' ? '#EEEEEE' : '#333', // Cambia el color del texto del input basado en el tema
  fontSize: 18, // Un tamaño de fuente más grande para mejorar la legibilidad
},
  });

export default Login;