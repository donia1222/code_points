import React, { useState, useRef , useEffect} from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Modal, Text, Image, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import axios from 'axios';
import { useTheme } from './ThemeContext'; // Asegúrate de que la ruta sea correcta
import { Modalize } from 'react-native-modalize';
import LinearGradient from 'react-native-linear-gradient';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import googleLogo from './google.png';

const Registro = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [codigoVerificacion, setCodigoVerificacion] = useState('');
  const [mostrarBotonRegistro, setMostrarBotonRegistro] = useState(false);
  const [botonPresionado, setBotonPresionado] = useState(false); // Estado para el cambio de texto del botón
  const [modalRestablecerVisible, setModalRestablecerVisible] = useState(false);
  const [avatar, setAvatar] = useState(null); // Estado para almacenar la URI de la imagen
  const { theme } = useTheme();
  const styles = getStyles(theme); // Aplica los estilos basados en el tema
  const modalizeRef = useRef(null);
  const [isModalOpened, setIsModalOpened] = useState(false); // Nuevo estado para controlar la apertura del modal
  const { themes, toggleTheme } = useTheme();
  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight * 0.8;
  const gradientColors = theme === 'dark' ? ['#16142ced', '#322d6ded', '#24243e69'] : ['#fffbd5', '#2f8080a3', '#fffbd54f'];


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

    // Actualiza la referencia de modal cuando cambie el estado de apertura
    useEffect(() => {
      if (modalizeRef.current) {
        if (isModalOpened) {
          modalizeRef.current.open();
        } else {
          modalizeRef.current.close();
        }
      }
    }, [isModalOpened]);

    const openModal = () => {
      setIsModalOpened(true); // Establecer el estado para indicar que el modal está abierto
    };

    const closeModal = () => {
      setIsModalOpened(false); // Resetea el estado cuando el modal se cierra
    };


  const enviarSolicitudRestablecimiento = async () => {
    try {
      const response = await axios.post('https://mycode.lweb.ch/enviar_contrasena_nueva.php', {
        email,
      });
  
      if (response.data.message === 'Nueva contraseña enviada') {
        Alert.alert('Éxito', 'Revisa tu correo electrónico para obtener tu nueva contraseña', [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        Alert.alert('Error', 'No se pudo enviar la nueva contraseña');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Ocurrió un error al enviar la solicitud');
    } finally {
      setModalRestablecerVisible(false); // Cierra el modal después de enviar la solicitud
      // Considera mover la navegación aquí si prefieres que ocurra independientemente de la respuesta del servidor
    }
  };
  

  const restablecerInputs = () => {
    setNombre('');
    setEmail('');
    setContraseña('');
    setCodigoVerificacion('');
    setMostrarBotonRegistro(false);
    setBotonPresionado(false); // También restablecemos este estado para reiniciar el flujo
  };

  const enviarCodigoVerificacion = async () => {
    try {
      const response = await axios.post('https://mycode.lweb.ch/enviar_codigo_verificacion.php', {
        email,
      });

      if (response.data.message === 'Código enviado') {
        Alert.alert('Verificación', 'Código de verificación enviado al correo', [
          { text: 'OK', onPress: () => setMostrarBotonRegistro(true) },
        ]);
        setBotonPresionado(true);
      } else {
        Alert.alert('Error', 'No se pudo enviar el código de verificación');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Ocurrió un error al enviar el código de verificación');
    }
  };

  const verificarCodigo = async () => {
    try {
      const response = await axios.post('https://mycode.lweb.ch/verificar_codigo.php', {
        email,
        codigo: codigoVerificacion,
      });

      if (response.data.message === 'Verificación exitosa') {
        registrarUsuario();
      } else {
        Alert.alert('Error', 'Código de verificación incorrecto');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Ocurrió un error al verificar el código');
    }
  };

  const registrarUsuario = async () => {
    try {
      const response = await axios.post('https://mycode.lweb.ch/registro.php', {
        nombre,
        email,
        contraseña,
      });
  
      if (response.data.message === 'Registro exitoso') {
        const userData = {
          nombre: response.data.nombre, // Asumiendo que el backend devuelve esto
          email: response.data.email, // Asumiendo que el backend devuelve esto
          qrCodeIdentifier: response.data.qrCodeIdentifier, // Asegúrate de que el backend devuelve esto
          // otros datos necesarios...
        };
        // Guardar userData en AsyncStorage o pasar a través de la navegación
        Alert.alert('Éxito', 'Usuario registrado exitosamente');
        navigation.navigate('Login', { userData }); // Ejemplo de pasar userData como parámetro
      } else {
        Alert.alert('Error', 'No se pudo registrar el usuario');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Ocurrió un error durante el registro');
    }
  };
  const navegarALogin = () => {
    navigation.navigate('Login');
  };
  const navegarNegocio = () => {
    navigation.navigate('NegociosRegistro');
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


<LinearGradient
  colors={theme === 'dark' ? ['#009688', '#24243e'] : ['#009688', '#858585']} // Gradientes para tema oscuro y claro
  start={{x: 0, y: 0}}
  end={{x: 1, y: 0}}
  style={styles.botonGradiente}
>
  <TouchableOpacity onPress={openModal} style={styles.botonTransparente}>
    <Text style={styles.textoBotonGradiente}>Registrate aquí como Usuario</Text>
  </TouchableOpacity>
</LinearGradient>

<Modal
  animationType="slide"
  transparent={true}
  visible={modalRestablecerVisible}
  onRequestClose={() => setModalRestablecerVisible(false)}
>
  <View style={styles.centeredView}>
    <View style={styles.modalView}>
      <Text style={styles.modalText}>Ingresa tu correo electrónico para restablecer tu contraseña</Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor={theme === 'dark' ? '#888' : '#888'} // Usa un color claro para el tema oscuro y un gris para el tema claro
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <Button title="Enviar" onPress={enviarSolicitudRestablecimiento} />
    </View>
  </View>
</Modal>
<Modalize
                ref={modalizeRef}
                modalHeight={modalHeight}
                modalStyle={styles.modalContainer}
                overlayStyle={styles.overlay}
                handleStyle={styles.handle}
                onClosed={closeModal} // Agrega el evento onClosed para resetear el estado
            >
       <View style={styles.containerimputs}>       
<TextInput
  placeholder="Nombre"
  value={nombre}
  onChangeText={setNombre}
  placeholderTextColor={theme === 'dark' ? '#888' : '#888'} // Ajusta los colores según necesites
  style={styles.input}
/>

<TextInput
  placeholder="Email"
  value={email}
  onChangeText={setEmail}
  placeholderTextColor={theme === 'dark' ? '#888' : '#888'} // Ajusta los colores según necesites
  style={styles.input}
/>

<TextInput
  placeholder="Contraseña"
  value={contraseña}
  onChangeText={setContraseña}
  secureTextEntry
  placeholderTextColor={theme === 'dark' ? '#888' : '#888'} // Ajusta los colores según necesites
  style={styles.input}
/>

      <Button
        title={botonPresionado ? "Reenviar Código" : "Enviar Código"}
        onPress={enviarCodigoVerificacion}
      />
        {mostrarBotonRegistro && (
      <TextInput
        placeholder="Código de Verificación"
        value={codigoVerificacion}
        onChangeText={setCodigoVerificacion}
        placeholderTextColor={theme === 'dark' ? '#888' : '#888'} // Ajusta los colores según necesites
        style={styles.input}
      />
          )}
      {mostrarBotonRegistro && (
        <Button title="Registrarse" onPress={verificarCodigo} />
      )}
      </View> 
      </Modalize>

      {AppleAuthentication.isAvailableAsync() && (
    <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={styles.appleButton}
        onPress={signInWithApple}
    />
)}

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

      <TouchableOpacity style={styles.botonModern} onPress={navegarALogin}>
  <Text style={styles.textoBoton}>¿Estás registrado? Inicia sesión aquí</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.botonModern} onPress={() => setModalRestablecerVisible(true)}>
  <Text style={styles.textoBoton}>¿Olvidaste tu contraseña?</Text>
</TouchableOpacity>



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
  containerimputs: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
 
    padding: 20,
  },
  input: {
    width: '80%',
    height: 50,
    margin: 12,
    borderWidth: 1,
    borderColor: theme === 'dark' ? '#EEEEEE' : '#333',
    padding: 10,
    borderRadius: 10,
    fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
    color: theme === 'dark' ? '#EEEEEE' : '#333',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: theme === 'dark' ? '#0e0e0e' : 'white',
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
  animatedView: {
    width: 100,
    height: 80,
    backgroundColor: theme === 'dark' ? '#0e0e0e' : '#0e0e0e', // Cambia el color según el tema
    margin: 30,
},
overlay: {
    backgroundColor: 'transparent'
},
handle: {
    marginTop: 20,
    backgroundColor: theme === 'dark' ? 'white' : 'black', // Cambia el fondo del contenido del modal según el tema
    width: 50,
    height: 4,
},
modalContent: { // Estilo para el contenido DENTRO del modal
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme === 'dark' ? '#302b63' : 'white', // Cambia el fondo del contenido del modal según el tema
    borderRadius: 50,
},
modalContainer: { // Estilo para el CONTENEDOR del modal
    backgroundColor: theme === 'dark' ? '#1b173e' : '#a6c6c6', // Cambia el fondo del modal según el tema
},
botonModern: {
  paddingVertical: 5,
  borderRadius: 25,
  alignItems: 'center',
  marginVertical: 5, // Espacio vertical para separar los botones
},
textoBoton: {
  color: theme === 'dark' ? '#a1a1a1' : 'black', // Texto blanco para modo oscuro, negro para modo claro
  fontSize: 17,
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},
botonGradiente: {
  borderRadius: 25,
  marginVertical: 5, // Espacio vertical para separar de otros elementos
  marginBottom: 20, // Espacio en la parte inferior
},
botonTransparente: {
  paddingVertical: 12,
  paddingHorizontal: 25,
  borderRadius: 25,
  alignItems: 'center',
  width: '100%', // Asegura que el toque se detecte en todo el gradiente
},
textoBotonGradiente: {
  color: theme === 'dark' ? '#e7e7e7' : '#e7e7e7', // Texto blanco para tema oscuro, negro para tema claro
  fontSize: 17,
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},
appleButton: {
  width: 200,
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


export default Registro;
