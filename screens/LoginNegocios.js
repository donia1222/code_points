import React, { useState, useEffect,useRef } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, TouchableOpacity, Image, Modal, ScrollView,KeyboardAvoidingView, Platform, Dimensions, ActivityIndicator, FlatList  } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from './ThemeContext'; // Importa useTheme de tu ThemeContext
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import headerImage from './maletin.png'; 
import LinearGradient from 'react-native-linear-gradient';
import { Modalize } from 'react-native-modalize';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import { LogBox } from 'react-native';
import { ImageBackground } from 'react-native';
import DatePicker from 'react-native-date-picker';
import TextoAnimado from '../screens/TextoAnimado'; // Asegúrate de que la ruta sea correcta
import Toast from 'react-native-toast-message';
import Purchases from 'react-native-purchases';

LogBox.ignoreLogs([
  "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.",
  "(ADVICE) View #9145 of type RCTView has a shadow set but cannot calculate shadow efficiently. Consider setting a background color to fix this, or apply the shadow to a more specific component.",
  "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.",
  "1 Location permission denied",
]);




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
  const gradientColors = theme === 'dark' ? ['#16142ced', '#322d6ded', '#24243e69'] : ['#fffbd5', '#8a96cbdb', '#8a96cb6b'];
  const [modalVisible, setModalVisible] = useState(false);
  const [compraParaPuntos, setCompraParaPuntos] = useState('');
  const [puntosOtorgados, setPuntosOtorgados] = useState('');
  const [beneficioPorPuntos, setBeneficioPorPuntos] = useState('');
  const [tipoBeneficio, setTipoBeneficio] = useState('descuento'); // 'descuento' o 'chequeRegalo'
  const modalizeRef = useRef(null);
  const modalizeRefis = useRef(null);
  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight * 0.95;
  const modalHeighe = screenHeight * 0.9;
  const modalHeighet = screenHeight * 0.9;
  const modalHeighetnegocio = screenHeight * 0.75;
  const [promoModalVisible, setPromoModalVisible] = useState(false); // En lugar de isModalOpened
  const [isSaving, setIsSaving] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [showEditValidationModal, setShowEditValidationModal] = useState(false);
const [editValidationMessage, setEditValidationMessage] = useState('');
const [searchTerm, setSearchTerm] = useState('');
const [filteredUserList, setFilteredUserList] = useState([]);
const [userList, setUserList] = useState([]);
const [monedaSeleccionada, setMonedaSeleccionada] = useState('CHF');
const [isCurrencyModalVisible, setIsCurrencyModalVisible] = useState(false);
const [availableCurrencies, setAvailableCurrencies] = useState(['CHF', 'EUR', 'USD', 'JPY', 'GBP', 'AUD', 'CAD', 'CNY', 'INR', 'BRL', 'RUB', 'MXN', 'ZAR', 'SGD', 'NZD']); // Añade o quita monedas según sea necesario
const [tipoBeneficioPersonalizado, setTipoBeneficioPersonalizado] = useState('');
const [puntosNecesariosParaRecompensa, setPuntosNecesariosParaRecompensa] = useState('');
const [menuModalVisible, setMenuModalVisible] = useState(false);
const [menus, setMenus] = useState([]);
const [menuDia, setMenuDia] = useState('');
const [menuFecha, setMenuFecha] = useState('');
const [menuDescripcion, setMenuDescripcion] = useState('');
const [menuPrecio, setMenuPrecio] = useState('');
const [isMenuModalVisible, setIsMenuModalVisible] = useState(false);
const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
const [selectedDate, setSelectedDate] = useState(new Date());
const [ismodalizeRefisnego, setIsmodalizeRefisnego] = useState(false);
const modalizeRefisnego = useRef(null);
const [isFirstLaunch, setIsFirstLaunch] = useState(null);
const [activeIcon, setActiveIcon] = useState(null);
const [isSubscribed, setIsSubscribed] = useState(false);
const [isLoading, setIsLoading] = useState(true);



useEffect(() => {
  const initializePurchases = async () => {
    try {
      await Purchases.setDebugLogsEnabled(true);
      await Purchases.configure({ apiKey: 'appl_jeRcGcmSqhNLqVVsEgvUYbAFjFn' });

      const customerInfo = await Purchases.getCustomerInfo();
      console.log('Información del cliente:', customerInfo);

      if (customerInfo.entitlements.active['1661']) {
        console.log('Usuario ya suscrito');
        setIsSubscribed(true);
      } else {
        console.log('Usuario no suscrito');
        setIsSubscribed(false);
      }
    } catch (error) {
      console.log('Error al obtener la información del comprador:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomerInfoUpdate = (info) => {
    console.log('Información del cliente actualizada:', info);
    if (info.entitlements.active['1661']) {
      console.log('Usuario ya suscrito');
      setIsSubscribed(true);
    } else {
      console.log('Usuario no suscrito');
      setIsSubscribed(false);
    }
  };

  Purchases.addCustomerInfoUpdateListener(handleCustomerInfoUpdate);

  initializePurchases();


  return () => {
    Purchases.removeCustomerInfoUpdateListener(handleCustomerInfoUpdate);
  };
}, []);




useEffect(() => {
  AsyncStorage.getItem('alreadyLaunched').then(value => {
    if (value == null) {
      AsyncStorage.setItem('alreadyLaunched', 'false');
      setIsFirstLaunch(true);
    } else {
      setIsFirstLaunch(false);
    }
  });
}, []);

const handlePressInfo = () => {
  navigation.navigate('InfoNegocio');
};

const openmodalizeRefisnego = () => {
  setIsmodalizeRefisnego (true);
};

const closemodalizeRefisnego = () => {
  setIsmodalizeRefisnego (false);
};


useEffect(() => {
  if (modalizeRefisnego.current) {
    if (ismodalizeRefisnego) {
      modalizeRefisnego.current.open();
    } else {
      modalizeRefisnego.current.close();
    }
  }
}, [ismodalizeRefisnego]);



const pointsModalizeRef = useRef(null);

const showDatePicker = () => {
  setSelectedDate(new Date()); // Establece la fecha actual cada vez que se abre el selector
  setDatePickerVisibility(true);
};


const hideDatePicker = () => {
  setDatePickerVisibility(false);
};

const handleConfirm = (date) => {
  const formattedDate = date.toISOString().split('T')[0];
  setSelectedDate(date); // Actualiza la fecha seleccionada
  setMenuFecha(formattedDate); // Asegúrate de que la fecha se formatee correctamente
  hideDatePicker(); // Cierra el DatePicker
};


const closeMenusModal = () => {
  setIsMenuModalVisible(false);
};


useEffect(() => {
  if (modalizeRefis.current) {
    if (isMenuModalVisible) {
      modalizeRefis.current.open();
    } else {
      modalizeRefis.current.close();
    }
  }
}, [isMenuModalVisible]);

useEffect(() => {
  if (pointsModalizeRef.current) {
    if (promoModalVisible) {
      pointsModalizeRef.current.open();
    } else {
      pointsModalizeRef.current.close();
    }
  }
}, [promoModalVisible]);



const fetchMenus = async () => {
  try {
      // Asegúrate de que 'email' contiene el correo electrónico del negocio
      const response = await axios.get(`https://mycode.lweb.ch/negocios/obtener_menus_negocio.php?email_negocio=${email}`);
      if (response.data) {
          setMenus(response.data);
      } else {
          throw new Error('No se pudieron cargar los menús');
      }
  } catch (error) {
      console.error('Error al cargar los menús:', error);
      Alert.alert('Error', 'Ocurrió un error al cargar los menús.');
  }
};

const openMenuModal = () => {
  setMenuModalVisible(true);
  fetchMenus(); // Llama a la función para cargar los menús del negocio
};

const closeMenuModal = () => {
  setMenuModalVisible(false);
  // Opcionalmente, limpiar los campos cuando se cierra el modal
  setMenuDia('');
  setMenuFecha('');
  setMenuDescripcion('');
  setMenuPrecio('');
};

const submitMenu = async () => {
  try {
    // Asegúrate de que la fecha esté en el formato correcto antes de enviarla
    // Si menuFecha no está establecido, utiliza la fecha actual
    const formattedDate = menuFecha ? menuFecha : new Date().toISOString().split('T')[0];

    // Datos del menú que serán enviados
    const menuData = {
      negocioEmail: email, // Asegúrate de que este estado contenga el email del negocio
      nombreNegocio: nombre, // Asegúrate de que este estado contenga el nombre del negocio
      direccionNegocio: direccion, // Asegúrate de que este estado contenga la dirección del negocio
      promocionNegocio: textoPromocional, // Asegúrate de que este estado contenga la promoción del negocio
      telefonoNegocio: telefono, // Asegúrate de que este estado contenga el teléfono del negocio
      webNegocio: paginaWeb, // Asegúrate de que este estado contenga la página web del negocio
      imagenUrl: avatar,
      dia: menuDia,
      fecha: formattedDate, // Usamos la fecha formateada
      menu: menuDescripcion,
      precio: menuPrecio
    };

    console.log(JSON.stringify(menuData)); // Diagnóstico
    const response = await axios.post('https://mycode.lweb.ch/negocios/anadir_menu.php', JSON.stringify(menuData), {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.data.message) {
      fetchMenus(); // Vuelve a cargar los menús después de añadir uno nuevo
      setIsMenuModalVisible(true);
      setMenuDia('');
      setMenuFecha('');
      setMenuDescripcion('');
      setMenuPrecio('');
    } else {
        throw new Error(response.data.error || 'Error al añadir el menú');
    }
  } catch (error) {
    console.error('Error al añadir el menú:', error);
    Alert.alert('Error', 'Ocurrió un error al añadir el menú.');
  }
};



const deleteMenu = async (idMenu) => {
  try {
      const response = await axios.post('https://mycode.lweb.ch/negocios/eliminar_menu.php', JSON.stringify({ id_menu: idMenu }), {
          headers: {
              'Content-Type': 'application/json'
          }
      });
      if (response.data.message) {
          setMenus(menus.filter(menu => menu.id !== idMenu));
      } else {
          throw new Error(response.data.error || 'Error al eliminar el menú');
      }
  } catch (error) {
      console.error('Error al eliminar el menú:', error);
      Alert.alert('Error', 'Ocurrió un error al eliminar el menú.');
  }
};

const openMenuSModal = () => {
  if (menus.length > 0) {
    setIsMenuModalVisible(true);
  } else {
    Toast.show({
      type: 'info',
      position: 'top', // Asegura que el mensaje se muestra en la parte superior
      text1: 'Aviso',
      text2: 'No hay menús disponibles para mostrar.',
      visibilityTime: 2000, // El mensaje se muestra por 2 segundos
      autoHide: true,
      text1Style: { fontSize: 14 }, // Estilo personalizado para text1
      text2Style: { fontSize: 14 }, // Estilo personalizado para text2
    });
  }
};

const openCurrencyModal = () => {
  setIsCurrencyModalVisible(true);
};

const closeCurrencyModal = () => {
  setIsCurrencyModalVisible(false);
};

const selectCurrency = (currency) => {
  setMonedaSeleccionada(currency);
  closeCurrencyModal();
};



const fetchUsers = async () => {
  try {
    const response = await axios.get('https://mycode.lweb.ch/negocios/obtener_usuarios_negocio.php', {
      params: {
        negocioEmail: email, // Asegúrate de que 'email' contenga el correo electrónico del negocio
      },
    });
    if (response.data.usuarios) {
      setUserList(response.data.usuarios);
    }
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    alert('Ocurrió un error al obtener los usuarios');
  }
};

useEffect(() => {
  const results = userList.filter(user =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) // Agrega esta línea para filtrar también por email
  );
  setFilteredUserList(results);
}, [searchTerm, userList]);


  useEffect(() => {
    const cargarCredenciales = async () => {
      const emailGuardado = await AsyncStorage.getItem('ultimoEmailRegistrado');
      const contraseñaGuardada = await AsyncStorage.getItem('ultimaContraseñaRegistrada');
      if (emailGuardado && contraseñaGuardada) {
        setEmail(emailGuardado);
        setContraseña(contraseñaGuardada);
      }
    };
  
    cargarCredenciales();
  }, []);


  
  useEffect(() => {
    leerDatosAlmacenados();
  }, []);




  useEffect(() => {
    if (modalizeRef.current) {
      if (promoModalVisible) {
        modalizeRef.current.open();
      } else {
        modalizeRef.current.close();
      }
    }
  }, [promoModalVisible]);


  useEffect(() => {
    if (pointsModalizeRef.current) {
      if (promoModalVisible) {
        pointsModalizeRef.current.open();
      } else {
        pointsModalizeRef.current.close();
      }
    }
  }, [promoModalVisible]);


  
  const openModal = () => {
    setPromoModalVisible(true);

  };
  
  const closeModal = () => {
    setPromoModalVisible(false);
  };

  const openPointsModal = () => {
    if (pointsModalizeRef.current) {
      pointsModalizeRef.current.open();
      setPromoModalVisible(true);
    }
  };


  

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
            setPuntos(''); // Limpia el campo de puntos inmediatamente después de la respuesta exitosa
            // Esperar 1 segundo antes de ocultar los datos del usuario
            setTimeout(() => {
                setShowUserData(false); 
            }, 5000); 
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
    const response = await axios.get(`https://mycode.lweb.ch/obtener_qr.php?qrCodeIdentifier=${encodeURIComponent(qrCodeIdentifier)}`);
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
        quality: 1, // Establece la calidad inicial de la imagen; considera reducirla si necesitas imágenes más pequeñas
        base64: false, // Cambiado a falso ya que vamos a redimensionar antes de convertir a base64
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
        const originalUri = result.assets[0].uri; // URI de la imagen original
        const newWidth = 300; // Ancho deseado para la nueva imagen
        const newHeight = 300; // Alto deseado para la nueva imagen
        const compressFormat = 'JPEG'; // Formato de compresión de la nueva imagen
        const quality = 75; // Calidad de la nueva imagen

        ImageResizer.createResizedImage(originalUri, newWidth, newHeight, compressFormat, quality, 0)
            .then(async ({ uri }) => {
                // Redimensionamiento correcto, convertir a base64 si es necesario
                const response = await fetch(uri);
                const blob = await response.blob();
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64data = reader.result;
                    setAvatar(base64data); // Establece el avatar con la nueva imagen redimensionada en base64
                    AsyncStorage.setItem('@avatar', base64data); // Guarda el avatar en AsyncStorage
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


const leerDatosAlmacenados = async () => {
  try {
      // Comprobar si la sesión está activa
      const sesionActiva = await AsyncStorage.getItem('@sesionActiva');
      if (sesionActiva === 'true') {
          setLogueado(true);
          // Leer datos existentes
          const emailAlmacenado = await AsyncStorage.getItem('@email');
          const datosUsuarioAlmacenados = await AsyncStorage.getItem('@datosUsuario');
          const avatarAlmacenado = await AsyncStorage.getItem('@avatar');

          // Establecer estados con datos leídos
          if (emailAlmacenado !== null) setEmail(emailAlmacenado);
          if (datosUsuarioAlmacenados !== null) {
              const datosUsuario = JSON.parse(datosUsuarioAlmacenados);
              setDatosUsuario(datosUsuario);
              // Actualiza aquí los estados con los datos personales del usuario
              setNombre(datosUsuario.nombre || '');
              setDireccion(datosUsuario.direccion || '');
              setTelefono(datosUsuario.telefono || '');
              setPaginaWeb(datosUsuario.pagina_web || '');
              setTextoPromocional(datosUsuario.texto_promocional || '');
          }
          if (avatarAlmacenado) setAvatar(avatarAlmacenado);
      } else {
          // Si la sesión no está activa, pre-cargar el email pero no marcar como logueado
          const emailAlmacenado = await AsyncStorage.getItem('@email');
          if (emailAlmacenado !== null) setEmail(emailAlmacenado);
          setLogueado(false);
      }

      // Leer datos de la promoción independientemente del estado de sesión
      const compraParaPuntosAlmacenados = await AsyncStorage.getItem('@compraParaPuntos');
      const puntosOtorgadosAlmacenados = await AsyncStorage.getItem('@puntosOtorgados');
      const beneficioPorPuntosAlmacenados = await AsyncStorage.getItem('@beneficioPorPuntos');
      const puntosNecesariosParaRecompensa = await AsyncStorage.getItem('@puntosNecesariosParaRecompensa');
      const tipoBeneficioAlmacenado = await AsyncStorage.getItem('@tipoBeneficio');
      const tipoBeneficioPersonalizado = await AsyncStorage.getItem('@tipoBeneficioPersonalizado');


      // Establecer estados de la promoción con datos leídos
      if (compraParaPuntosAlmacenados !== null) setCompraParaPuntos(compraParaPuntosAlmacenados);
      if (puntosOtorgadosAlmacenados !== null) setPuntosOtorgados(puntosOtorgadosAlmacenados);
      if (beneficioPorPuntosAlmacenados !== null) setBeneficioPorPuntos(beneficioPorPuntosAlmacenados);
      if (puntosNecesariosParaRecompensa !== null) setPuntosNecesariosParaRecompensa (puntosNecesariosParaRecompensa);
      if (tipoBeneficioAlmacenado !== null) setTipoBeneficio(tipoBeneficioAlmacenado);
      if (tipoBeneficioPersonalizado !== null) setTipoBeneficioPersonalizado(tipoBeneficioPersonalizado);

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
          // Guardar la bandera de sesión activa y el email
          await AsyncStorage.setItem('@sesionActiva', 'true');
          await AsyncStorage.setItem('@email', email);

          // Obtener y guardar los datos del usuario
          obtenerDatosUsuario(email);
          editarDatos(); // Llama primero a la función editarDatos
          
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
        // Aquí, guardar los datos del usuario recibidos en AsyncStorage
        const datosUsuario = response.data.datos_usuario; // Suponiendo que esta es la estructura de la respuesta
        await AsyncStorage.setItem('@datosUsuario', JSON.stringify(datosUsuario));
  
        // Actualizar el estado local con los datos del usuario
        setDatosUsuario(datosUsuario);
        setLogueado(true); // Establece el estado a true para reflejar que el usuario está logueado
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
      if (!nombre.trim() || !direccion.trim() || !telefono.trim() || !paginaWeb.trim()) {
        setEditValidationMessage('Debes rellenar todos los campos (nombre, dirección, teléfono, página web) antes de guardar.');
        setShowEditValidationModal(true);
        return;
      }
    
      if (!email) {
        setEditValidationMessage('La información del usuario no está completa.');
        setShowEditValidationModal(true);
        return;
      }
    
      setIsSaving(true);
      try {
        const response = await axios.post('https://mycode.lweb.ch/negocios/editar_usuario.php', {
          email: email,
          nombre: nombre,
          direccion: direccion,
          telefono: telefono,
          pagina_web: paginaWeb,
          texto_promocional: textoPromocional,
          avatar,
          tipoBeneficioPersonalizado: puntosNecesariosParaRecompensa,
          
        });
    
        if (response.data.message === 'Datos actualizados con éxito') {
          setIsSaving(false);
          const nuevosDatosUsuario = {
            ...datosUsuario,
            nombre: nombre,
            direccion: direccion,
            telefono: telefono,
            pagina_web: paginaWeb,
            texto_promocional: textoPromocional,
            avatar,
            tipoBeneficioPersonalizado: puntosNecesariosParaRecompensa,
          };
          setDatosUsuario(nuevosDatosUsuario);
          await AsyncStorage.setItem('@datosUsuario', JSON.stringify(nuevosDatosUsuario));
          setEditando(false);
        } else {
          setIsSaving(false);
          setEditValidationMessage(response.data.error);
          setShowEditValidationModal(true);
        }
      } catch (error) {
        setIsSaving(false);
        console.log(error);
        setEditValidationMessage('Ocurrió un error al actualizar los datos');
        setShowEditValidationModal(true);
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
    setModalVisible(false); // Cierra el modal al finalizar
};

const cerrarSesion = async () => {
  try {
    // Actualiza el estado de sesión a inactivo en lugar de eliminar el email
    await AsyncStorage.setItem('@sesionActiva', 'false');
    await AsyncStorage.removeItem('@email');
    // await AsyncStorage.removeItem('@email');
    await AsyncStorage.removeItem('@datosUsuario'); // Continúa eliminando otros datos de usuario por seguridad
    
    // Actualizar el estado en la aplicación
    setLogueado(false);
    setDatosUsuario(null);
    // No resetear el email aquí para mantenerlo en el input
    // setEmail('');
    setContraseña(''); // Siempre limpia la contraseña por cuestiones de seguridad

    // Opcional: si decides resetear el avatar o mantenerlo según tu flujo de usuario
    // setAvatar('');
  } catch (error) {
    console.log('Error al limpiar los datos de sesión', error);
    Alert.alert('Error', 'Ocurrió un error al cerrar sesión');
  }
};

const guardarPromocion = async () => {
  if (!compraParaPuntos.trim() || !puntosOtorgados.trim() || !puntosNecesariosParaRecompensa.trim() || (!beneficioPorPuntos.trim() && tipoBeneficio !== 'personalizado') || (tipoBeneficio === 'personalizado' && !tipoBeneficioPersonalizado.trim())) {
      setValidationMessage('Debes rellenar todos los campos antes de cerrar.');
      setShowValidationModal(true);
  } else {
      let promocion;
      if (tipoBeneficio === 'descuento') {
          promocion = `A partir de ${compraParaPuntos} ${monedaSeleccionada} obtienes ${puntosOtorgados} puntos. Con ${puntosNecesariosParaRecompensa} puntos obtienes un ${beneficioPorPuntos}% de descuento.`;
      } else if (tipoBeneficio === 'chequeRegalo') {
          promocion = `A partir de ${compraParaPuntos} ${monedaSeleccionada} obtienes ${puntosOtorgados} puntos. Con ${puntosNecesariosParaRecompensa} puntos obtienes un cheque regalo de ${beneficioPorPuntos} ${monedaSeleccionada}.`;
      } else if (tipoBeneficio === 'personalizado') {
          promocion = `A partir de ${compraParaPuntos} ${monedaSeleccionada} obtienes ${puntosOtorgados} puntos. Con ${puntosNecesariosParaRecompensa} puntos obtienes ${tipoBeneficioPersonalizado}.`;
      }

      setTextoPromocional(promocion);
      await AsyncStorage.setItem('@compraParaPuntos', compraParaPuntos);
      await AsyncStorage.setItem('@puntosOtorgados', puntosOtorgados);
      await AsyncStorage.setItem('@puntosNecesariosParaRecompensa', puntosNecesariosParaRecompensa); // Nuevo valor almacenado
      await AsyncStorage.setItem('@beneficioPorPuntos', beneficioPorPuntos);
      await AsyncStorage.setItem('@tipoBeneficio', tipoBeneficio);
      await AsyncStorage.setItem('@tipoBeneficioPersonalizado', tipoBeneficioPersonalizado);
      await AsyncStorage.setItem('@monedaSeleccionada', monedaSeleccionada);

      setPromoModalVisible(false);
  }
};


    const registrarUsuario = () => {
      navigation.navigate('NegociosRegistro');
  };


const homescreen = () => {
  navigation.navigate('HomeScreen');
};


  const scaner = () => {
    setScanned(false); // Restablece el estado de scanned a false
    setShowCamera(true); // Muestra la cámara
  };
  const handlePress = () => {
    editarDatos(); // Llama primero a la función editarDatos
    setPromoModalVisible(true); // Luego establece el estado para mostrar el modal
};
const formatDate = (date) => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() devuelve un índice basado en cero, por lo tanto se suma 1.
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

    return (
      <ImageBackground
      source={require('../assets/imagenes/dinner.png')} // Cambia esto por tu imagen de fondo
      resizeMode="cover" // Esto es para que la imagen cubra todo el fondo
      style={styles.backgroundImage}
    >

      <LinearGradient
      colors={gradientColors}
      style={styles.container}
    >
{isFirstLaunch && (
  <Modal
    transparent={true}
    animationType="slide"
    visible={isFirstLaunch}
  >
    <View style={styles.modalBackground}>
      <View style={styles.modalContente}>
        <View style={styles.modalHeadere}>
          <Text style={styles.modalHeaderText}>¿Quieres saber cómo funciona la App?</Text>
        </View>
        <Text style={styles.modalBodyText}>
          ¡Explora todas las posibilidades! Con nuestra app puedes:
          {"\n\n"}- Publicar el menú del día de tu restaurante para que todos lo vean.
          {"\n"}- Escanear códigos QR de tus clientes para otorgarles puntos de fidelidad.
          {"\n"}- Editar la información de tu restaurante para mantener a tus clientes siempre actualizados.
          {"\n"}Y mucho más... 
          {"\n"}¡Descubre cómo aprovechar al máximo tu negocio!
        </Text>
        <TouchableOpacity onPress={() => {
            handlePressInfo();
            setIsFirstLaunch(false);
          }} style={styles.modalButton}>
          <Text style={styles.modalButtonText}>Ver cómo funciona</Text>
        </TouchableOpacity>
<TouchableOpacity onPress={() => setIsFirstLaunch(false)} style={styles.iconCloseButton}>
  <Ionicons name="close-circle" size={36} color="grey" />
</TouchableOpacity>

      </View>
    </View>
  </Modal>
)}

<Toast />


      <Modal visible={menuModalVisible} animationType="slide" onRequestClose={closeMenuModal}>
      <ImageBackground
      source={require('../assets/imagenes/dinner.png')} // Cambia esto por tu imagen de fondo
      resizeMode="cover" // Esto es para que la imagen cubra todo el fondo
      style={styles.backgroundImage}
    >


      <LinearGradient
                            colors={theme === 'dark' ? ['#2c3e50', '#3d3d3d94'] : ['#d9e2e1', '#bcbcbc40']} // Gradiente ajustado según el tema
                            style={styles.gradientBackground}>
      <TouchableOpacity onPress={closeMenuModal} style={styles.iconButtonmodal}>
      <Ionicons name="close-outline" size={32} color={theme === 'dark' ? '#EEEEEE' : '#333'} />
    </TouchableOpacity>
    <View style={styles.modalView}>
      
    <View style={styles.iconContainer}>

  </View>
  <View style={styles.buttonContent}>
<TextoAnimado/>
  </View>

    <TextInput 
    style={styles.inputMenus}
    value={formatDate(selectedDate)}
    onTouchStart={showDatePicker} // Abre el DatePicker cuando el usuario toque este campo.
    placeholder="Elige una fecha"
    placeholderTextColor={theme === 'dark' ? '#EEEEEE' : '#888'} // Ajusta los colores según necesites
    editable={false} // Hace que el campo no sea editable.
/>

{isDatePickerVisible && (
    <DatePicker
        date={selectedDate}
        onDateChange={handleConfirm}
        mode="date"
        minimumDate={new Date()} // Esto evita que se puedan elegir fechas anteriores a la actual
    />
)}

              <TextInput 
            style={styles.inputMenus}
            value={menuDia} 
            onChangeText={setMenuDia} 
            placeholder="Nombre del menú" 
            placeholderTextColor={theme === 'dark' ? '#888' : '#888'} // Ajusta los colores según necesites
        />

         <TextInput 
                    style={[styles.inputMenus, {height: Math.max(85, menuDescripcion.split('\n').length * 0)}]}
                    value={menuDescripcion} 
                    onChangeText={setMenuDescripcion} 
                    placeholder="Descripción del menú" 
                    multiline={true}
                    placeholderTextColor={theme === 'dark' ? '#888' : '#888'} // Ajusta los colores según necesites
                />
                       <TextInput 
            style={styles.inputMenus}
            value={menuPrecio} 
            onChangeText={setMenuPrecio} 
            placeholder="Precio" 
            placeholderTextColor={theme === 'dark' ? '#888' : '#888'} // Ajusta los colores según necesites
        />

<Toast />

<TouchableOpacity onPress={() => {
    setActiveIcon('add-circle-outline');
    submitMenu();
}} style={[styles.buttonCustom, activeIcon === 'add-circle-outline' ? styles.activeButton : {}]}>
    <Ionicons name={activeIcon === 'add-circle-outline' ? "add-circle-outline" : "add-circle-outline"} size={31} color={theme === 'dark' ? 'white' : 'white'}/>
    <Text style={styles.buttonTextmenus}>Añadir Menu</Text> 
</TouchableOpacity>

    </View>

    <TouchableOpacity style={styles.scanButtones}  onPress={openMenuSModal}>
        <Text style={styles.scanButtonText}>Ver mis Menús</Text>
      </TouchableOpacity>


      <Modalize
      ref={modalizeRefis}
      modalHeight={modalHeighet} // Asegúrate de que esta variable tenga el valor correcto
        onClose={closeMenusModal }
        open={isMenuModalVisible}
        handleIndicatorStyle={theme === 'dark' ? { backgroundColor: '#333' } : { backgroundColor: '#bad9d6' }}
        modalStyle={theme === 'dark' ? { backgroundColor: '#333' } : { backgroundColor: '#bad9d6' }}
      >
              <LinearGradient
                            colors={theme === 'dark' ? ['#2c3e50', '#3d3d3d'] : ['#bad9d6', '#cacddb']} // Gradiente ajustado según el tema
                            style={styles.gradientBackground}>
    <FlatList
    data={menus}
    renderItem={({ item }) => (
        <View style={styles.menuItem}>
            <Text style={styles.menuText}>Fecha: {item.fecha}</Text>
            <Text style={styles.menuText}>Titulo: {item.dia}</Text>
            <Text style={styles.menuText}>Descripción: {item.menu}</Text>
            <Text style={styles.menuText}>Precio: {item.precio}</Text>
            <Ionicons 
                name="trash-bin-outline" 
                size={24} 
                color="red" 
                onPress={() => deleteMenu(item.id)} // Asegúrate de que tus ítems de menú tienen un 'id' único
            />
        </View>
    )}
    keyExtractor={(item, index) => String(index)}
/>
</LinearGradient>
</Modalize>


</LinearGradient>
</ImageBackground>
</Modal>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
    >

          {!logueado ? (
              <>
                     <ScrollView contentContainerStyle={styles.scrollViewContainer}>
               <Text style={styles.modalTextheader}>Bussines Login</Text>
               <Image
          source={headerImage} // Usando la imagen importada
          style={styles.headerImage}
        />
                  <TextInput
                      placeholder="Email"
                      placeholderTextColor={theme === 'dark' ? '#888' : '#888'} // Ajusta los colores según necesites
                      value={email}
                      onChangeText={setEmail}
                      style={styles.input}
                  />
                  <TextInput
                      placeholder="Contraseña"
                      placeholderTextColor={theme === 'dark' ? '#888' : '#888'} // Ajusta los colores según necesites
                      value={contraseña}
                      onChangeText={setContraseña}
                      secureTextEntry
                      style={styles.input}
                  />
                  
<LinearGradient
  colors={theme === 'dark' ? ['#009688', '#24243e'] : ['#009688', '#858585']} // Gradientes para tema oscuro y claro
  start={{x: 0, y: 0}}
  end={{x: 1, y: 0}}
  style={styles.botonGradiente}
>
  <TouchableOpacity onPress={iniciarSesion}  style={styles.botonTransparente}>
    <Text style={styles.textoBotonGradiente}>login Negocio</Text>
  </TouchableOpacity>
</LinearGradient>




<TouchableOpacity onPress={registrarUsuario} style={styles.buttonnores}>
  <Text style={styles.buttonTextloginnores}>¿No estás registrado? Regístrate aquí</Text>
</TouchableOpacity>

</ScrollView>

              </>
          ) : (
              <>
                  {editando ? (
                      <>
<>
</>


<ScrollView 
    contentContainerStyle={styles.scrollViewModal}
    scrollEnabled={!promoModalVisible}  // Desactiva el scroll cuando el modal está abierto
>
  
            <TouchableOpacity onPress={pickImage} style={styles.avatarContainere}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatarStyle} />
              ) : (
                <Image source={require('../assets/imagenes/headerImage.png')} style={styles.avatarStyle} />
              )}
            </TouchableOpacity>
            {
    !promoModalVisible && (
        <View style={styles.closeIconContainer}>
            {isSaving ? (
                <ActivityIndicator size="small" color={theme === 'dark' ? '#EEEEEE' : '#333'} />
            ) : (
                <Ionicons 
                    name="close" 
                    size={30} 
                    color={theme === 'dark' ? '#EEEEEE' : '#333'} 
                    onPress={guardarEdicion}
                />
            )}
        </View>
    )
}
<TouchableOpacity onPress={pickImage} style={styles.buttonimagen}>
<Ionicons name="camera-outline" size={24} color="black" />
        <Text style={styles.text}>Editar imagen</Text>
            </TouchableOpacity>
            
                          <TextInput
                              placeholder="Nombre"
                              value={nombre}
                              onChangeText={setNombre}
                              placeholderTextColor={theme === 'dark' ? '#888' : '#888'} // Ajusta los colores según necesites
                              style={styles.input}
                          />
                          <TextInput
                              placeholder="Dirección"
                              value={direccion}
                              onChangeText={setDireccion}
                              placeholderTextColor={theme === 'dark' ? '#888' : '#888'} // Ajusta los colores según necesites
                              style={styles.input}
                          />
                          <TextInput
                              placeholder="Teléfono"
                              value={telefono}
                              onChangeText={setTelefono}
                              placeholderTextColor={theme === 'dark' ? '#888' : '#888'} // Ajusta los colores según necesites
                              style={styles.input}
                          />
                          <TextInput
                              placeholder="Página Web"
                              placeholderTextColor={theme === 'dark' ? '#888' : '#888'} // Ajusta los colores según necesites
                              value={paginaWeb}
                              onChangeText={setPaginaWeb}
                              style={styles.input}
                          />

    <TouchableOpacity onPress={openModal} style={styles.fakeInput}>
  <Text style={styles.inputText}>{textoPromocional || "Ejemplo: 100 puntos = 50 CHF"}</Text>
</TouchableOpacity>

  <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.buttoncintrasena}>
    <Text style={styles.buttonTextcontrasena}>Cambiar Contraseña</Text>
</TouchableOpacity>
</ScrollView>


<Modalize
    ref={modalizeRef}
    modalHeight={modalHeight}
    modalStyle={styles.modalContainer}
    overlayStyle={styles.overlay}
    handleStyle={styles.handle}
    onClosed={() => {
        guardarPromocion(); // Guarda la promoción cuando el modal se cierra.
        closeModal(); // Asegúrate de que esta función restablezca correctamente el estado de la UI si es necesario.
    }}
>

    <Text style={styles.editarpromocion}>Configurar Promoción</Text>
    <TouchableOpacity onPress={openCurrencyModal} style={styles.currencyPickerButton}>
    <Text style={styles.currencyPickerButtonText}>{monedaSeleccionada}</Text>
</TouchableOpacity>


<Modal
    animationType="slide"
    transparent={true}
    visible={isCurrencyModalVisible}
    onRequestClose={closeCurrencyModal}
>
    <View style={styles.modalViewu}>
        <FlatList
            data={availableCurrencies}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => selectCurrency(item)} style={styles.currencyItem}>
                    <Text style={styles.currencyText}>{item}</Text>
                </TouchableOpacity>
            )}
        />
    </View>
</Modal>

    <View>
        <Text style={styles.inputLabel}>Compra mínima para obtener puntos</Text>
        <TextInput
    placeholder={`Introduce un valor (${monedaSeleccionada})`}
    placeholderTextColor={theme === 'dark' ? '#888' : '#888'}
    value={compraParaPuntos}
    keyboardType="numeric"
    onChangeText={setCompraParaPuntos}
    style={styles.input}
/>
    </View>

    <View>
        <Text style={styles.inputLabel}>Puntos otorgados</Text>
        <TextInput
            placeholder="Introduce un valor"
            placeholderTextColor={theme === 'dark' ? '#888' : '#888'}
            value={puntosOtorgados}
            keyboardType="numeric"
            onChangeText={setPuntosOtorgados}
            style={styles.input}
        />
    </View>
    <View>
    <Text style={styles.inputLabel}>Puntos necesarios para la recompensa</Text>
    <TextInput
        placeholder="Introduce un valor"
        placeholderTextColor={theme === 'dark' ? '#888' : '#888'}
        value={puntosNecesariosParaRecompensa} // Asume que este es el nuevo estado que has creado
        keyboardType="numeric"
        onChangeText={setPuntosNecesariosParaRecompensa} // Asume que esta es la nueva función que has creado para manejar el cambio
        style={styles.input}
    />
</View>

    

    <ScrollView
    horizontal={true}
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.selectorContainer} // Aplica estilos aquí para alinear los botones como desees
>
    <TouchableOpacity 
        style={tipoBeneficio === 'descuento' ? styles.selectedButton : styles.buttoncer}
        onPress={() => setTipoBeneficio('descuento')}
    >
        <Text style={tipoBeneficio === 'descuento' ? styles.selectedButtonText : styles.buttonText}>Descuento</Text>
    </TouchableOpacity>
    <TouchableOpacity 
        style={tipoBeneficio === 'chequeRegalo' ? styles.selectedButton : styles.buttoncer}
        onPress={() => setTipoBeneficio('chequeRegalo')}
    >
        <Text style={tipoBeneficio === 'chequeRegalo' ? styles.selectedButtonText : styles.buttonText}>Cheque Regalo</Text>
    </TouchableOpacity>
    <TouchableOpacity 
        style={tipoBeneficio === 'personalizado' ? styles.selectedButton : styles.buttoncer}
        onPress={() => setTipoBeneficio('personalizado')}
    >
        <Text style={tipoBeneficio === 'personalizado' ? styles.selectedButtonText : styles.buttonText}>Personalizado</Text>
    </TouchableOpacity>
    {/* Puedes añadir más botones aquí si lo necesitas */}
</ScrollView>


<Text style={styles.inputLabel}>
    {tipoBeneficio === 'descuento' ? 'Descuento ofrecido (%)' : tipoBeneficio === 'chequeRegalo' ? `Valor del cheque regalo en (${monedaSeleccionada})` : "Describe el beneficio personalizado"}
</Text>
{tipoBeneficio === 'personalizado' ? 
    (<TextInput
        placeholder="Ejemplo: Un café gratis"
        value={tipoBeneficioPersonalizado}
        onChangeText={setTipoBeneficioPersonalizado}
        style={styles.input}
    />) : 
    (<TextInput
        placeholder={tipoBeneficio === 'descuento' ? "Ejemplo: 20%" : "Ejemplo: valor"}
        value={beneficioPorPuntos}
        placeholderTextColor={theme === 'dark' ? '#888' : '#888'}
        keyboardType="numeric"
        onChangeText={setBeneficioPorPuntos}
        style={styles.input}
    />)
}
<View style={styles.containersave}>
      <TouchableOpacity style={styles.button} onPress={() => {
        guardarPromocion();
        closeModal();
      }}>
        <Ionicons name="save-outline" size={24} color="black" />
        <Text style={styles.text}>Guardar Promocion</Text>
      </TouchableOpacity>
    </View>

</Modalize>
<Modal
  animationType="slide"
  transparent={true}
  visible={showValidationModal}
  onRequestClose={() => {
    setShowValidationModal(false);
  }}>
  <View style={styles.validationModalCenteredView}>
    <View style={styles.validationModalView}>
      <Text style={styles.validationModalText}>{validationMessage}</Text>
      <Button
        title="OK"
        onPress={() => {
          setShowValidationModal(false);
          setPromoModalVisible(true); // Vuelve a abrir el modal de promoción
        }}
      />
    </View>
  </View>
</Modal>



<Modal
  animationType="slide"
  transparent={true}
  visible={showEditValidationModal}
  onRequestClose={() => {
    setShowEditValidationModal(false);
  }}>
  <View style={styles.validationModalCenteredView}>
    <View style={styles.validationModalView}>
      <Text style={styles.validationModalText}>{editValidationMessage}</Text>
      <Button
        title="OK"
        onPress={() => {
          setShowEditValidationModal(false);
        }}
      />


    </View>
  </View>
</Modal>


<Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => {
        Alert.alert("El modal ha sido cerrado.");
        setModalVisible(!modalVisible);
    }}
>
    <View style={styles.centeredView}>
        <View style={styles.modalView}>
            <TextInput
                placeholder="Nueva Contraseña"
                value={nuevaContrasena}
                placeholderTextColor={theme === 'dark' ? '#888' : '#888'} // Ajusta los colores según necesites
                onChangeText={setNuevaContrasena}
                secureTextEntry
                style={styles.input}
            />
            <TextInput
                placeholder="Confirmar Nueva Contraseña"
                value={confirmarNuevaContrasena}
                placeholderTextColor={theme === 'dark' ? '#888' : '#888'} // Ajusta los colores según necesites
                onChangeText={setConfirmarNuevaContrasena}
                secureTextEntry
                style={styles.input}
            />
            <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => cambiarContrasena()}
            >
                <Text style={styles.textStyle}>Cambiar Contraseña</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
            >
                <Text style={styles.textStyle}>Cerrar</Text>
            </TouchableOpacity>
        </View>
    </View>
</Modal>
          
                      </>
                  ) : (
                      <>
             <View style={styles.userInfoContainer}>
              {datosUsuario && (
                <>

        <TouchableOpacity  style={styles.avatarContainere}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatarStyle} />
              ) : (
                <Image source={require('../assets/imagenes/headerImage.png')} style={styles.avatarStyle} />
              )}
            </TouchableOpacity>
          
<Text style={styles.userInfoValues}>{datosUsuario.nombre}</Text>


<View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Ionicons name="location-outline" size={22} color={theme === 'dark' ? '#EEEEEE' : '#333'}/>
    <Text style={styles.userInfoValue}> {datosUsuario.direccion}</Text>
</View>

<View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Ionicons name="call-outline" size={22} color={theme === 'dark' ? '#EEEEEE' : '#333'}/>
    <Text style={styles.userInfoValue}> {datosUsuario.telefono}</Text>
</View>

<View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Ionicons name="globe-outline" size={22} color={theme === 'dark' ? '#EEEEEE' : '#333'} />
    <Text style={styles.userInfoValue}> {datosUsuario.pagina_web}</Text>
</View>

<View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Ionicons name="mail" size={22} color={theme === 'dark' ? '#EEEEEE' : '#333'} />
    <Text style={styles.userInfoValue}> {email}</Text>
</View>


<View style={{ flexDirection: 'row', alignItems: 'center' }}>
<TouchableOpacity onPress={() => {
    setActiveIcon('settings');
    editarDatos();
    closemodalizeRefisnego();
}} style={[styles.buttonCustomsettins, activeIcon === 'settings-outline' ? styles.activeButton : {}]}>
    <Ionicons name={activeIcon === 'ssettings-outline' ? "settings-outline" : "settings-outline"} size={24} color={theme === 'dark' ? '#2196f3' : '#145486'}/>
    <Text style={styles.buttonTextmenussettîns}>Editar Informacion</Text> 
</TouchableOpacity>
</View>
{isSubscribed ? (
  <Text style={styles.textSuscribed}>Suscrito 🟢</Text>
) : (
  <Text style={styles.textNotSuscribed}>No Suscrito 🔴</Text>
)}





<View style={styles.containerpromocion}>
      <Text  onPress={handlePress}  style={styles.userInfoValuepromocion}>{datosUsuario.texto_promocional} </Text>
      <TouchableOpacity onPress={handlePress} style={styles.buttonesi}>
      <TouchableOpacity onPress={handlePress} style={styles.tuEstiloParaElBoton}>
  <Ionicons name="create" size={32} color={theme === 'dark' ? '#21cfbe' : '#333'}  style={{ marginTop: -10 }} />
</TouchableOpacity>

      </TouchableOpacity>
    </View>
<Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
            }}
        >
              <View style={styles.validationModalCenteredView}>
              <View style={styles.validationModalView}>
                <Text style={styles.validationModalText}>Necesitas añadir / revisar tu oferta</Text>
                <Button
                    title="OK"
                    onPress={() => {
                        handlePress(); // Asegúrate de que esta función maneja lo necesario
                        setModalVisible(!modalVisible);
                    }}
                />
               </View>
            </View>
        </Modal>

        <Modalize
  ref={pointsModalizeRef}
  modalHeight={modalHeighe} // Asegúrate de que esta variable tenga el valor correcto
  modalStyle={styles.modalContainermodalize}
  overlayStyle={styles.overlay}
  handleStyle={styles.handle}
  onClosed={() => {
    setPromoModalVisible(false);
  }}
>
  
<View style={styles.searchContainer}>

    <TextInput
      style={styles.searchInput}
      placeholder="Buscar usuario..."
      placeholderTextColor={theme === 'dark' ? '#888' : '#888'} // Ajusta los colores según necesites
      value={searchTerm}
      onChangeText={text => setSearchTerm(text)}
    />
  </View>
  <View style={styles.misclientes}>
    {filteredUserList.map((user, index) => (
      <View key={index} style={styles.userItem}>
        <Text style={styles.userName}>{user.nombre}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <Text style={styles.userPoints}>{user.Puntos} puntos</Text>
      </View>
    ))}
  </View>
</Modalize>



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
  <Ionicons name="add-outline" size={32} color={theme === 'dark' ? 'white' : '#333'} style={styles.scanButtonIcon} />
  <Text style={styles.scanAgainButtonText}>Tocar aqui para escanear de nuevo</Text>
</TouchableOpacity>

)}
   <TouchableOpacity
      style={styles.cancelButton}
      onPress={() => setShowCamera(false)}
    >
      <Text style={styles.cancelButtonText}>Cancelar</Text>
    </TouchableOpacity>
</Camera>

      ) : (
        <View style={styles.buttonContainer}>
   </View>
      
      
      )}
      
      {!showCamera && !showUserData && logueado && (
      <TouchableOpacity style={styles.buttonCustomPlus}  onPress={openmodalizeRefisnego}>
      <Ionicons name="menu" size={30} color={theme === 'dark' ? 'black' : 'black'} />
      </TouchableOpacity>
      
)}
   
      {userData && showUserData && (
        <View style={styles.userDataContainer}>

        <TouchableOpacity 
            onPress={() => setShowUserData(false)} 
            style={styles.closeButton} 
            testID="closeButton"
        >
            <Ionicons name="close-outline" size={32} color={theme === 'dark' ? '#EEEEEE' : '#333'} />
        </TouchableOpacity>


          <Image source={{ uri: userData.avatar }} style={styles.avatarStylescan} />
          <Text style={styles.userDataText}> {userData.nombre}</Text>
          <Text style={styles.userDataTextmail}> {userData.email}</Text>
    {userPoints.length > 0 ? (
  userPoints.map((point, index) => (
<Text key={index} style={styles.puntosText}>
  {point.puntos} puntos
</Text>
  ))
  
) : (
  <Text>No tienes puntos registrados.</Text>
)}


    <TextInput
      style={styles.inputpuntos}
      placeholder="Puntos a añadir"
      placeholderTextColor={theme === 'dark' ? '#888' : '#888'} // Ajusta los colores según necesites
      value={puntos}
      onChangeText={setPuntos}
      keyboardType="numeric" // Asegura que solo se puedan ingresar números
    />
<TouchableOpacity
  onPress={() => añadirPuntos()}
  style={styles.buttonStyle} // Asegúrate de definir este estilo
>
  <Ionicons name="add" size={24} color="white" />
  <Text style={styles.buttonTextStyle}>Añadir Puntos</Text>
</TouchableOpacity>

<TouchableOpacity
  onPress={resetUserPoints}
  style={styles.buttonStylerestablece} // Usa el mismo estilo o uno diferente si lo prefieres
>
  <Text style={styles.buttonTextStyle}>Restablecer a 0 Puntos</Text>
</TouchableOpacity>


<TouchableOpacity onPress={() => {
    setShowUserData(false) ;
    setShowCamera(true);
}} style={[styles.buttonCustom, activeIcon === 'scan-circle' ? styles.activeButton : {}]}>
    <Ionicons name={activeIcon === 'scan-circle' ? "scan-circle" : "scan-sharp"} size={30} color={theme === 'dark' ? '#5ce6d9' : 'white'}/>
    <Text style={styles.buttonTextmenus}>Escanear Codigo QR</Text> 
</TouchableOpacity>


        </View>
        
      )}

                </>
              )}
            </View>                              
                      </>
                  )}
              </>
          )}

      <Modalize
      
      ref={modalizeRefisnego}
      modalHeight={modalHeighetnegocio} // Asegúrate de que esta variable tenga el valor correcto
        onClose={closemodalizeRefisnego }
        open={isMenuModalVisible}
        modalStyle={{ backgroundColor: theme === 'dark' ? '#3d3d3d' : '#bad9d6' }}

      >
                      <LinearGradient
                            colors={theme === 'dark' ? ['#2c3e50', '#3d3d3d'] : ['#bad9d6', '#cacddb']} // Gradiente ajustado según el tema
                            style={styles.gradientBackground}>

<TouchableOpacity onPress={() => {
    closemodalizeRefisnego();
    if (isSubscribed) {
        setShowCamera(true); // Si el usuario está suscrito, permitir escanear código QR
    } else {
        navigation.navigate('SuscripcionScreeen'); // Si el usuario no está suscrito, navegar a la pantalla de suscripción
    }
}} style={[styles.buttonCustom, activeIcon === 'scan-circle' ? styles.activeButton : {}]}>
    <Ionicons name={activeIcon === 'scan-circle' ? "scan-circle" : "scan-sharp"} size={30} color={theme === 'dark' ? '#5ce6d9' : 'white'}/>
    <Text style={styles.buttonTextmenus}>Escanear Codigo QR</Text> 
</TouchableOpacity>


<TouchableOpacity onPress={() => {
    setActiveIcon('time');
    if (isSubscribed) {
        fetchUsers();
        openPointsModal();
    } else {
        navigation.navigate('SuscripcionScreeen'); // Asegúrate de que 'SubscriptionScreen' es el nombre correcto de tu pantalla de suscripción
    }
    closemodalizeRefisnego();
}} style={[styles.buttonCustom, activeIcon === 'time' ? styles.activeButton : {}]}>
    <Ionicons name={activeIcon === 'time' ? "people" : "people-outline"} size={32} color={theme === 'dark' ? '#5ce6d9' : 'white'}/>
    <Text style={styles.buttonTextmenus}>clientes</Text> 
</TouchableOpacity>




<TouchableOpacity onPress={() => {
    setActiveIcon('menu');
    openMenuModal(); // Esta acción se realiza independientemente del estado de suscripción del usuario
    closemodalizeRefisnego();
}} style={[styles.buttonCustom, activeIcon === 'menu' ? styles.activeButton : {}]}>
    <Ionicons name={activeIcon === 'menu' ? "restaurant" : "restaurant-outline"} size={30} color={theme === 'dark' ? '#5ce6d9' : 'white'}/>
    <Text style={styles.buttonTextmenus}>Publicar Menú del día</Text>
</TouchableOpacity>


<TouchableOpacity onPress={() => {
    setActiveIcon('home');
    homescreen();
    closemodalizeRefisnego();
}} style={[styles.buttonCustom, activeIcon === 'home' ? styles.activeButton : {}]}>
    <Ionicons name={activeIcon === 'home' ? "home" : "home"} size={30} color={theme === 'dark' ? '#5ce6d9' : 'white'}/>
    <Text style={styles.buttonTextmenus}>Pantalla de Inicio</Text> 
</TouchableOpacity>



{isSubscribed && (
  <TouchableOpacity 
    onPress={() => navigation.navigate('UserSuscripcionScree')} 
    style={styles.buttonCustom}
  >
    <Ionicons name="star-outline" size={30} color={theme === 'dark' ? '#5ce6d9' : 'white'} style={styles.subscribeIcon} />
    <Text style={styles.buttonTextmenus}>Ver mi Suscripcion</Text>
  </TouchableOpacity>
)}

{!isSubscribed && (
  <TouchableOpacity 
    onPress={() => navigation.navigate('SuscripcionScreeen')} 
    style={styles.buttonCustom}
  >
    <Ionicons name="star-outline" size={30}color={theme === 'dark' ? '#5ce6d9' : 'white'} style={styles.subscribeIcon} />
    <Text style={styles.buttonTextmenus}>Suscríbete o Restaurar</Text>
  </TouchableOpacity>
)}


<TouchableOpacity onPress={() => {
    setActiveIcon('information-circle');
    handlePressInfo();
    closemodalizeRefisnego();
}} style={[styles.buttonCustom, activeIcon === 'information-circle' ? styles.activeButton : {}]}>
    <Ionicons name={activeIcon === 'information-circle' ? "information-circle" : "information-circle-outline"} size={31} color={theme === 'dark' ? '#5ce6d9' : 'white'}/>
    <Text style={styles.buttonTextmenus}>Como funciona la App?</Text> 
</TouchableOpacity>



<View style={styles.containerlogoute}>
      <TouchableOpacity
        onPress={() => {
          setActiveIcon('home');
          cerrarSesion();
          closemodalizeRefisnego();
        }}
        style={[styles.buttonCustomlogout, activeIcon === 'log-out-outline' ? styles.activeButton : {}]}
      >
        <Ionicons name="log-out-outline" size={30} color={theme === 'dark' ? '#7c7c7c' : '#e91e63'} />
        <Text style={styles.buttonTextmenuslogout}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
</LinearGradient>
</Modalize>


          </KeyboardAvoidingView>
          </LinearGradient>
          </ImageBackground>
          
  );
  
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
},

input: {
  width: '90%',
  height: 50,
  margin: 12,
  borderWidth: 1,
  borderColor: theme === 'dark' ? '#a1a1a1' : '#a1a1a1',
  backgroundColor: theme === 'dark' ? '#e7e7e700' : '#d4d4d4',
  padding: 10,
  borderRadius: 20,
  color: theme === 'dark' ? '#EEEEEE' : '#333',
},
inputpuntos: {
  width: '60%',
  height: 50,
  margin: 12,
  borderWidth: 1,
  borderColor: theme === 'dark' ? '#a1a1a1' : '#a1a1a1',
  backgroundColor: theme === 'dark' ? '#d4d4d4' : '#d4d4d4',
  padding: 10,
  borderRadius: 20,
  color: theme === 'dark' ? '#333' : '#333',
  textAlign: 'center',
  fontSize: 16,
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},
inputMenus: {
  width: '99%',
  height: 50,
  margin: 12,
  borderWidth: 1,
  borderColor: theme === 'dark' ? '#a1a1a1' : '#a1a1a1',
  backgroundColor: theme === 'dark' ? '#e7e7e700' : '#d4d4d4',
  padding: 10,
  borderRadius: 20,
  color: theme === 'dark' ? '#EEEEEE' : '#333',
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},

inpute: {
  width: '95%',
  height: 80,
  margin: 12,
  borderWidth: 1,
  borderColor: theme === 'dark' ? '#a1a1a1' : '#a1a1a1',
  backgroundColor: theme === 'dark' ? '#e7e7e700' : '#d4d4d4',
  padding: 10,
  borderRadius: 20,
  color: theme === 'dark' ? '#EEEEEE' : '#333',
  textAlign: 'center',
  fontSize: 15,
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},

profileContainer: {
  width: '100%', // Ocupar todo el ancho disponible
},
avatarContainer: {
  marginBottom: 20,
},
avatarContainere: {
  marginTop: -10,
},



avatarStyle: {
  width: 100,
  height: 100,
  borderRadius: 60,
  marginBottom: 10,
  borderWidth: 2,
  borderColor: theme === 'dark' ? '#f0f0f0' : '#f0f0f0', // Añade un borde para resaltar la imagen del avatar
},

avatarStylescan: {
  width: 100,
  height: 100,
  borderRadius: 60,
  marginBottom: 10,
  marginTop: -100,
},

avatarStyleuser: {
  width: 60,
  height: 60,
  borderRadius: 60,
  marginBottom: 10,
  position: 'absolute',
  marginLeft: 10,
  marginTop: 20,
},

button: {
  backgroundColor: theme === 'dark' ? '#0000ff' : '#767676c9',
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
  marginTop: 20,
},
buttonnores: {
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
  marginTop: 20,
},


buttoncintrasena: {
  borderRadius: 20, // Bordes redondeados para el botón
  paddingVertical: 10,
  paddingHorizontal: 20,
  width: '60%',
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
  marginTop: 20,
},


buttonTextcontrasena: {
  fontSize: 16,
  color: theme === 'dark' ? '#EEEEEE' : 'white', // Cambia el color del texto del input basado en el tema
  marginBottom: 5,
  textAlign: 'center',
},

buttonTextcontrasenas: {
  fontSize: 18,
  color: theme === 'dark' ? '#21cfbe' : 'white', // Cambia el color del texto del input basado en el tema
  marginBottom: 5,
  textAlign: 'center',
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
  backgroundColor: theme === 'dark' ? '#211d4d7d' : '#dddddd96',
  padding: 25,
  borderRadius: 20,
  width: '100%',
  paddingTop: 100,
  alignItems: 'center', // Centra el contenido del botón verticalmente
  justifyContent: 'center', // Centra el contenido del botón horizontalmente

},
userInfoTitle: {
  fontSize: 17,
  fontWeight: 'bold', // Aplica negrita al título
  color: theme === 'dark' ? '#b9b9b9' : '#333', // Cambia el color del texto del input basado en el tema
  marginBottom: 5,
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},

userInfoTitlehola: {
  fontSize: 26,
  fontWeight: 'bold', // Aplica negrita al título
  color: theme === 'dark' ? '#EEEEEE' : '#333', // Cambia el color del texto del input basado en el tema
  marginBottom: 45,
  marginTop: -20,
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},
userInfoValuehola: {
  fontWeight: 'normal', // Asegura que el texto del valor tenga un peso normal
  marginBottom: 5,
  fontSize: 25,
  color: theme === 'dark' ? '#EEEEEE' : '#333', // Cambia el color del texto del input basado en el tema
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},


userInfoValue: {
  fontWeight: 'normal', // Asegura que el texto del valor tenga un peso normal
  marginBottom: 5,
  fontSize: 17,
  color: theme === 'dark' ? '#EEEEEE' : '#333', // Cambia el color del texto del input basado en el tema
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},
userInfoValues: {
  fontWeight: 'normal', // Asegura que el texto del valor tenga un peso normal
  marginBottom: 5,
  fontSize: 23,
  color: theme === 'dark' ? '#EEEEEE' : '#333', // Cambia el color del texto del input basado en el tema
marginBottom: 10,
fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},
userInfoValuepromocion: {
  fontWeight: 'normal', // Asegura que el texto del valor tenga un peso normal
  marginBottom: 5,
  fontSize: 17,
  color: theme === 'dark' ? '#21cfbe' : '#036058', // Cambia el color del texto del input basado en el tema
  marginTop: 10,
  fontWeight: 'bold', // Grosor del texto
  fontFamily: 'Poppins-Regular',
},

scanButton: {
  paddingHorizontal: 20,
  borderRadius: 20, // Bordes redondeados para el botón
  paddingVertical: 10,
  paddingHorizontal: 20,
  width: '80%',
  alignItems: 'center', // Asegurar que el texto del botón esté centrado
  marginTop: 10,
  shadowColor: "#000", // Sombras para dar un efecto elevado al botón
  shadowOffset: {
    width: 0,
    height: 7,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
  backgroundColor: theme === 'dark' ? '#24243e' : '#bad9d6', // Cambia el fondo del botón según el tema

},

scanButtonText: {
  color: theme === 'dark' ? '#bad9d6' : 'black', // Cambia el color del texto del input basado en el tema
  fontSize: 18,

},
scanButtonTextmenbus: {
  color: theme === 'dark' ? '#bad9d6' : '#302b63', // Cambia el color del texto del input basado en el tema
  fontSize: 18,

},
scanButtonTextscan: {
  color: theme === 'dark' ? '#21cfbe' : 'black', // Cambia el color del texto del input basado en el tema
  fontSize: 18,
  fontFamily: 'Poppins-Regular',

},
userDataContainer: {
  position: 'absolute',
   top: 30,
  left: 0,
  right: 0,
  backgroundColor: theme === 'dark' ? '#302b63' : '#bad9d6', // Cambia el fondo del modal según el tema
  padding: 20,
  borderRadius: 10,
  alignItems: 'center', // Centra el texto en el contenedor
  justifyContent: 'center',
  alignItems: 'center',
  height: 650,

},
puntosText: {
  color: theme === 'dark' ? '#4bc8bc' : '#009688', // Cambia el color del texto del input basado en el tema
  fontSize: 24, // Tamaño del texto
  fontWeight: 'bold', // Grosor del texto
  marginVertical: 5, // Margen vertical para separar elementos de la lista
  // Otros estilos que necesites...
},

userDataText: {
  fontSize: 21,
  marginBottom: 10,
  color: theme === 'dark' ? '#EEEEEE' : '#333', // Cambia el color del texto del input basado en el tema
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste

},
userDataTextmail: {
  fontSize: 16,
  marginBottom: 10,
  color: theme === 'dark' ? '#bad9d6' : '#333', // Cambia el color del texto del input basado en el tema
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste

},

containercamara: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
scanAgainButton: {
  flexDirection: 'row', // Alinea ícono y texto horizontalmente
  alignItems: 'center', // Centra el contenido del botón verticalmente
  justifyContent: 'center', // Centra el contenido del botón horizontalmente
  padding: 10,
  backgroundColor: theme === 'dark' ? '#009688' : '#bad9d6', // Cambia el fondo del modal según el tema
  padding: 20,
  borderRadius: 5,
  position: 'absolute', // Posicionamiento absoluto
  top: '50%', // Centrado verticalmente
  right: '-10%',
  transform: [{ translateX: -50 }, { translateY: -50 }], // Ajuste para centrar exactamente el botón
  marginTop: -15, // Ajuste basado en el tamaño del botón para centrar
},

// Estilo para el texto del botón
scanAgainButtonText: {
  color: theme === 'dark' ? '#EEEEEE' : '#333', // Cambia el color del texto del input basado en el tema
  marginLeft: 8, // Espacio entre el ícono y el texto
  fontSize: 16, // Tamaño del texto
},

// Estilo para el ícono dentro del botón, si necesitas ajustarlo más
scanButtonIcon: {
  color: '#fff', // Ícono blanco para mayor contraste
  fontSize: 24, // Tamaño del ícono
},
switchContainer: {
  position: 'absolute',
  top: 150, // Ajusta según sea necesario para tu layout
  right: 20, // Ajusta según sea necesario para tu layout
  zIndex: 1, // Asegúrate de que el switch se muestre por encima de otros elementos si es necesario
},
switchContaineris: {
textAlign: 'center',
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
  color: theme === 'dark' ? 'black' : 'white',
  fontSize: 14, // Un tamaño de fuente más grande para mejorar la legibilidad
},
buttonTextmenus: {
  color: theme === 'dark' ? '#5ce6d9' : 'white',
  fontSize: 17, // Un tamaño de fuente más grande para mejorar la legibilidad
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
  marginLeft:10,
},

buttonTextmenuslogout: {
  color: theme === 'dark' ? '#7c7c7c' : '#e91e63',
  fontSize: 16, // Un tamaño de fuente más grande para mejorar la legibilidad
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
  marginLeft:10,
},

buttonTextmenussettîns: {
  color: theme === 'dark' ? '#2196f3' : '#145486',
  fontSize: 16, // Un tamaño de fuente más grande para mejorar la legibilidad
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
  marginLeft:10,
},
buttonTextpromo: {
  color: theme === 'dark' ? '#21cfbe' : 'white', // Cambia el color del texto del input basado en el tema
  fontSize: 18, // Un tamaño de fuente más grande para mejorar la legibilidad
},
buttonTextpromover: {
  color: theme === 'dark' ? '#9ca827' : 'white', // Cambia el color del texto del input basado en el tema
  fontSize: 18, // Un tamaño de fuente más grande para mejorar la legibilidad
},


buttonTextlogin: {
  color: 'white',
  fontSize: 18, // Un tamaño de fuente más grande para mejorar la legibilidad
  textAlign: 'center',
},
buttonTextloginnores: {
  color: theme === 'dark' ? 'white' : 'black',
  fontSize: 16, // Un tamaño de fuente más grande para mejorar la legibilidad
  textAlign: 'center',
},

iconContainer: {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  position: 'absolute',
  left: 30,
  top: 80,
},
iconButtonhis: {
top: 78,
position: 'absolute',
right: 30,
},

closeIconContainer: {
  position: 'absolute',
  top: 50, // Ajusta estos valores según necesites
  left: 10, // Ajusta estos valores según necesites
  padding: 16, // Añade un padding para asegurar que el área de toque es suficiente
},
cancelButton: {
  position: 'absolute',
  bottom: 20, // Ajusta según tu layout
  right: 10, // Ajusta según tu layout
  backgroundColor: 'red', // Elige un color que se destaque
  padding: 10,
  borderRadius: 20,
},
cancelButtonText: {
  color: 'white', // Asegúrate de que el texto sea legible
  fontSize: 16,
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
  color: theme === 'dark' ? '#21cfbe' : '#323232c9', // Cambia el color del texto del input basado en el tema
  fontSize: 32,
  marginBottom: 50,
  marginTop: 65,
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},
centeredView: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 22
},


editarpromocion: {
  color: theme === 'dark' ? '#21cfbe' : '#333', // Cambia el color del texto del input basado en el tema
  fontSize: 26, // Tamaño del texto
  fontWeight: 'bold', // Grosor del texto
  marginVertical: 5, // Margen vertical para separar elementos de la lista
 marginTop: 30,
 textAlign: 'center',
 fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},


selectedButtonText: {
  color: theme === 'dark' ? '#EEEEEE' : '#333',
  textAlign: 'center', // Asegura que el texto esté centrado
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},

inputLabel: {
  color: theme === 'dark' ? '#EEEEEE' : '#333',
  textAlign: 'center', // Asegura que el texto esté centrado
  fontSize: 16,
  marginTop: 20,
  alignItems: 'center', // Alinea los botones verticalmente
  justifyContent: "center",
  alignItems: "center",
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},

inputLabele: {
  color: theme === 'dark' ? '#EEEEEE' : '#333',
  textAlign: 'center', // Asegura que el texto esté centrado
  fontSize: 16,
  marginTop: 20,
  alignItems: 'center', // Alinea los botones verticalmente
  justifyContent: "center",
  alignItems: "center",
  marginTop: -50,
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},

selectorContainer: {
  flexDirection: 'row', // Alinea los botones horizontalmente
  justifyContent: 'center', // Centra los botones en el contenedor
  alignItems: 'center', // Alinea los botones verticalmente
  marginVertical: 10, // Agrega un espacio vertical para separar de otros elementos
  marginLeft: 10,
  paddingRight: 15,
},

buttoncer: {
  backgroundColor: '#ddd', // Fondo transparente para el botón no seleccionado
  paddingVertical: 10, // Espaciado vertical dentro del botón
  paddingHorizontal: 20, // Espaciado horizontal dentro del botón
  borderRadius: 10, // Bordes redondeados
  marginHorizontal: 5, // Espacio entre los botones
  
},

selectedButton: {
  borderWidth: 2, // Ancho del borde para el botón seleccionado
  paddingVertical: 10, // Espaciado vertical dentro del botón
  paddingHorizontal: 20, // Espaciado horizontal dentro del botón
  borderRadius: 10, // Bordes redondeados
  marginHorizontal: 5, // Espacio entre los botones
},

buttones: {
  backgroundColor: '#009688', // Un azul vibrante para el botón principal
  borderRadius: 20, // Bordes redondeados para el botón
  paddingVertical: 15,
  width: '100%',
  alignItems: 'center', // Asegurar que el texto del botón esté centrado
  shadowColor: "#000", // Sombras para dar un efecto elevado al botón
  shadowOffset: {
    width: 0,
    height: 7,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
  marginTop: 30,
  justifyContent: 'center', // Centra los botones en el contenedor

},


buttoneversusarios: {
  borderRadius: 20, // Bordes redondeados para el botón
  paddingVertical: 10,
  paddingHorizontal: 20,
  width: '70%',
  alignItems: 'center', // Asegurar que el texto del botón esté centrado
  marginTop: 10,
  shadowColor: "#000", // Sombras para dar un efecto elevado al botón
  shadowOffset: {
    width: 0,
    height: 7,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
  marginTop: 20,
  padding: 10,
  borderWidth: 1, // Grosor del borde
  borderColor: theme === 'dark' ? '#9ca827' : 'white',
},

textStyle: {
  color: theme === 'dark' ? '#EEEEEE' : 'black',
  textAlign: 'center', // Asegura que el texto esté centrado
  fontSize: 18,
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
modalContent: { // Estilo para el contenido DENTRO del modal
  height: 200,
  justifyContent: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 50,
},
modalContainer: { // Estilo para el CONTENEDOR del modal
  backgroundColor: theme === 'dark' ? '#24243e' : '#cacddb', // Cambia el fondo del modal según el tema
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  borderRadius: 50,
},
modalContainermodalize: { // Estilo para el CONTENEDOR del modal
  backgroundColor: theme === 'dark' ? '#24243e' : '#cacddb', // Cambia el fondo del modal según el tema
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  position: 'absolute',
  bottom: -260,
},

text: {
  color: theme === 'dark' ? 'white' : 'black', // Cambia el color del texto según el tema
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},
scrollViewModal: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
  marginTop: 20,
},
scrollViewContainer: {
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
  marginTop: 20,
},
validationModalCenteredView: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
},
validationModalView: {
  margin: 20,
  backgroundColor: theme === 'dark' ? '#302b63' : '#fffbd5', // Cambia el fondo del modal según el tema
  borderRadius: 20,
  padding: 35,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
},
validationModalText: {
  marginBottom: 15,
  textAlign: "center",
  color: theme === 'dark' ? '#EEEEEE' : 'black',
  fontSize: 20,
},
validationModalButton: {
  borderRadius: 20,
  padding: 10,
  elevation: 2,
},
validationModalButtonText: {
  color: "white",
  fontWeight: "bold",
  textAlign: "center",
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
userItem: {
  backgroundColor: theme === 'dark' ? '#35298f5e' : '#e5e3c9fc', // Cambia el fondo del modal según el tema
  borderRadius: 10, // Bordes redondeados para los items
  padding: 15, // Espacio interior para cada item
  marginBottom: 10, // Espacio entre cada item
  shadowColor: '#000', // Sombra para cada item
  shadowOffset: { width: 0, height: 2 }, // Desplazamiento de la sombra
  shadowOpacity: 0.1, // Opacidad de la sombra
  shadowRadius: 4, // Radio de la sombra
  elevation: 2, // Elevación para Android
  flexDirection: 'column', // Elementos en columna para mayor claridad
  width: 280,
},
userName: {
  fontSize: 18, // Tamaño de fuente para el nombre
  fontWeight: 'bold', // Negrita para el nombre
  color: theme === 'dark' ? '#e7e7e7' : '#333', // Texto blanco para tema oscuro, negro para tema claro
  marginBottom: 5, // Margen debajo del nombre
  textAlign: 'center',
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste

},
userEmail: {
  fontSize: 16, // Tamaño de fuente para el email
  color: theme === 'dark' ? '#adadad' : 'black', // Texto blanco para tema oscuro, negro para tema claro
  marginBottom: 5, // Margen debajo del email
  textAlign: 'center',
    fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},
userPoints: {
  fontSize: 16, // Tamaño de fuente para los puntos
  color: '#4CAF50', // Color distintivo para los puntos, por ejemplo, verde
  fontWeight: 'bold', // Negrita para los puntos
  textAlign: 'center'
},

scanButtonIcon: {
marginTop: 5,
},

misclientes: {
  marginTop: 25,
  },

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
    marginTop:40,
    color: theme === 'dark' ? '#EEEEEE' : 'white',
    fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
  },
  fakeInput: {
    padding: 10, // Ajusta esto según tu estilo actual
    minHeight: 70, // Ajusta esto para que coincida con la altura de tu TextInput
    justifyContent: 'center', // Esto asegura que el texto esté centrado verticalmente
    borderRadius: 20, // Ajusta esto según tu estilo actual
    backgroundColor: theme === 'dark' ? '#0f0c29' : '#0f0c29', // Ajusta esto según tu estilo actual
    fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
  },
  inputText: {
    color: theme === 'dark' ? '#EEEEEE' : 'white',
    fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
  },
  currencyPickerButton: {
    backgroundColor: theme === 'dark' ? '#0f0c29' : '#ddd', // Botón según el tema
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
    width: '50%', // Ajusta el ancho según necesites
    alignItems: 'center'
  },
  currencyPickerButtonText: {
    color: theme === 'dark' ? '#EEEEEE' : '#333', // Texto del botón según el tema
    fontSize: 16, // Ajusta el tamaño de letra según necesites
    fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
  },
  modalViewu: {
    margin: 20,
    backgroundColor: theme === 'dark' ? '#24243e' : '#fff', // Fondo del modal según el tema
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '60%', // Ajusta el ancho del modal según necesites
    alignSelf: 'center',
    height: '60%', // Ajusta el alto del modal según necesites
    marginTop: '40%' // Ajusta la posición del modal según necesites
  },
  currencyItem: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: theme === 'dark' ? 'black' : '#f9f9f9', // Fondo de cada elemento según el tema
    borderRadius: 5,
    width: '100%' // Asegúrate de que ocupe el ancho disponible
  },
  currencyText: {
    color: theme === 'dark' ? '#EEEEEE' : '#333', // Texto de cada elemento según el tema
    fontSize: 18, // Ajusta el tamaño de letra según necesites
    textAlign: 'center', // Centra el texto
    fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
  },
  containerpromocion: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000', // Sombra para el contenedor
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 5,
    marginTop: 20,
  },
  userInfoValuepromocion: {
    fontSize: 17,
    color: theme === 'dark' ? '#30eedc' : '#333',
    marginBottom: 20, // Espacio debajo del texto
    textAlign: 'center', // Asegura que el texto esté centrado
    marginTop: 20,
    borderRadius: 20,
    fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
  },

  buttonContainer: {
    fontSize: 18,
    color: theme === 'dark' ? '#ccc6ffc4' : 'white',
    marginBottom: 20, // Espacio debajo del texto
    textAlign: 'center', // Asegura que el texto esté centrado
    padding: 10,
    borderRadius: 20,  
  },

  
  buttonesi: {
    padding: 10,
    borderRadius: 5,
    marginTop: -10,
  },
  buttonTextpromo: {
    color:  theme === 'dark' ? '#30eedc' : 'black',
    fontSize: 16,
    borderRadius: 5,
    fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
    
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
},

button: {
    backgroundColor: "#2196F3", // o cualquier color que prefieras
    padding: 10,
    borderRadius: 5,
},

modalView: {
  margin: 20,
  backgroundColor: theme === 'dark' ? '#24243ede' : '#cacddbde', // Fondo de cada elemento según el tema
  borderRadius: 5,
  borderRadius: 20,
  padding: 35,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
  maxHeight: '80%', // Asegúrate de que el modal no sea demasiado grande
  width: '90%', // Establece el ancho a un porcentaje de la pantalla
  marginTop: '35%', // Asegúrate de que el modal no esté demasiado cerca de la parte superior
},
flatListContainer: {
  maxHeight: 200, // Ajusta este valor según necesites
  width: '100%',
},
menuItem: {
  borderWidth: 2, // Grosor del borde
  borderColor: theme === 'dark' ? '#c3c3c3' : '#a2a2a2', // Color del borde basado en el tema
  padding: 20,
  marginVertical: 8,
  marginHorizontal: 16,
  borderRadius: 10, // Para un poco de diseño
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},

menuText: {
  fontSize: 16,
  marginBottom: 5, // Espacio entre cada línea de texto
  color:  theme === 'dark' ? 'white' : 'black',
},
menuTextanadir: {
  fontSize: 16,
  color:  theme === 'dark' ? '#f5f5dc' : 'black',
},

iconButtonmodal: {
position: 'absolute',
top: 50,
left: 20,
},

  gradientBackground: {
    padding: 15,
    borderRadius: 10,
    height:  '100%',
    paddingBottom: 200,
  },
  closeButton: {
    // Añade aquí los estilos que necesitas, por ejemplo:
    padding: 5,
    margin: 5,
    backgroundColor: theme === 'dark' ? '#24243e' : '#f5f5dc',
    borderRadius: 20, // Ejemplo para hacer el botón un poco redondeado
    position: 'absolute',
    top: 20,
    left: 10,
},
buttoncusrom: {
  position: 'absolute',
  right: 110,
  padding: 10, // Añade un poco de padding para hacer más fácil tocar el icono
  alignItems: 'center', // Centra el contenido (icono y texto) horizontalmente
  justifyContent: 'center', // Centra el contenido (icono y texto) verticalmente
  flexDirection: 'row', // Organiza el icono y el texto en fila

},
buttoncusrome: {
  position: 'absolute',
  left: 110,
  padding: 10, // Añade un poco de padding para hacer más fácil tocar el icono
  alignItems: 'center', // Centra el contenido (icono y texto) horizontalmente
  justifyContent: 'center', // Centra el contenido (icono y texto) verticalmente
  flexDirection: 'row', // Organiza el icono y el texto en fila

},
buttoncusromeeditar: {
  position: 'absolute',
  right: 30,
  padding: 10, // Añade un poco de padding para hacer más fácil tocar el icono
  alignItems: 'center', // Centra el contenido (icono y texto) horizontalmente
  justifyContent: 'center', // Centra el contenido (icono y texto) verticalmente
  flexDirection: 'row', // Organiza el icono y el texto en fila

},

backButton: {
  position: 'absolute',
  left: 30, // Ajusta la distancia desde la izquierda
  padding: 10, // Añade un poco de padding para hacer más fácil tocar el icono

},
logouteButton: {
  position: 'absolute',
 right: 25, // Ajusta la distancia desde la izquierda
  padding: 10, // Añade un poco de padding para hacer más fácil tocar el icono
  top: 50,

},

text: {
  color:  theme === 'dark' ? 'white' : 'white',
  marginLeft: 10, // Espacio entre el icono y el texto
  fontSize: 17, // Tamaño del texto
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},
modalText: {
  color:  theme === 'dark' ? '#30eedc' : 'black',
  marginLeft: 10, // Espacio entre el icono y el texto
  fontSize: 21, // Tamaño del texto
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
  textAlign: 'center',
},
buttonClose: {
  backgroundColor: theme === 'dark' ? '#24243e' : '#f5f5dc',
  fontSize: 21, // Tamaño del texto
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
  marginTop: 10,
},


 tabBarContainer: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  padding: 10,
    position: 'absolute', // Posicionamiento absoluto para flotar
    bottom: 40, // Ubicado en la parte inferior de la pantalla
    left: 20,
    right: 20,
    backgroundColor: theme === 'dark' ? '#24243e' : '#f5f5dceb',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 18, // Elevación para Android
    height: 60, // Ajusta la altura según necesites
    borderRadius: 50, // Bordes redondeados para la barra
  },
  buttonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#009688', // Un color de fondo azul, ajústalo a tus necesidades
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5, // Espaciado vertical para separar los botones
    marginTop: 10,
  },
  buttonStylerestablece: {
    flexDirection: 'row',
    backgroundColor: '#24243e', // Un color de fondo azul, ajústalo a tus necesidades
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5, // Espaciado vertical para separar los botones
    marginTop: 10,
  },
  
  
  buttonTextStyle: {
    color: 'white',
    marginLeft: 10, // Espacio entre el ícono y el texto
    fontSize: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    // Agrega más estilos para el contenido interno del botón si es necesario
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    margin: 10,
  },
  modalContent: {
    padding: 20,
  },

  buttonCustom: {
    flexDirection: 'row', // Alinea los elementos internos en una fila
    alignItems: 'center', // Centra los elementos en la dirección transversal (vertical)
    alignItems: 'center', // Centra contenidos verticalmente
    paddingVertical: 10, // Espacio vertical interno
    padding: 20, // Espacio alrededor del contenido
    margin: 5, // Espacio alrededor del botón
    backgroundColor: theme === 'dark' ? '#232d6a' : '#597774',
    borderRadius: 20, // Bordes redondeados del botón
    shadowColor: "#000", // Sombra del botón
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
    height: 60,
},
buttonCustomlogout: {
  flexDirection: 'row', // Alinea los elementos internos en una fila
  alignItems: 'center', // Centra los elementos en la dirección transversal (vertical)
  alignItems: 'center', // Centra contenidos verticalmente
  paddingVertical: 10, // Espacio vertical interno
  padding: 10, // Espacio alrededor del contenido
  margin: 5, // Espacio alrededor del botón
  borderRadius: 20, // Bordes redondeados del botón
  shadowColor: "#000", // Sombra del botón
  shadowOffset: {
      width: 0,
      height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
  marginTop: -20,
},

buttonCustomsettins: {
  flexDirection: 'row', // Alinea los elementos internos en una fila
  alignItems: 'center', // Centra los elementos en la dirección transversal (vertical)
  alignItems: 'center', // Centra contenidos verticalmente
  paddingVertical: 10, // Espacio vertical interno
  borderRadius: 20, // Bordes redondeados del botón
  shadowColor: "#000", // Sombra del botón
  shadowOffset: {
      width: 0,
      height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},

  buttonCustomPlus: {
    position: 'absolute',  // Posicionamiento absoluto respecto a su contenedor más cercano posicionado
    bottom: -100,         // Ubicado en la parte inferior de la pantalla
    alignSelf: 'center',   // Centrado horizontalmente en su contenedor
    width: 55,             // Anchura fija
    height: 55,            // Altura fija
    borderRadius: 30,      // Hace que el fondo sea completamente redondo
    backgroundColor: theme === 'dark' ? '#30eedc' : '#bad9d6',
    justifyContent: 'center',    // Centra el contenido (icono) verticalmente
    alignItems: 'center',        // Centra el contenido (icono) horizontalmente
    shadowColor: "#000",         // Sombra para el botón
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme === 'dark' ? '#3c5552' : '#8ca4a2c4',
  },
  modalContente: {
    margin: 20,
    backgroundColor: theme === 'dark' ? '#3c5552' : '#84b3af',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    marginBottom: 15,
  },
  modalHeaderText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 23,
    fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
    color:  theme === 'dark' ? '#30eedc' : '#032320',
  },
  modalBodyText: {
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
    marginTop: 20,
    color:  theme === 'dark' ? 'white' : '#393a3a',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: theme === 'dark' ? '#3c5552' : '#8cc5c0c4',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom: 10,
  },

  scanButtones: {
    position: 'absolute',
    top: 60,
   right: 30,
   backgroundColor: theme === 'dark' ? '#3c5552' : '#8cc5c0c4',
   borderRadius: 20,
   padding: 10,
   elevation: 2,
   marginBottom: 10,
  
    },

  modalButtonText: {
    color:  theme === 'dark' ? 'black' : 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
  },
  modalButtonSecondary: {
    borderColor: '#30eedc', // Color azul de botón iOS
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  modalButtonTextSecondary: {
    color: '#30eedc',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
  },
  containerlogoute: {
    flex: 1, // El contenedor utiliza flex
    justifyContent: 'center', // Centra contenido verticalmente
    alignItems: 'center', // Centra contenido horizontalmente
    marginTop: 22,
  },
  containersave: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  button: {
    flexDirection: 'row', // Alinea horizontalmente el icono y el texto
    alignItems: 'center', // Asegura que el icono y el texto estén centrados verticalmente
    backgroundColor: theme === 'dark' ? '#30eedc' : '#30eedc',
    padding: 10, // Espaciado interno para hacer el botón más grande
    borderRadius: 5, // Bordes redondeados para el botón
    marginTop: 12,
    marginBottom:12,
  },
  text: {
    marginLeft: 10, // Espacio entre el icono y el texto
    fontSize: 16, // Tamaño del texto, ajustable
    color:  theme === 'dark' ? '#032320' : '#032320',
  },
  buttonimagen: {
    flexDirection: 'row', // Alinea horizontalmente el icono y el texto
    alignItems: 'center', // Asegura que el icono y el texto estén centrados verticalmente
    backgroundColor: theme === 'dark' ? '#9f9f9f' : '#9f9f9f',
    padding: 7, // Espaciado interno para hacer el botón más grande
    borderRadius: 5, // Bordes redondeados para el botón
    marginTop: 12,
    marginBottom:12,
  },
  subscribeButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#ff4081',
  paddingHorizontal: 20,
  paddingVertical: 10,
  borderRadius: 20,
  margin: 10,
},

subscribeIcon: {
  marginRight: 8,
},

textSuscribed: {
  textAlign: 'center',
  fontSize: 16,
  fontFamily: 'Poppins-Regular',    
color:  theme === 'dark' ? 'white' : 'black',
},
textNotSuscribed: {
textAlign: 'center',
fontSize: 16,
fontFamily: 'Poppins-Regular', 
color:  theme === 'dark' ? 'white' : 'black',
},
});

export default LoginScreen;

