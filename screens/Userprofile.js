import React, { useState, useEffect,useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Modal, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from './ThemeContext'; // Importa useTheme de tu ThemeContext
import QRCode from 'react-native-qrcode-svg';
import { Switch } from 'react-native'; 
import { Modalize } from 'react-native-modalize';

const UserProfile = ({ route, navigation }) => {
  const [userData, setUserData] = useState({ nombre: '', email: '', avatar: '', id: null,  qrCodeIdentifier: '' });
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { theme } = useTheme();
  const { themes, toggleTheme } = useTheme();
  const styles = getStyles(theme);
  const [userPoints, setUserPoints] = useState([]);
  const [datosUsuario, setDatosUsuario] = useState(null);
  const modalizeRef = useRef(null);
  const [isModalOpened, setIsModalOpened] = useState(false); // Nuevo estado para controlar la apertura del modal
  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight * 0.75;
  
  
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



  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20; // cuánto espacio en la parte inferior antes de considerar que se ha llegado al final
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };


  const loadUserPoints = async () => {
    try {
      const email = userData.email; // Asegúrate de que userData.email contenga el email correcto del usuario
      const url = `https://mycode.lweb.ch/getUserPoints.php?email=${encodeURIComponent(email)}`;
      console.log("Cargando puntos desde:", url); // Para depuración
      const response = await axios.get(url);
  
      if (response.data.success) {
        console.log("Puntos cargados:", response.data.puntos); // Para depuración
        setUserPoints(response.data.puntos);
      } else {
        console.log("No se encontraron puntos para el usuario:", response.data.message);
      }
    } catch (error) {
      console.error("Error al obtener los puntos del usuario:", error);
    }
  };
  
  useEffect(() => {
    if (userData.email) {
      loadUserPoints();
    }
  }, [userData.email]); // Dependencia: email del usuario
  

  useEffect(() => {
    const loadUserData = async () => {
      const storedUserData = await AsyncStorage.getItem('userData');
      if (storedUserData) {
        const data = JSON.parse(storedUserData);
        setUserData(data);
        // Asegúrate de llamar a fetchQRCodeIdentifier con el email correcto
        fetchQRCodeIdentifier(data.email);
        setNewName(data.nombre);
        setNewAvatar(data.avatar);
      } else if (route.params?.userData) {
        const data = route.params?.userData;
        setUserData(data);
        fetchQRCodeIdentifier(data.email);
        setNewName(data.nombre);
        setNewAvatar(data.avatar);
        await saveUserData(data);
      }
    };
  
    loadUserData();
  }, [route.params?.userData]);
  
// Función para obtener el identificador QR basado en el email
const fetchQRCodeIdentifier = async (email) => {
  if (email) {
    try {
      // Aquí debes pasar email en lugar de qrCodeIdentifier
      const response = await axios.get(`https://mycode.lweb.ch/obtener_qr_por_email.php?email=${encodeURIComponent(email)}`);
      if (response.data.success) {
        // Asegúrate de usar la clave correcta para actualizar el estado, que debe coincidir con la respuesta del servidor
        setUserData((prevState) => ({ ...prevState, qrCodeIdentifier: response.data.data.qr_code_identifier }));
      } else {
        console.log('No se pudo obtener el identificador QR');
      }
    } catch (error) {
      console.error('Error al obtener el identificador QR:', error);
    }
  }
};


  const saveUserData = async (userData) => {
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    // Guarda solo el avatar en AsyncStorage antes de cerrar sesión
    const avatarData = { avatar: userData.avatar };
    await AsyncStorage.setItem('userAvatar', JSON.stringify(avatarData));
    
    await AsyncStorage.removeItem('userData'); // Borra los demás datos del usuario de AsyncStorage
    setUserData({ nombre: '', email: '', avatar: '', id: null }); // Resetea el estado de userData
    navigation.navigate('Login'); // Redirige al usuario a la pantalla de inicio de sesión
};

  const changePassword = async () => {
    if (!userData.id) {
      Alert.alert("Error", "No hay datos de usuario disponibles.");
      return;
    }

    try {
      const response = await axios.post('https://mycode.lweb.ch/changePassword.php', {
        userId: userData.id,
        newPassword: newPassword,
      });

      if (response.data.success) {
        Alert.alert('Éxito', 'Contraseña cambiada exitosamente', [{ text: 'OK', onPress: () => setModalVisible(false) }]);
        setNewPassword(''); // Limpia el campo después de cambiar la contraseña
      } else {
        Alert.alert('Error', response.data.message || 'No se pudo cambiar la contraseña');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Ha ocurrido un error al cambiar la contraseña');
    }
  };

  const updateProfile = async () => {
    if (!userData.id) {
        Alert.alert("Error", "No hay datos de usuario disponibles para actualizar.");
        return;
    }

    try {
        const response = await axios.post('https://mycode.lweb.ch/actualizar_usuario.php', {
            id: userData.id,
            nombre: newName,
            avatar: newAvatar, // Asegúrate de enviar la imagen como cadena Base64
        });

        if (response.data.message) {
            Alert.alert('Éxito', 'Perfil actualizado correctamente');
            // Aquí puedes actualizar los datos en AsyncStorage y en el estado local
            const updatedData = { ...userData, nombre: newName, avatar: newAvatar };
            await saveUserData(updatedData);
            setUserData(updatedData);
        } else {
            Alert.alert('Error', response.data.error || 'No se pudo actualizar el perfil');
        }
    } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Ocurrió un error al actualizar el perfil');
    }
};


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
      setNewAvatar(base64Image); // Asegúrate de que este formato es el correcto
  } else {
        console.log('Selection was cancelled');
    }
};


return (
<ScrollView
    style={styles.scrollViewStyle}
    contentContainerStyle={styles.container}
    onScroll={({ nativeEvent }) => {
      if (isCloseToBottom(nativeEvent)) {
        loadUserPoints(); // O alguna otra función que desees ejecutar
      }
    }}
    scrollEventThrottle={400}
    scrollEnabled={!isModalOpened} // Deshabilita el desplazamiento cuando el modal está abierto
>
       <View style={styles.switchContainer}>
  <Switch
    value={theme === 'dark'}
    onValueChange={toggleTheme}
    trackColor={{ false: "#767577", true: "#81b0ff" }}
    thumbColor={theme === 'dark' ? "#f5dd4b" : "#f4f3f4"}
  />
</View>
          {userData.nombre && (
      <Text style={styles.greetingText}>Hola, {userData.nombre}</Text>

      
    )}
      {userData.id ? (
        <>
          <View style={styles.userInfoContainer}>
          <View style={{ alignItems: 'center', marginTop: 20, right:-80 , marginBottom: - 120,}}>
        <QRCode
          value={userData.qrCodeIdentifier}
          size={130}
          backgroundColor='white'
          color='black'
        />

      </View>
  
            {newAvatar ? (
              <TouchableOpacity onPress={pickImage}>
                <Image source={{ uri: newAvatar }} style={styles.avatar} />
              </TouchableOpacity>
            ) : (
              <Button title="Seleccionar Avatar" onPress={pickImage} />
            )}
            <TextInput
              style={styles.userInfoText}
              value={newName}
              onChangeText={setNewName}
              placeholder="Nombre"
            />
            
            <Text style={styles.userInfoText}>Email: {userData.email}</Text>
            <TouchableOpacity style={styles.changePasswordButtone} onPress={() => setModalVisible(true)}>
            <Text style={styles.changePasswordButtonTexto}>Cambiar Contraseña</Text>
          </TouchableOpacity>

          </View>
          <TouchableOpacity style={styles.changePasswordButton} onPress={updateProfile}>
            <Text style={styles.changePasswordButtonText}>Actualizar Perfil</Text>
          </TouchableOpacity>


          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.changePasswordButtonTextLogout}>Logout</Text>
</TouchableOpacity>


<Button title="Ver mis Puntos" onPress={openModal} />


<Modalize
                ref={modalizeRef}
                modalHeight={modalHeight}
                modalStyle={styles.modalContainer}
                overlayStyle={styles.overlay}
                handleStyle={styles.handle}
                onClosed={closeModal} // Agrega el evento onClosed para resetear el estado
            >
                <View style={styles.modalContent}> 

          {userPoints.length > 0 ? (
  userPoints.map((punto, index) => (
    <View key={index} style={styles.pointItemContainer}>
      {/* Muestra el avatar y el nombre del negocio en la misma línea */}
      <View style={styles.negocioInfoContainer}>
        <Image source={{ uri: punto.avatar }} style={styles.negocioAvatarStyle} />
        <Text style={styles.negocioNombreStyle}>{punto.negocioNombre}</Text>
      </View>
      {/* Muestra los puntos en grande */}
      <Text style={styles.pointItem}>
        {punto.puntos} puntos
      </Text>
      {/* Incluir el texto promocional debajo de los puntos */}
      <Text style={styles.textoPromocionalStyle}>{punto.textoPromocional}</Text>
    </View>
  ))
) : (
  <Text style={styles.noPointsText}>No tienes puntos registrados.</Text>
)}

</View>
            </Modalize>


        </>
      ) : (
        <Button title="Login" onPress={() => navigation.navigate('Login')} color="#0000ff" />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}> 
            <TextInput
              placeholder="Nueva Contraseña"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholderTextColor={theme === 'dark' ? '#EEEEEE' : '#888'} // Asegúrate de aplicar este cambio a todos los TextInput
              style={styles.input}
            />
            <View style={styles.modalButtonContainer}>
              <Button title="Cambiar Contraseña" onPress={changePassword} />
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};


const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme === 'dark' ? 'black' : '#f0f0f0',
    padding: 20,
    paddingTop: 120,
    paddingBottom: 50,
  },
  scrollViewStyle: {
    flex: 1, // Ocupa toda la pantalla
    backgroundColor: theme === 'dark' ? 'black' : '#f0f0f0',
    
  },
  contentContainerStyle: {
    alignItems: 'center', // Centra los hijos horizontalmente
    justifyContent: 'start', // Alinea los hijos al inicio del ScrollView
    padding: 20, // Espacio alrededor de los hijos
  },
  userInfoContainer: {
    marginBottom: 20,
    backgroundColor: theme === 'dark' ? '#222831' : 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
    width: '100%',
    maxWidth: 400,
  },
  userInfoText: {
    fontSize: 18,
    marginBottom: 12,
    color: theme === 'dark' ? '#EEEEEE' : '#333',
    fontWeight: 'bold', // Agrega un poco de grosor al texto para mejorar la legibilidad
  },
  changePasswordButtonTexto: {
    color: theme === 'dark' ? '#007bff' : '#007bff',
    fontWeight: 'bold', // Agrega un poco de grosor al texto para mejorar la legibilidad
    marginLeft: -20,

  },
  changePasswordButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginBottom: 20,
  },
  changeLogoutButton: {
    marginTop: 20,
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
  },

  changePasswordButtone: {
    paddingVertical: 5,
    paddingHorizontal: 25,
    borderRadius: 20,
  },

  changePasswordButtonText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  changePasswordButtonTextLogout: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
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
  },
  input: {
    height: 50,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme === 'dark' ? '#393E46' : '#007bff', // Añade un color de borde basado en el tema
    backgroundColor: theme === 'dark' ? '#222831' : '#fff', // Cambia el fondo del input basado en el tema
    color: theme === 'dark' ? '#EEEEEE' : '#333', // Cambia el color del texto del input basado en el tema
    padding: 10,
    borderRadius: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 4,
    borderColor: theme === 'dark' ? '#007bff' : '#f0f0f0', // Añade un borde para resaltar la imagen del avatar
  },
  greetingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme === 'dark' ? '#ffffff' : '#000000',
    marginBottom: 20, // Ajusta el margen según necesites
  },

  negocioInfoContainer: {
    flexDirection: 'row', // Elementos lado a lado
    alignItems: 'center', // Centrar elementos verticalmente
    marginBottom: 10, // Espacio entre la info del negocio y los puntos
  },
  negocioAvatarStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  negocioNombreStyle: {
    fontSize: 21,
    color: theme === 'dark' ? '#ffffff' : '#000000',
  },
  pointItem: {
    fontWeight: 'bold',
    fontSize: 24, // Tamaño de fuente grande para los puntos
    color: 'green', // O cualquier color que prefieras
    marginBottom: 5, // Espacio entre los puntos y el texto promocional
  },
  textoPromocionalStyle: {
    fontSize: 14, // Ajusta según necesites
    color: 'gray', // O cualquier color que prefieras
  },
  noPointsText: {
    textAlign: 'center', // Centrar el texto si no hay puntos
  },
  logoutButton: {
    position: 'absolute',
    top: 40, // Ajusta la distancia desde la parte superior
    left: 10, // Ajusta la distancia desde la izquierda
    padding: 10, // Añade un poco de padding para hacer más fácil tocar el icono

},
switchContainer: {
  position: 'absolute',
  top: 50, // Ajusta según sea necesario para tu layout
  right: 10, // Ajusta según sea necesario para tu layout
  zIndex: 1, // Asegúrate de que el switch se muestre por encima de otros elementos si es necesario
},
pointItemContainer: {
  backgroundColor: theme === 'dark' ? '#222831' : '#fff', // Cambia el fondo del input basado en el tema
  padding: 15, // Espacio dentro del contenedor
  borderRadius: 10, // Bordes redondeados
  marginBottom: 15, // Espacio entre cada item de puntos
   padding: 20,
   minWidth: 250,

},
animatedView: {
  width: 100,
  height: 80,
  backgroundColor: theme === 'dark' ? 'blac' : 'black', // Cambia el color según el tema
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

modalContainer: { // Estilo para el CONTENEDOR del modal
  backgroundColor: theme === 'dark' ? '#1c1c1c' : 'white', // Cambia el fondo del modal según el tema
},
text: {
  color: theme === 'dark' ? 'white' : 'black', // Cambia el color del texto según el tema
},
});


export default UserProfile;