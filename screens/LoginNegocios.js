import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from './ThemeContext'; // Importa useTheme de tu ThemeContext
import { Camera } from 'expo-camera';
import { Switch } from 'react-native'; 

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [textoPromocional, setTextoPromocional] = useState('');
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [paginaWeb, setPaginaWeb] = useState('');
  const [datosUsuario, setDatosUsuario] = useState(null);
  const [logueado, setLogueado] = useState(false);
  const [editando, setEditando] = useState(false);
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarNuevaContrasena, setConfirmarNuevaContrasena] = useState('');
  const [avatar, setAvatar] = useState('');
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [scanned, setScanned] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [userData, setUserData] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [showUserData, setShowUserData] = useState(false);
  const [puntos, setPuntos] = useState(''); // Añade esto a tus estados en LoginScreen
  const [userPoints, setUserPoints] = useState([]);
  const { themes, toggleTheme } = useTheme();


  const añadirPuntos = async () => {
    console.log("Enviando datos para añadir puntos:", {
        negocioEmail: email,
        usuarioEmail: userData.email,
        puntos: puntos,
    });

    try {
        const response = await axios.post('https://mycode.lweb.ch/puntos.php', {
            negocioEmail: email,
            usuarioEmail: userData.email,
            puntos: parseInt(puntos),
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log("Respuesta del servidor al añadir puntos:", response.data);

        if (response.data.message === 'Puntos actualizados con éxito.') {
          Alert.alert('Éxito', 'Puntos añadidos correctamente.', [
              { text: 'OK', onPress: () => fetchUserPoints(userData.email, email) }
          ]);
          setPuntos(''); // Limpia el campo de puntos después de un éxito
      } else {
          Alert.alert('Error', 'No se pudieron añadir los puntos.');
      }
    } catch (error) {
        console.error('Error al añadir puntos:', error);
        Alert.alert('Error', 'Ocurrió un error al añadir los puntos.');
    }
};

const resetUserPoints = async () => {
  try {
    const response = await axios.post('https://mycode.lweb.ch/resetUserPoints.php', {
      usuarioEmail: userData.email, // Asume que tienes el email del usuario en el estado
      negocioEmail: email,

    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log("Respuesta del servidor al restablecer puntos:", response.data);

    if (response.data.message === 'Puntos restablecidos con éxito.') {
      setUserPoints(0); // Actualiza el estado para reflejar el cambio inmediatamente
      Alert.alert('Éxito', 'Puntos restablecidos correctamente.');
    } else {
      Alert.alert('Error', 'No se pudieron restablecer los puntos.');
    }
  } catch (error) {
    console.error('Error al restablecer puntos:', error);
    Alert.alert('Error', 'Ocurrió un error al restablecer los puntos.');
  }
};

const fetchUserPoints = async (userEmail, negocioEmail) => {
  try {
      const response = await axios.get(`https://mycode.lweb.ch/getUserPointsNegocios.php`, {
          params: {
              email: userEmail,
              negocioEmail: negocioEmail, // Asegúrate de que tu backend pueda manejar este nuevo parámetro
          }
      });
      if (response.data.success) {
          setUserPoints(response.data.puntos); // Asume que `puntos` es un array
      } else {
          console.log("No se encontraron puntos para el usuario en este negocio.");
          setUserPoints([]); // Limpiar los puntos si no se encuentran
      }
  } catch (error) {
      console.error("Error al obtener los puntos del usuario para este negocio:", error);
  }
};

const handleBarCodeScanned = ({ type, data }) => {
  setScanned(true);
  setShowCamera(false); // Cierra la cámara después de escanear
  fetchUserData(data).then(() => {
    if (userData && userData.email) {
      fetchUserPoints(userData.email, email);
    } else {
      console.log('Error: No hay datos de usuario disponibles');
    }
  });
  setShowUserData(true); // Muestra los datos del usuario
};

 

const fetchUserData = async (qrCodeIdentifier) => {
  try {
    const response = await axios.get(`http://mycode.lweb.ch/obtener_qr.php?qrCodeIdentifier=${encodeURIComponent(qrCodeIdentifier)}`);
    if (response.data.success && response.data.data) {
      setUserData(response.data.data);
      console.log("Datos de usuario establecidos:", response.data.data);

      // Verificar si el email está presente antes de llamar a fetchUserPoints
      if (response.data.data.email) {
        fetchUserPoints(response.data.data.email, email); // Asegúrate también de que 'email' (email del negocio) esté definido correctamente
      } else {
        console.error("Error: Email del usuario no disponible en la respuesta.");
        alert("Error: No se pudo recuperar el email del usuario.");
      }
    } else {
      alert('Usuario no encontrado');
    }
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    alert('Ocurrió un error al obtener los datos del usuario');
  }
};



  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync(); // Cambiado aquí
      setHasPermission(status === 'granted');
    })();
  }, []);


  
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesitan permisos para acceder a la galería.');
        return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
  });
  
  if (!result.cancelled && result.assets && result.assets.length > 0) {
    const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
    setAvatar(base64Image); // Asegúrate de que este formato es el correcto
    await AsyncStorage.setItem('@avatar', base64Image); // Guarda el avatar en AsyncStorage
} else {
    console.log('Selection was cancelled');
}
};



  useEffect(() => {
    leerDatosAlmacenados();
  }, []);

  const leerDatosAlmacenados = async () => {
    try {
        const emailAlmacenado = await AsyncStorage.getItem('@email');
        const datosUsuarioAlmacenados = await AsyncStorage.getItem('@datosUsuario');
        const avatarAlmacenado = await AsyncStorage.getItem('@avatar');

        if (emailAlmacenado !== null) {
            setEmail(emailAlmacenado);
        }
        if (datosUsuarioAlmacenados !== null) {
            setDatosUsuario(JSON.parse(datosUsuarioAlmacenados));
            setLogueado(true);
        }
        if (avatarAlmacenado) {
            setAvatar(avatarAlmacenado);
        } else {
            setAvatar(null); // Asegúrate de que este es el comportamiento deseado o establece un avatar por defecto
        }
    } catch (error) {
        console.log('Error al leer los datos almacenados', error);
    }
};
  

  const iniciarSesion = async () => {
    try {
      const response = await axios.post('https://mycode.lweb.ch/negocios/login_negocios.php', {
        email,
        contraseña,
      });
  
      if (response.data.message === 'Inicio de sesión exitoso') {
        // Aquí deberías guardar los datos en AsyncStorage
        await AsyncStorage.setItem('@email', email);
        // Obtener y guardar datos del usuario después de un inicio de sesión exitoso
        obtenerDatosUsuario(email); // Esta función ya debe encargarse de guardar los datos del usuario en AsyncStorage
      } else {
        Alert.alert('Error', response.data.error);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Ocurrió un error durante el inicio de sesión');
    }
    };
    const obtenerDatosUsuario = async (email) => {
      try {
        const response = await axios.post('https://mycode.lweb.ch/negocios/perfil_negocios.php', { email });
        if (response.data.message === 'Datos obtenidos con éxito') {
          console.log("Datos de usuario recibidos:", response.data.datos_usuario);
          // Guarda los datos del usuario en AsyncStorage
          await AsyncStorage.setItem('@datosUsuario', JSON.stringify(response.data.datos_usuario));
          setDatosUsuario(response.data.datos_usuario);
          setLogueado(true); // Establece el estado a true cuando los datos del usuario se han obtenido y guardado exitosamente
        } else {
          Alert.alert('Error', response.data.error);
        }
      } catch (error) {
        console.log(error);
        Alert.alert('Error', 'Ocurrió un error al obtener los datos del usuario');
      }
    };
  
    const editarDatos = () => {
        // Establece el estado para la edición y carga los datos actuales
        setEditando(true);
        if (datosUsuario) {
            setNombre(datosUsuario.nombre);
            setDireccion(datosUsuario.direccion);
            setTelefono(datosUsuario.telefono);
            setPaginaWeb(datosUsuario.pagina_web);
            setTextoPromocional(datosUsuario.texto_promocional); // Actualiza el estado

        }
    };

    const guardarEdicion = async () => {
      if (!email) {
        Alert.alert('Error', 'La información del usuario no está completa.');
        return;
      }
    
      try {
        const response = await axios.post('https://mycode.lweb.ch/negocios/editar_usuario.php', {
          email: email,
          nombre: nombre,
          direccion: direccion,
          telefono: telefono,
          pagina_web: paginaWeb,
          texto_promocional: textoPromocional,
          avatar,

        });
    
        if (response.data.message === 'Datos actualizados con éxito') {
          Alert.alert('Éxito', 'Tus datos han sido actualizados');
          
          // Crea un objeto con los nuevos datos del usuario
          const nuevosDatosUsuario = {
            ...datosUsuario,
            nombre: nombre,
            direccion: direccion,
            telefono: telefono,
            pagina_web: paginaWeb,
            texto_promocional: textoPromocional,
            avatar,
          };
    
          // Actualiza los datos del usuario en el estado
          setDatosUsuario(nuevosDatosUsuario);
    
          // Actualiza los datos del usuario en AsyncStorage
          await AsyncStorage.setItem('@datosUsuario', JSON.stringify(nuevosDatosUsuario));
    
          setEditando(false); // Salir del modo edición
          // No es necesario llamar a obtenerDatosUsuario aquí porque ya actualizamos los datos localmente
        } else {
          Alert.alert('Error', response.data.error);
        }
      } catch (error) {
        console.log(error);
        Alert.alert('Error', 'Ocurrió un error al actualizar los datos');
      }
    };
    
  const cambiarContrasena = async () => {
    if (nuevaContrasena !== confirmarNuevaContrasena) {
        Alert.alert('Error', 'Las contraseñas no coinciden.');
        return;
    }

    if (nuevaContrasena.length < 6) {
        Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres.');
        return;
    }

    try {
        const response = await axios.post('https://mycode.lweb.ch/negocios/cambiar_contrasena.php', {
            email: email,
            nueva_contrasena: nuevaContrasena,
        });

        if (response.data.message) {
            Alert.alert('Éxito', 'Contraseña actualizada con éxito');
            // Limpia los campos y estados relacionados con la contraseña
            setNuevaContrasena('');
            setConfirmarNuevaContrasena('');
        } else {
            Alert.alert('Error', response.data.error || 'Error al cambiar la contraseña');
        }
    } catch (error) {
        console.log(error);
        Alert.alert('Error', 'Ocurrió un error al cambiar la contraseña');
    }
};

const cerrarSesion = async () => {
  try {
    await AsyncStorage.removeItem('@email');
    await AsyncStorage.removeItem('@datosUsuario');
    // Mantén @avatar en AsyncStorage para uso futuro
    
    setLogueado(false);
    setDatosUsuario(null);
    setEmail('');
    setContraseña('');
    // No necesitas resetear setAvatar aquí si quieres mantener la imagen para el próximo login
  } catch (error) {
    console.log('Error al limpiar los datos de sesión', error);
    Alert.alert('Error', 'Ocurrió un error al cerrar sesión');
  }
};


    const registrarUsuario = () => {
      navigation.navigate('NegociosRegistro');
  };

  const scaner = () => {
    setScanned(false); // Restablece el estado de scanned a false
    setShowCamera(true); // Muestra la cámara
  };




    return (
      
      <View style={styles.container}>
 <View style={styles.switchContainer}>
  <Switch
    value={theme === 'dark'}
    onValueChange={toggleTheme}
    trackColor={{ false: "#767577", true: "#81b0ff" }}
    thumbColor={theme === 'dark' ? "#f5dd4b" : "#f4f3f4"}
  />
</View>

          {!logueado ? (
              <>

                  <TextInput
                      placeholder="Email"
                      value={email}
                      onChangeText={setEmail}
                      style={styles.input}
                  />
                  <TextInput
                      placeholder="Contraseña"
                      value={contraseña}
                      onChangeText={setContraseña}
                      secureTextEntry
                      style={styles.input}
                  />
                  
             <TouchableOpacity onPress={iniciarSesion} style={styles.button}>
  <Text style={styles.buttonText}>Iniciar Sesión</Text>
</TouchableOpacity>
<TouchableOpacity onPress={registrarUsuario} style={styles.button}>
  <Text style={styles.buttonText}>¿No estás registrado? Regístrate aquí</Text>
</TouchableOpacity>


              </>
          ) : (
              <>
                  {editando ? (
                      <>
<>
</>

                          <TextInput
                              placeholder="Nombre"
                              value={nombre}
                              onChangeText={setNombre}
                              style={styles.input}
                          />
                          <TextInput
                              placeholder="Dirección"
                              value={direccion}
                              onChangeText={setDireccion}
                              style={styles.input}
                          />
                          <TextInput
                              placeholder="Teléfono"
                              value={telefono}
                              onChangeText={setTelefono}
                              style={styles.input}
                          />
                          <TextInput
                              placeholder="Página Web"
                              value={paginaWeb}
                              onChangeText={setPaginaWeb}
                              style={styles.input}
                          />
                            <TextInput
    placeholder="Texto Promocional"
    value={textoPromocional}
    onChangeText={setTextoPromocional} // Actualiza el estado al escribir
    style={styles.input}
  />
    
                          <Button
                              title="Guardar"
                              onPress={guardarEdicion}
                          />
        <TextInput
            placeholder="Nueva Contraseña"
            value={nuevaContrasena}
            onChangeText={setNuevaContrasena}
            secureTextEntry
            style={styles.input}
        />
        <TextInput
            placeholder="Confirmar Nueva Contraseña"
            value={confirmarNuevaContrasena}
            onChangeText={setConfirmarNuevaContrasena}
            secureTextEntry
            style={styles.input}
        />
        <Button
            title="Cambiar Contraseña"
            onPress={cambiarContrasena}
        />
                   <Button
                              title="Cancelar"
                              onPress={() => setEditando(false)}
                          />
                          
                      </>
                  ) : (
                      <>
             <View style={styles.userInfoContainer}>
              {datosUsuario && (
                <>
        
        <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatarStyle} />
              ) : (
                <Image source={require('../assets/imagenes/place.png')} style={styles.avatarStyle} />
              )}
            </TouchableOpacity>

<Text style={styles.userInfoValues}>{datosUsuario.nombre}</Text>
<Text style={styles.userInfoTitle}>Dirección: <Text style={styles.userInfoValue}>{datosUsuario.direccion}</Text></Text>
<Text style={styles.userInfoTitle}>Teléfono: <Text style={styles.userInfoValue}>{datosUsuario.telefono}</Text></Text>
<Text style={styles.userInfoTitle}>Página Web: <Text style={styles.userInfoValue}>{datosUsuario.pagina_web}</Text></Text>
<Text style={styles.userInfoValue}>{datosUsuario.texto_promocional}</Text>

{showCamera ? (
  <Camera
  style={StyleSheet.absoluteFillObject}
  onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
  onCameraReady={() => setIsCameraReady(true)}
  quality={0.5} // Ajusta la calidad de la imagen (0 a 1)
  autoFocus={Camera.Constants.AutoFocus.on} // Enfoque automático
  focusDepth={0} // Profundidad de enfoque (0 a 1)
  exposureCompensation={0} // Compensación de exposición (-1 a 1)
  whiteBalance={Camera.Constants.WhiteBalance.auto} // Balance de blancos automático
>
{scanned && (
  <TouchableOpacity
    style={styles.scanAgainButton}
    onPress={() => {
      setScanned(false); // Restablece el estado de scanned a false
      setShowCamera(true); // Muestra la cámara para un nuevo escaneo
    }}
  >
    <Text style={styles.scanAgainButtonText}>Tocar aqui para escanear de nuevo</Text>
  </TouchableOpacity>
)}

</Camera>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.scanButton} onPress={() => setShowCamera(true)}>
            <Text style={styles.scanButtonText}>Escanear Código QR</Text>
          </TouchableOpacity>
        </View>
      )}
      {userData && showUserData && (
        <View style={styles.userDataContainer}>
          <Text style={styles.userDataText}>Nombre: {userData.nombre}</Text>
          <Text style={styles.userDataText}>Email: {userData.email}</Text>
    {userPoints.length > 0 ? (
  userPoints.map((point, index) => (
    <Text key={index}>
     {point.puntos} puntos
    </Text>
  ))
  
) : (
  <Text>No tienes puntos registrados.</Text>
)}



    <TextInput
      style={styles.input}
      placeholder="Puntos a añadir"
      value={puntos}
      onChangeText={setPuntos}
      keyboardType="numeric" // Asegura que solo se puedan ingresar números
    />
    <Button
      title="Añadir Puntos"
      onPress={() => añadirPuntos()} // Implementaremos esta función en el siguiente paso
    />
     <Button title="Restablecer Puntos" onPress={resetUserPoints} />
      <Button title="Cerrar" onPress={() => setShowUserData(false)} />
        </View>
        
      )}

                </>
              )}
            </View> 
<TouchableOpacity onPress={editarDatos} style={styles.logoutButtone}>
  <Text style={styles.buttonText}>Editar datos</Text>
</TouchableOpacity>

<TouchableOpacity onPress={cerrarSesion} style={styles.logoutButton}>
          <Text style={styles.changePasswordButtonTextLogout}>Logout</Text>
</TouchableOpacity>

                          
                          
                      </>
                  )}
              </>
          )}
          
      </View>
  );
  
};

const getStyles = (theme) => StyleSheet.create({
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
profileContainer: {
  width: '100%', // Ocupar todo el ancho disponible
},
avatarContainer: {
  marginBottom: 20,
},
avatarStyle: {
  width: 120,
  height: 120,
  borderRadius: 60,
  borderWidth: 3,
  borderColor: '#E1E1E1',
  marginBottom: 10,
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

buttonscaner: {
  backgroundColor: 'green', // Un azul vibrante para el botón principal
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


buttonCerrar: {
  backgroundColor: 'red', // Un azul vibrante para el botón principal
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
},
userInfoContainer: {
  marginBottom: 20,

},
userInfoTitle: {
  fontSize: 18,
  fontWeight: 'bold', // Aplica negrita al título
  color: theme === 'dark' ? '#EEEEEE' : '#333', // Cambia el color del texto del input basado en el tema
  marginBottom: 5,
},

userInfoTitlehola: {
  fontSize: 26,
  fontWeight: 'bold', // Aplica negrita al título
  color: theme === 'dark' ? '#EEEEEE' : '#333', // Cambia el color del texto del input basado en el tema
  marginBottom: 45,
  marginTop: -20,
},
userInfoValuehola: {
  fontWeight: 'normal', // Asegura que el texto del valor tenga un peso normal
  marginBottom: 5,
  fontSize: 25,
  color: theme === 'dark' ? '#EEEEEE' : '#333', // Cambia el color del texto del input basado en el tema
},


userInfoValue: {
  fontWeight: 'normal', // Asegura que el texto del valor tenga un peso normal
  marginBottom: 5,
  fontSize: 17,
  color: theme === 'dark' ? '#EEEEEE' : '#333', // Cambia el color del texto del input basado en el tema
},
userInfoValues: {
  fontWeight: 'normal', // Asegura que el texto del valor tenga un peso normal
  marginBottom: 5,
  fontSize: 23,
  color: theme === 'dark' ? '#EEEEEE' : '#333', // Cambia el color del texto del input basado en el tema
marginBottom: 10,
},

scanButton: {
  paddingHorizontal: 20,
  paddingVertical: 10,
  backgroundColor: 'green',
  borderRadius: 5,
  marginTop: 20,
},
scanButtonText: {
  color: 'white',
  fontSize: 20,
},
userDataContainer: {
  position: 'absolute',
  bottom: 70,
  left: 0,
  right: 0,
  backgroundColor: 'white',
  padding: 20,
  borderRadius: 5,
  alignItems: 'center', // Centra el texto en el contenedor

},

userDataText: {
  fontSize: 18,
  marginBottom: 10,
},
containercamara: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
scanAgainButton: {
  backgroundColor: "#4CAF50", // Un verde para el botón
  padding: 10,
  borderRadius: 5,
  alignItems: "center",
  marginTop: 20,
},
scanAgainButtonText: {
  color: "#ffffff", // Texto blanco para contrastar con el fondo verde
  fontSize: 16,
},
switchContainer: {
  position: 'absolute',
  top: 50, // Ajusta según sea necesario para tu layout
  right: 10, // Ajusta según sea necesario para tu layout
  zIndex: 1, // Asegúrate de que el switch se muestre por encima de otros elementos si es necesario
},
logoutButton: {
  position: 'absolute',
  top: 40, // Ajusta la distancia desde la parte superior
  left: 10, // Ajusta la distancia desde la izquierda
  padding: 10, // Añade un poco de padding para hacer más fácil tocar el icono

},
logoutButtone: {
  position: 'absolute',
  top: 70, // Ajusta la distancia desde la parte superior
  left: 10, // Ajusta la distancia desde la izquierda
  padding: 10, // Añade un poco de padding para hacer más fácil tocar el icono

},
changePasswordButtonTextLogout: {
  fontSize: 18,
  color: 'red',
  textAlign: 'center',
},
buttonText: {
  color: 'blue',
  fontSize: 18, // Un tamaño de fuente más grande para mejorar la legibilidad
},

});

export default LoginScreen;

