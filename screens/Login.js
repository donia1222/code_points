import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text ,TouchableOpacity, Modal, Image,KeyboardAvoidingView, Platform,ScrollView, ImageBackground} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from './ThemeContext'; // Asegúrate de que la ruta sea correcta
import headerImage from './agregar-contacto.png'; 
import LinearGradient from 'react-native-linear-gradient';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import googleLogo from './google.png';


const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [contraseña, setContraseña] = useState('');
    const { theme } = useTheme();
    const styles = getStyles(theme); // Aplica los estilos basados en el tema
    const gradientColors = theme === 'dark' ? ['#16142ced', '#322d6ded', '#24243e69'] : ['#fffbd5', '#2f8080a3', '#fffbd54f'];
    const [userEmail, setUserEmail] = useState('');

  // Configuración de Google SignIn
const clientId = '512861089028-7r0oet86c68k5vmqte3v6214re9420ls.apps.googleusercontent.com';
const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
  clientId,
});
useEffect(() => {
  if (response?.type === 'success') {
    const { id_token } = response.params;
    console.log('Token de Google obtenido:', id_token); // Log para confirmar que se recibió el token
    fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${id_token}`)
      .then(response => response.json())
      .then(data => {
        console.log('Datos obtenidos del usuario:', data); // Log para ver los datos decodificados del usuario
        // Verifica si el usuario ya existe en la base de datos.
        fetch(`https://mycode.lweb.ch/checkGoogleUser.php?email=${encodeURIComponent(data.email)}`)
          .then(checkResponse => checkResponse.json())
          .then(checkData => {
            if (checkData.exists) {
              console.log('El usuario ya existe, usando datos existentes.');
              // Usuario existente, usa los datos existentes.
              const userData = checkData.userData;
              AsyncStorage.setItem('userData', JSON.stringify(userData));
              AsyncStorage.setItem('loggedIn', 'true');
              navigation.navigate('UserProfile', { userData });
            } else {
              console.log('Nuevo usuario, registrando...');
              // Nuevo usuario, necesita registro.
              fetch('https://mycode.lweb.ch/registro_google.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  nombre: data.name,
                  email: data.email,
                  google_token: id_token,
                }),
              })
              .then(regResponse => regResponse.json())
              .then(regData => {
                if (regData.success) {
                  console.log('Registro exitoso, usando datos nuevos.');
                  const userData = {
                    email: data.email,
                    nombre: data.name,
                    google_token: id_token,
                    qrCodeIdentifier: regData.qrCodeIdentifier,
                  };
                  AsyncStorage.setItem('userData', JSON.stringify(userData));
                  AsyncStorage.setItem('loggedIn', 'true');
                  navigation.navigate('UserProfile', { userData });
                } else {
                  console.error('Error en el registro del servidor:', regData.error);
                  Alert.alert('Error', 'Registro con Google fallido en el servidor.');
                }
              });
            }
          })
      })
      .catch(error => {
        console.error('Error al obtener información del usuario de Google o al comunicarse con el servidor:', error);
        Alert.alert('Error', 'Inicio de sesión con Google fallido.');
      });
  }
}, [response, navigation]);


    const signInWithApple = async () => {
      console.log('Intentando iniciar sesión con Apple...');
      try {
          const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                  AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                  AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
          });
  
          console.log('Credenciales obtenidas:', credential);
  
          // Verifica si tenemos un identificador único de Apple.
          if (credential.user) {
              const userIdentifier = credential.user;
              // Primero, verificar si el usuario ya existe.
              const checkResponse = await axios.get(`https://mycode.lweb.ch/checkUser.php?apple_identifier=${userIdentifier}`);
              if (checkResponse.data.exists) {
                  // Usuario existente, procede a establecer la sesión.
                  const userData = checkResponse.data.userData;
                  await AsyncStorage.setItem('userData', JSON.stringify(userData));
                  await AsyncStorage.setItem('loggedIn', 'true');
                  navigation.navigate('UserProfile', { userData });
              } else {
                  // Nuevo usuario, necesita registro.
                  if (credential.email && (credential.fullName.givenName || credential.fullName.familyName)) {
                      const fullName = `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim();
                      const email = credential.email;
                      // Registrar al nuevo usuario.
                      const registerResponse = await axios.post('https://mycode.lweb.ch/registro_apple.php', {
                          nombre: fullName,
                          email: email,
                          contraseña: 'GeneradaPorBackend', // O maneja esto de manera más segura si es necesario.
                          apple_identifier: userIdentifier, // Asegúrate de enviar esto al backend.
                      });
  
                      if (registerResponse.data.message === 'Registro exitoso') {
                          // Usuario registrado exitosamente.
                          const userData = {
                              nombre: fullName,
                              email: email,
                              qrCodeIdentifier: registerResponse.data.qrCodeIdentifier,
                              apple_identifier: userIdentifier, // Almacena también el identificador de Apple.
                          };
  
                          await AsyncStorage.setItem('userData', JSON.stringify(userData));
                          await AsyncStorage.setItem('loggedIn', 'true');
                          navigation.navigate('UserProfile', { userData });
                      } else {
                          // Manejar respuesta no exitosa.
                          Alert.alert('Error', 'No se pudo registrar al usuario.');
                      }
                  } else {
                      Alert.alert('Error', 'Apple no proporcionó la información necesaria.');
                  }
              }
          } else {
              Alert.alert('Error', 'No se pudo obtener el identificador de usuario de Apple.');
          }
      } catch (e) {
          console.error('Error durante el inicio de sesión con Apple:', e);
          Alert.alert('Error', 'Inicio de sesión con Apple fallido.');
      }
  };
  
  
    const iniciarSesion = async () => {
      try {
          const response = await axios.post('https://mycode.lweb.ch/negocios/login.php', { email, contraseña });
          const data = response.data;
          if (data.success) {
  
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
      <ImageBackground
      source={require('../assets/imagenes/sale.png')} // Cambia esto por tu imagen de fondo
      resizeMode="cover" // Esto es para que la imagen cubra todo el fondo
      style={styles.backgroundImage}
    >
      <LinearGradient
      colors={gradientColors}
      style={styles.container}
    >
         <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
    >
       <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <Text style={styles.modalTextheader}>User Login</Text>
               <Image
          source={headerImage} // Usando la imagen importada
          style={styles.headerImage}
        />
        <TextInput 
  placeholder="Email" 
  value={email} 
  onChangeText={setEmail} 
  style={[styles.input, { borderColor: theme === 'dark' ? '#888' : '#888' }]} 
  placeholderTextColor={theme === 'dark' ? '#888' : '#888'} // Ajusta los colores según necesites
/>
<TextInput 
  placeholder="Contraseña" 
  value={contraseña} 
  onChangeText={setContraseña} 
  secureTextEntry 
  style={[styles.input, { borderColor: theme === 'dark' ? '#888' : '#888' }]} 
  placeholderTextColor={theme === 'dark' ? '#888' : '#888'} // Ajusta los colores según necesites
/>


<LinearGradient
  colors={theme === 'dark' ? ['#009688', '#24243e'] : ['#009688', '#858585']} // Gradientes para tema oscuro y claro
  start={{x: 0, y: 0}}
  end={{x: 1, y: 0}}
  style={styles.botonGradiente}
>
  <TouchableOpacity onPress={iniciarSesion}  style={styles.botonTransparente}>
    <Text style={styles.textoBotonGradiente}>Iniciar Sesión</Text>
  </TouchableOpacity>
</LinearGradient>
{AppleAuthentication.isAvailableAsync() && (
    <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={styles.appleButton}
        onPress={signInWithApple}
    />
)}

<View>
<TouchableOpacity
            style={[styles.button, !request && styles.disabled]}
            onPress={() => {
                if (request) {
                    promptAsync();
                }
            }}
            disabled={!request}
        >
            <View style={styles.buttonContent}>
                <Image source={googleLogo} style={styles.logo} />
                <Text style={styles.text}>Sign in with Google</Text>
            </View>
        </TouchableOpacity>
</View>



<TouchableOpacity onPress={registrarUsuario} style={styles.buttonno}>
  <Text style={styles.buttonTexto}>¿No estás registrado? Regístrate aquí</Text>
</TouchableOpacity>
</ScrollView>
</KeyboardAvoidingView>

</LinearGradient>
</ImageBackground>

    );
};

const getStyles = (theme) => StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    scrollViewContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      marginTop: 20,
    },

    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
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
      fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
    },
    text: {
        color: theme === 'dark' ? '#EEEEEE' : '#333', // Texto blanco para modo oscuro, negro para modo claro
        fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
      },

container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',

},
input: {
  width: '95%',
  height: 50,
  margin: 12,
  borderWidth: 1,
  borderColor: theme === 'dark' ? '#a1a1a1' : '#a1a1a1',
  backgroundColor: theme === 'dark' ? '#e7e7e700' : '#d4d4d4',
  padding: 10,
  borderRadius: 20,
  color: theme === 'dark' ? '#EEEEEE' : 'black',
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},

modalInput: {
  width: '95%',
  height: 50,
  margin: 12,
  borderWidth: 1,
  borderColor: theme === 'dark' ? '#a1a1a1' : '#a1a1a1',
  backgroundColor: theme === 'dark' ? '#e7e7e700' : '#d4d4d4',
  padding: 10,
  borderRadius: 20,
  color: theme === 'dark' ? '#EEEEEE' : 'black',
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},


button: {
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
  borderWidth: 1,
  borderColor: theme === 'dark' ? '#a1a1a1' : 'white',
},

buttonno: { 
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
  color: theme === 'dark' ? '#EEEEEE' : 'white', // Cambia el color del texto del input basado en el tema
  fontSize: 18, // Un tamaño de fuente más grande para mejorar la legibilidad
  textAlign: 'center', // Asegurar que el texto esté centrado
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},
buttonTexto: {
  color: theme === 'dark' ? '#EEEEEE' : 'black', // Cambia el color del texto del input basado en el tema
  fontSize: 17, // Un tamaño de fuente más grande para mejorar la legibilidad
  textAlign: 'center', // Asegurar que el texto esté centrado
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},
buttonTexti: {
  color: theme === 'dark' ? '#EEEEEE' : '#4b4b4b', // Cambia el color del texto del input basado en el tema
  fontSize: 16, // Un tamaño de fuente más grande para mejorar la legibilidad
  textAlign: 'center', // Asegurar que el texto esté centrado
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},
centeredView: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 22,
},
headerImage: {
  width: 100, // Ajusta según tus necesidades
  height: 100, // Ajusta según tus necesidades
  marginBottom: 20,
},
modalTextheader: {
  marginBottom: 15,
  textAlign: "center",
  fontWeight: 'bold',
  color: theme === 'dark' ? '#5bdfd3' : '#3c3c3c',
  fontSize: 26,
  marginBottom: 20,
  marginTop: -20,
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},
botonGradiente: {
  borderRadius: 25,
  marginVertical: 5, // Espacio vertical para separar de otros elementos
  marginBottom: 20, // Espacio en la parte inferior
},
botonTransparente: {
  paddingVertical: 12,
  paddingHorizontal: 45,
  borderRadius: 25,
  alignItems: 'center',
  width: '100%', // Asegura que el toque se detecte en todo el gradiente
},
textoBotonGradiente: {
  color: theme === 'dark' ? '#e7e7e7' : '#e7e7e7', // Texto blanco para tema oscuro, negro para tema claro
  fontSize: 18,
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},
appleButton: {
  width: 230,
  height: 44,
  marginVertical: 10, // Puedes ajustar el margen según necesites

},
button: {
  flexDirection: 'row',
  backgroundColor: '#FFFFFF',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 10,
  borderRadius: 5,
  borderWidth: 1,
  borderColor: '#c4c4c4', // Un borde suave para resaltar el botón
},
buttonContent: {
  flexDirection: 'row',
  alignItems: 'center',
},
text: {
  marginLeft: 10,
  color: '#757575',
  fontWeight: 'bold',
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},
logo: {
  width: 20,
  height: 20,
},
disabled: {
  opacity: 0.6, // Ajusta la transparencia para botones deshabilitados
},
backgroundImage: {
  flex: 1,
  width: '100%',
  height: '100%',
},


  });

export default Login;