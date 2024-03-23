import React, { useState, useEffect,useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Modal, TouchableOpacity, Image, ScrollView, Dimensions, Linking } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from './ThemeContext'; // Importa useTheme de tu ThemeContext
import QRCode from 'react-native-qrcode-svg';
import { Modalize } from 'react-native-modalize';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import congratulationsImage from '../assets/imagenes/firework.png';
import defaultAvatar from '../assets/imagenes/headerImage.png';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import { ImageBackground } from 'react-native';

const screenWidth = Dimensions.get('window').width;
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
  const modalHeight = screenHeight * 0.87;
  const [hasNameChanged, setHasNameChanged] = useState(false);
const [hasAvatarChanged, setHasAvatarChanged] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const gradientColors = theme === 'dark' ? ['#16142ced', '#322d6ded', '#24243e69'] : ['#fffbd5', '#2f8080a3', '#fffbd54f'];
const [searchTermPoints, setSearchTermPoints] = useState('');
const [filteredUserPoints, setFilteredUserPoints] = useState([]);
const [expandedIndex, setExpandedIndex] = useState(null);
const [isBenefitModalVisible, setIsBenefitModalVisible] = useState(false);
const [benefitInfo, setBenefitInfo] = useState({ points: 0, businessName: '' });
const [benefitsShown, setBenefitsShown] = useState({});
const [isUpdateProfileButtonVisible, setIsUpdateProfileButtonVisible] = useState(true);

useEffect(() => {
  const getButtonVisibility = async () => {
      const visibility = await AsyncStorage.getItem('isUpdateProfileButtonVisible');
      // Si no hay nada almacenado (primera vez), el botón no será visible
      setIsUpdateProfileButtonVisible(visibility === 'true');
  };

  getButtonVisibility();
}, []);



useEffect(() => {
  const fetchUserData = async () => {
      const storedUserData = await AsyncStorage.getItem('userData.id');
      if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
      } else if (route.params?.userData.id) {
          setUserData(route.params.userData.id);
      }
  };
  fetchUserData();
}, [route.params?.userData.id]);

const toggleExpansion = (index) => {
  if (index !== expandedIndex) { // Solo si se está expandiendo un nuevo ítem
      const punto = userPoints[index];
      if (punto) {
          console.log(`Comprobando beneficio especial para ${punto.negocioNombre} con puntos ${punto.puntos} y beneficio ${punto.tipoBeneficioPersonalizado}`);
          checkSpecialBenefit(punto.puntos, punto.tipoBeneficioPersonalizado, punto.negocioNombre);
      }
  }
  setExpandedIndex(index === expandedIndex ? null : index);
};


useEffect(() => {
  const results = userPoints.filter(punto =>
    punto.negocioNombre.toLowerCase().includes(searchTermPoints.toLowerCase()) ||
    punto.emailNegocio.toLowerCase().includes(searchTermPoints.toLowerCase())
  );
  setFilteredUserPoints(results);
}, [searchTermPoints, userPoints]);


useEffect(() => {
  if (expandedIndex != null) { // Asegúrate de que existe un índice expandido
    const punto = userPoints[expandedIndex]; // Obtiene el punto correspondiente al índice expandido
    if (punto) {
      checkSpecialBenefit(punto.puntos, punto.tipoBeneficioPersonalizado, punto.negocioNombre);
    }
  }
}, [expandedIndex, userPoints]); // Añade userPoints a las dependencias si es necesario


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

    const openModal = async () => {
      setIsModalOpened(true); // Establecer el estado para indicar que el modal está abierto
      await loadUserPoints(); // Cargar puntos del usuario al abrir el modal
    };
    
    const closeModal = () => {
      setIsModalOpened(false); // Resetea el estado cuando el modal se cierra
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
              // Llama a checkSpecialBenefit para cada negocio después de cargar los puntos
              response.data.puntos.forEach(punto => {
                  console.log(`Comprobando beneficio especial para ${punto.negocioNombre} con puntos ${punto.puntos} y beneficio ${punto.tipoBeneficioPersonalizado}`);
                  checkSpecialBenefit(punto.puntos, punto.tipoBeneficioPersonalizado, punto.negocioNombre);
              });
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

  const renderCirclesForBusiness = (puntosUsuario, puntosRequeridos) => {
    const totalCircles = Math.ceil(puntosRequeridos / 10);
    const filledCircles = Math.floor(puntosUsuario / 10);
    const icons = [];

    for (let i = 0; i < totalCircles; i++) {
        const isIconFilled = i < filledCircles;
        icons.push(
            // Asegúrate de dar un poco de margen entre íconos
            <View key={i} style={{ margin: 5 }}> 
                <Ionicons
                    name={isIconFilled ? "restaurant-sharp" : "restaurant-outline"}
                    size={28}  // Puedes ajustar el tamaño según necesites
                    color={isIconFilled ? "gray" : "gray"}  // Ajusta los colores según tus necesidades
                />
            </View>
        );
    }
    return icons;
};

  

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
  setIsLoading(true); // Inicia el indicador de carga
  if (!userData.id) {
      Alert.alert("Error", "No hay datos de usuario disponibles para actualizar.");
      setIsLoading(false); // Detiene el indicador de carga debido a un error
      return;
  }

  try {
      const response = await axios.post('https://mycode.lweb.ch/actualizar_usuario.php', {
          id: userData.id,
          nombre: newName,
          avatar: newAvatar, // Asegúrate de enviar la imagen como cadena Base64
      });

      if (response.data.message) {
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
  setIsLoading(false); // Detiene el indicador de carga
  setIsUpdateProfileButtonVisible(false);
};



  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync(); // Solicita permisos para acceder a la galería
    if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesitan permisos para acceder a la galería.');
        return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1, // Calidad original; considerar reducir para imágenes más pequeñas
        base64: false, // Cambiado a false ya que manejaremos la conversión a base64 después de redimensionar
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
        const originalUri = result.assets[0].uri; // URI de la imagen original
        const newWidth = 300; // Ancho deseado para la imagen redimensionada
        const newHeight = 300; // Alto deseado para la imagen redimensionada
        const compressFormat = 'JPEG'; // Formato de compresión de la imagen
        const quality = 75; // Calidad de la imagen redimensionada

        ImageResizer.createResizedImage(originalUri, newWidth, newHeight, compressFormat, quality, 0)
            .then(async ({ uri }) => {
                // Éxito en el redimensionamiento, proceder a convertir en base64
                const response = await fetch(uri);
                const blob = await response.blob();
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64Image = reader.result;
                    setNewAvatar(base64Image); // Actualiza el estado del nuevo avatar
                    setHasAvatarChanged(true); // Indica que el avatar ha cambiado
                    setIsUpdateProfileButtonVisible(true);
                };
                reader.readAsDataURL(blob);
            })
            .catch((err) => {
                console.error('Error resizing the image:', err);
                Alert.alert('Error', 'Ocurrió un error al redimensionar la imagen');
            });
    } else {
        console.log('Selection was cancelled');
    }
};


const checkSpecialBenefit = (userPoints, benefitPoints, negocioNombre) => {
  console.log(`Verificando: ${userPoints} >= ${benefitPoints}`);
  if (parseInt(userPoints) >= parseInt(benefitPoints) && !benefitsShown[negocioNombre]) {
      console.log(`Mostrando beneficio especial para ${negocioNombre}`);
      setBenefitInfo({ points: benefitPoints, businessName: negocioNombre });
      setIsBenefitModalVisible(true);
      setBenefitsShown(prev => ({ ...prev, [negocioNombre]: true }));
  }
};

const registrarUsuario = () => {
  navigation.navigate('HomeScreen');
};


if (isLoading) {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',  backgroundColor: 'black',}}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
  );
}

return (
  <ImageBackground
  source={require('../assets/imagenes/sale.png')} // Cambia esto por tu imagen de fondo
  resizeMode="cover" // Esto es para que la imagen cubra todo el fondo
  style={styles.backgroundImage}
>
    <LinearGradient
        colors={gradientColors}
        style={styles.scrollViewStyle}
    >
          {userData.id && (
      <Text style={styles.greetingText}>{userData.nombre}</Text>
      
    )}

{userData.id && (
   
<Text style={styles.userInfoTextmail}>{userData.email}</Text>
      
    )}

      {userData.id ? (
        <>
          <View style={styles.userInfoContainer}>
          <View style={{ alignItems: 'center', marginTop: 20, right:-80 , marginBottom: - 120,}}>
          <View style={[styles.qrContainer, { marginTop: 20, marginBottom: 5, padding: 10, backgroundColor: 'white', borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }]}>
    <QRCode
      value={userData.qrCodeIdentifier ? userData.qrCodeIdentifier : 'example'}
      size={140} // Ajusta este valor según tus necesidades
      color='white'
      backgroundColor='#067b7b'
    />
          
</View>
      </View>
  
            {newAvatar ? (
              <TouchableOpacity onPress={pickImage}>
                <Image source={{ uri: newAvatar }} style={styles.avatar} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
              <Ionicons name="camera-outline" size={44} color={theme === 'dark' ? '#FFFFFF' : '#000000'} />
            </TouchableOpacity>
            
            )}

            <TouchableOpacity style={styles.changePasswordButtone} onPress={() => setModalVisible(true)}>
            <Text style={styles.changePasswordButtonTexto}>Cambiar Contraseña</Text>
          </TouchableOpacity>
          {isUpdateProfileButtonVisible && (
    <TouchableOpacity style={styles.changePasswordButtone} onPress={updateProfile}>
        <Text style={styles.changePasswordButtonText}>Actualizar Perfil</Text>
    </TouchableOpacity>
)}

          </View>

          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
    <Ionicons 
        name="log-out-outline" 
        size={29} 
        color={theme === 'dark' ? '#EEEEEE' : '#000000'} // Ajusta los colores según tu preferencia
    />
</TouchableOpacity>

<TouchableOpacity onPress={registrarUsuario} style={styles.backButton}>
    <Ionicons 
        name="home-outline" 
        size={25} 
        color={theme === 'dark' ? '#EEEEEE' : '#000000'} // Ajusta los colores según tu preferencia
    />
</TouchableOpacity>



<LinearGradient
  colors={theme === 'dark' ? ['#009688', '#24243e'] : ['#009688', '#858585']} // Gradientes para tema oscuro y claro
  start={{x: 0, y: 0}}
  end={{x: 1, y: 0}}
  style={styles.botonGradiente}
>
<TouchableOpacity onPress={openModal} style={styles.botonTransparente}>
<Ionicons name="star" size={24} color="white" style={{ marginBottom: 8 }} />
      <Text style={styles.textoBotonGradiente}>Ver mis Puntos</Text>
    </TouchableOpacity>
</LinearGradient>




<Modalize
  ref={modalizeRef}
  modalHeight={modalHeight}
  modalStyle={styles.modalContainer}
  overlayStyle={styles.overlay}
  handleStyle={styles.handle}
  onClosed={closeModal}
>
  <View style={styles.searchContainer}>
    <TextInput
      style={styles.searchInput}
      placeholderTextColor={theme === 'dark' ? '#888' : '#888'}
      placeholder="Buscar..."
      value={searchTermPoints}
      onChangeText={setSearchTermPoints}
    />
  </View>
  <View style={styles.modalContent}>
    {filteredUserPoints.length > 0 ? (
      filteredUserPoints.map((punto, index) => (
        <TouchableOpacity
        key={index}
        onPress={() => toggleExpansion(index)}
        style={[styles.pointItemContainer, expandedIndex === index ? styles.expandedItem : styles.collapsedItem]}
      >
        <View style={styles.negocioInfoContainer}>

        <Image
        source={punto.avatar ? { uri: punto.avatar } : defaultAvatar}
        style={styles.negocioAvatarStyle}
      />

      
          <Text style={styles.negocioNombreStyle}>{punto.negocioNombre}</Text>
          {parseInt(punto.puntos) >= parseInt(punto.tipoBeneficioPersonalizado) && (
            <Image source={congratulationsImage} style={styles.congratulationsImage} />
          )}
        </View>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointItem}>{punto.puntos} puntos</Text>
          <Text style={styles.pointIteme}>{punto.emailNegocio}</Text>
        </View>
        {expandedIndex === index && (
          <View>
              
              <View style={styles.circlesContainer}>
              {checkSpecialBenefit(punto.puntos, punto.tipoBeneficioPersonalizado, punto.negocioNombre)}
              {renderCirclesForBusiness(punto.puntos, punto.tipoBeneficioPersonalizado)}
                
              </View>
              <Text style={styles.textoPromocionalStyle}>{punto.textoPromocional}</Text>
              <View style={styles.switchContainericonos}>
                <TouchableOpacity onPress={() => Linking.openURL(`mailto:${punto.emailNegocio}`)} style={styles.iconButton}>
                  <Ionicons name="mail-outline" size={24} color="#d9534f" />
                </TouchableOpacity>
                <TouchableOpacity onPress={async () => {
                    const url = punto.paginaWeb.startsWith('http://') || punto.paginaWeb.startsWith('https://') 
                        ? punto.paginaWeb 
                        : `http://${punto.paginaWeb}`;
                    const canOpen = await Linking.canOpenURL(url);
                    if (canOpen) {
                        Linking.openURL(url);
                    } else {
                        console.error('No se puede abrir la URL:', url);
                    }
                }} style={styles.iconButton}>
                  <Ionicons name="globe-outline" size={24} color="#5bc0de" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL(`tel:${punto.telefonoNegocio}`)} style={styles.iconButton}>
                  <Ionicons name="call-outline" size={24} color="#5cb85c" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(punto.direccionNegocio)}`)} style={styles.iconButton}>
                  <Ionicons name="map-outline" size={24} color="#f0ad4e" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </TouchableOpacity>
      ))
    ) : (
      <Text style={styles.noPointsText}>No se encontraron coincidencias.</Text>
    )}
  </View>
</Modalize>

<Modal
    animationType="slide"
    transparent={true}
    visible={isBenefitModalVisible}
    onRequestClose={() => setIsBenefitModalVisible(false)}
>
    <View style={styles.centeredView}>
        <View style={styles.modalView}>
            <Image source={congratulationsImage} style={styles.congratulationsImagemodal} />
            <Text style={styles.modalTitle}>¡Felicidades!</Text>
            <Text style={styles.modalMessage}>Has alcanzado {benefitInfo.points} puntos en {benefitInfo.businessName} y has desbloqueado un beneficio especial.</Text>
            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsBenefitModalVisible(false)}
            >
                <Text style={styles.closeButtonText}>Aceptar</Text>
            </TouchableOpacity>
        </View>
    </View>
</Modal>

        </>
      ) : (
<View style={{ justifyContent: 'center', alignItems: 'center' }}>
  <Text style={styles.greetingText}>¡Bienvenido!</Text>
  <Text style={styles.userInfoTextmail}>Inicia sesión para ver tu perfil</Text>

  <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.botonGradiente}>
    <Ionicons name="log-in-outline" size={58} color="white" />
    <Text style={styles.buttonTextStyle}>Login</Text>
  </TouchableOpacity>
</View>

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
      </LinearGradient>
      </ImageBackground>
  );
};


const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', // Establece el fondo como transparente
    padding: 20,

  },
  scrollViewStyle: {
    flex: 1, // Ocupa toda la pantalla
    justifyContent: 'center', // Esto centra sus hijos verticalmente
    alignItems: 'center', // Esto centra sus hijos horizontalmente
    
  },
  contentContainerStyle: {
    alignItems: 'center', // Centra los hijos horizontalmente
    justifyContent: 'start', // Alinea los hijos al inicio del ScrollView
    padding: 20, // Espacio alrededor de los hijos
  },
  userInfoContainer: {
    marginBottom: 20,
    backgroundColor: theme === 'dark' ? '#16142c9e' : '#ddddddcf',
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
    maxWidth: 350,
  },
  userInfoText: {
    fontSize: 20,
    marginBottom: 12,
    color: theme === 'dark' ? '#EEEEEE' : '#333',
    fontWeight: 'bold', // Agrega un poco de grosor al texto para mejorar la legibilidad
    padding: 20,
    marginLeft: -20,
    fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
  },
  userInfoTextmail: {
    fontSize: 16,
    color: theme === 'dark' ? '#18d8d8' : '#333',
    textAlign: 'center',
    marginBottom: 20,
   marginTop: -10,
  },

  changePasswordButtonTexto: {
    color: theme === 'dark' ? '#b8b8b8' : 'black',
    fontSize: 12,
    marginLeft: -25,
    marginTop: -30,

  },
  changePasswordButton: {
    backgroundColor: '#0000ff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginBottom: 20,
    flexDirection: 'row', // Esto alinea el icono y el texto en línea
    alignItems: 'center', // Esto centra verticalmente el icono y el texto
    justifyContent: 'center', // Esto centra el contenido del botón
    width: '50%', // Ajusta el ancho del botón según sea necesario
    justifyContent: 'center',
    alignItems: 'center',
    
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
    marginTop: 40,
  },

  changePasswordButtonText: {
    fontSize: 18,
    color: theme === 'dark' ? '#18d8d8' : '#067b7b',
    textAlign: 'center',
    fontWeight: 'bold', // Agrega un poco de grosor al texto para mejorar la legibilidad
    marginTop: 10,
  },
  changePasswordButtonTextLogout: {
    fontSize: 16,
    color: '#e91e6391',
    textAlign: 'center',
  },
  changePasswordButtonverpuntos: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginLeft: 8,
  },
  
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: theme === 'dark' ? '#cacddb' : '#cacddb',
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
    borderWidth: 2,
    borderColor: theme === 'dark' ? '#f0f0f0' : '#f0f0f0', // Añade un borde para resaltar la imagen del avatar
    marginTop: -20,
  },
  greetingText: {
    fontSize: 26,
    color: theme === 'dark' ? '#ffffff' : '#000000',
    marginBottom: 20, // Ajusta el margen según necesites
    fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
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
    fontSize: 26, // Tamaño de fuente grande para los puntos
    color: theme === 'dark' ? '#21cfbe' : '#067b7b',
    marginBottom: 5, // Espacio entre los puntos y el texto promocional
    marginLeft: 20, // Ajusta según necesites
    marginBottom: 30, // Espacio entre cada item de puntos
    textAlign: 'center', // Centra el texto de los puntos
    marginTop: -15, // Ajusta según necesites

  },
  pointIteme: {
    fontSize: 16, // Tamaño de fuente grande para los puntos
    color: theme === 'dark' ? '#ffffff' : '#067b7b',
    marginBottom: 5, // Espacio entre los puntos y el texto promocional
    marginLeft: 20, // Ajusta según necesites
    marginBottom: 30, // Espacio entre cada item de puntos
    textAlign: 'center', // Centra el texto de los puntos
    marginTop: -25, // Ajusta según necesites

  },
  emailnegocios: {
    fontSize: 15, // Tamaño de fuente grande para los puntos
    color: theme === 'dark' ? '#7c7c7c' : 'black',
    marginBottom: 30, // Espacio entre los puntos y el texto promocional
    marginLeft: 60, // Ajusta según necesites
    marginTop: -25, // Ajusta según necesites

  },

  textoPromocionalStyle: {
    fontSize: 14, // Ajusta según necesites
    color: 'gray', // O cualquier color que prefieras
    marginTop: -25, // Ajusta según necesites
    marginBottom: 20, // Espacio entre cada item de puntos
    marginLeft: 20, // Ajusta según necesites
    textAlign: 'center', // Centra el texto si no hay puntos
  },
  noPointsText: {
    textAlign: 'center', // Centrar el texto si no hay puntos
  },
  logoutButton: {
    position: 'absolute',
    top: 40, // Ajusta la distancia desde la parte superior
    right: 10, // Ajusta la distancia desde la izquierda
    padding: 10, // Añade un poco de padding para hacer más fácil tocar el icono

},  
backButton: {
  position: 'absolute',
  top: 43, // Ajusta la distancia desde la parte superior
  left: 10, // Ajusta la distancia desde la izquierda
  padding: 10, // Añade un poco de padding para hacer más fácil tocar el icono

},
switchContainer: {
  position: 'absolute',
  top: 52, // Ajusta según sea necesario para tu layout
  right: 10, // Ajusta según sea necesario para tu layout
  zIndex: 1, // Asegúrate de que el switch se muestre por encima de otros elementos si es necesario
},
pointItemContainer: {
  borderWidth: 1,
  borderColor: theme === 'dark' ? '#a1a1a1' : '#a1a1a1',
  padding: 15, // Espacio dentro del contenedor
  borderRadius: 10, // Bordes redondeados
  marginBottom: 15, // Espacio entre cada ítem de puntos
  minWidth: 320, // Ancho mínimo para el contenedor
  maxWidth: screenWidth * 0.8, // 80% del ancho de la pantalla
  alignSelf: 'center', // Esto centra el contenedor en la dirección cruzada (horizontalmente en este caso)
  marginTop: 10, // Espacio en la parte superior
},

animatedView: {
  width: 100,
  height: 80,
  backgroundColor: theme === 'dark' ? 'black' : 'black', // Cambia el color según el tema
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
  backgroundColor: theme === 'dark' ? '#24243e' : '#cacddb', // Cambia el fondo del modal según el tema
},


text: {
  color: theme === 'dark' ? 'white' : 'black', // Cambia el color del texto según el tema
},
actionButton: {
  backgroundColor: '#007BFF', // Color de fondo azul
  padding: 10, // Espaciado interno
  borderRadius: 5, // Bordes redondeados
  margin: 5, // Margen exterior
},

actionButtonText: {
  color: '#FFFFFF', // Texto blanco
  textAlign: 'center', // Alineación del texto
  fontWeight: 'bold', // Texto en negrita
},
iconButton: {
  // Aquí tus estilos, por ejemplo:
  marginHorizontal: 10,
  padding: 10,
  marginBottom: 40,

},
switchContainericonos: {
  flexDirection: 'row',
  alignItems: 'center', // Asegúrate de que los elementos estén alineados verticalmente.
  justifyContent: 'space-between', // Esto separa los elementos a ambos extremos.
  // Agrega otros estilos según sea necesario.
},
largerButtonStyle: {
  backgroundColor: '#0000ff', // Color de fondo
  paddingVertical: 20, // Aumenta el espaciado vertical interno
  paddingHorizontal: 40, // Aumenta el espaciado horizontal interno
  alignItems: 'center', // Centra verticalmente dentro del botón
  justifyContent: 'center', // Centra horizontalmente dentro del botón
  width: '80%', // Ancho del botón
  marginVertical: 15, // Margen vertical para separar los botones
  borderRadius: 10, // Bordes más redondeados
},
buttonTextStyle: {
  color: 'white', // Color del texto
  fontSize: 23, // Aumenta el tamaño del texto
  marginLeft: 10, // Espacio entre el icono y el texto
},
circle: {
  width: 30, // Ajusta según sea necesario
  height: 30, // Ajusta según sea necesario
  borderRadius: 15, // Esto hará el círculo perfecto
  backgroundColor: 'skyblue', // O cualquier color que prefieras
  justifyContent: 'center',
  alignItems: 'center',
  margin: 2,
},
circleText: {
  color: 'black', // Asegúrate de que el texto sea visible contra el fondo del círculo
},
circlesContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: -10,
  marginBottom: 50,
},
specialCircle: {
  width: 30,
  height: 30,
  borderRadius: 15,
  backgroundColor: 'gold', // Cambia esto al color que quieras para los círculos especiales
  justifyContent: 'center',
  alignItems: 'center',
  margin: 2,
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
  width: 250, // Asegura que el toque se detecte en todo el gradiente
},
textoBotonGradiente: {
  color: theme === 'dark' ? '#e7e7e7' : '#e7e7e7', // Texto blanco para tema oscuro, negro para tema claro
  fontSize: 18,
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},
searchContainer: {
  width: '100%', // O ajusta esto según el ancho que desees para tu contenedor de búsqueda
  padding: 10, // Ajusta esto según necesites para el espaciado interno
  alignItems: 'center', // Centra el TextInput horizontalmente si es menor que el ancho del contenedor
},
// Estilo para el campo de entrada de texto de búsqueda
searchInput: {
  height: 40, // Altura del campo de texto.
  borderRadius: 20, // Bordes redondeados.
  paddingHorizontal: 15, // Espaciado horizontal dentro del campo de texto.
  fontSize: 16, // Tamaño de la fuente.
  shadowColor: "#000", // Sombra para el campo, puedes omitirlo si no lo necesitas.
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5, // Elevación para Android para dar efecto de sombra.
  borderWidth: 1,
  borderColor: theme === 'dark' ? '#888' : '#333',
  marginTop:25,
  color: theme === 'dark' ? '#EEEEEE' : 'white',
  width: '60%', // 60% del ancho del contenedor
},
collapsedItem: {
  height: 100, // o la altura que desees para el ítem colapsado
  overflow: 'hidden', // Esto asegura que el contenido extra se corte
  borderWidth: 1,
  borderRadius: 20,
  borderColor: theme === 'dark' ? '#a1a1a1' : '#a1a1a1',
},
// Estilo para el ítem cuando está expandido
expandedItem: {
  height: 'auto', // Esto permite que el ítem expanda para ajustarse al contenido
  borderRadius: 0,
},
// Estilos para el contenedor de los detalles para controlar su visibilidad
detailContainer: {
  height: 'auto', // o puedes especificar una altura si quieres que tenga un límite
  overflow: 'hidden', // Asegura que el contenido no se desborde
  borderRadius: 0,
},
congratulationsImage: {
  width: 40, // Establece el ancho de tu imagen
  height: 40, // Establece la altura de tu imagen
  marginLeft: 10, // Ajusta según necesites
  marginTop: -10, // Ajusta según necesites

},
congratulationsImagemodal: {
  width: 90, // Establece el ancho de tu imagen
  height: 90, // Establece la altura de tu imagen
 marginBottom: 20, // Ajusta según necesites
},
modalTitle: {
  color: theme === 'dark' ? '#f44336' : '#f44336', // Texto blanco para tema oscuro, negro para tema claro
  fontSize: 26,
  marginBottom: 10,
  textAlign: 'center',
  fontWeight: 'bold'
},
modalMessage: {
  color: theme === 'dark' ? 'black' : 'black', // Texto blanco para tema oscuro, negro para tema claro
  fontSize: 16,
  marginBottom: 10,
  textAlign: 'center'
},
closeButtonText: {
  color: theme === 'dark' ? 'green' : 'green', // Texto blanco para tema oscuro, negro para tema claro
  fontSize: 18,
   marginTop:20,
  textAlign: 'center',

},
filledCircle: {
  width: 40, // Ajusta según tus necesidades
  height: 40, // Ajusta según tus necesidades
  borderRadius: 50, // La mitad de las dimensiones para hacerlo redondo
  backgroundColor: '#21cfbe', // El color de fondo para los círculos llenos
  justifyContent: 'center',
  alignItems: 'center',
  margin: 2, // Agrega un pequeño margen entre cada círculo
},

emptyCircle: {
  width: 40, // Ajusta según tus necesidades
  height: 40, // Ajusta según tus necesidades
  borderRadius: 50, // La mitad de las dimensiones para hacerlo redondo
  borderWidth: 2, // Define el ancho del borde
  borderColor: '#21cfbe', // El color del borde para los círculos vacíos
  justifyContent: 'center',
  alignItems: 'center',
  margin: 2, // Agrega un pequeño margen entre cada círculo
},
circleText: {
  color: 'white', // Cambia a blanco o cualquier otro color deseado
  fontSize: 15, // Ajusta al tamaño que necesites
  fontWeight: 'bold', // Ajusta la negrita si es necesario
},
qrContainer: {
  maxWidth: 160,
  fontSize: 15, // Ajusta al tamaño que necesites
  justifyContent: 'space-between',
  alignItems: 'center',

},
backgroundImage: {
  flex: 1,
  width: '100%',
  height: '100%',
},

});


export default UserProfile;