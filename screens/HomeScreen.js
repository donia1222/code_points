import React, { useState, useEffect,useRef,useCallback } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Modal, TouchableOpacity, Image, ScrollView, Dimensions, Linking,Animated, FlatList, } from 'react-native';
import { useTheme } from './ThemeContext'; // Importa useTheme de tu ThemeContext
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Modalize } from 'react-native-modalize';
import exampleImage from '../assets/imagenes/headerImage.png';
import defaultAvatar from '../assets/imagenes/headerImage.png';
import { ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { AppState } from 'react-native';
import { useFonts } from 'expo-font';
import TextoAnimadoFidelize from '../screens/TextoAnimadoFidelize'; // Asegúrate de que la ruta sea correcta
import { Share } from 'react-native';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const UserProfile = ({ route, navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [isModalOpened, setIsModalOpened] = useState(true); // Nuevo estado para controlar la apertura del modal
const [isLoading, setIsLoading] = useState(false);
const [negocios, setNegocios] = useState([]);
const gradientColors = theme === 'dark' ? ['#16142ced', '#322d6ded', '#24243e69'] : ['#fffbd5', '#8a96cbdb', '#8a96cb6b'];
const [searchText, setSearchText] = useState('');
const [isVisible, setIsVisible] = useState(false);
const { themes, toggleTheme } = useTheme();
const modalizeRef = useRef(null);
const screenHeight = Dimensions.get('window').height;
const modalHeight = screenHeight * 0.85;
const opacity = useRef(new Animated.Value(1)).current;  
const [menus, setMenus] = useState([]);
const scrollY = useRef(new Animated.Value(0)).current; // Se usará para el valor de desplazamiento del ScrollView
const [currentPosition, setCurrentPosition] = useState(null);
const [isMapModalOpened, setIsMapModalOpened] = useState(false);
const mapModalizeRef = useRef(null);
const scaleAnim = useRef(new Animated.Value(1)).current; // Inicialización con valor de escala 1
const favoritosModalRef = useRef(null);
const [isfavoritosModalRef, setIsfavoritosModalRef] = useState(false);
const [favoritos, setFavoritos] = useState([]);
const scaleAnime = useRef(new Animated.Value(1)).current; // Inicialización con valor de escala 1
const [showNoFavoritosModal, setShowNoFavoritosModal] = useState(false);
// Función para abrir la dirección en Google Maps o Apple Maps
const openMaps = (direccion) => {
  const encodedAddress = encodeURIComponent(direccion);
  const scheme = Platform.OS === 'ios' ? 'maps:0,0?q=' : 'geo:0,0?q=';
  const url = Platform.OS === 'ios' ? `${scheme}${encodedAddress}` : `http://maps.google.com/?q=${encodedAddress}`;

  Linking.openURL(url).catch((err) => console.error('An error occurred', err));
};


useEffect(() => {
  const cargarNegociosConMenus = async () => {
    try {
      const response = await axios.get('https://mycode.lweb.ch/negocios/obtener_menus.php');
      const menusAgrupados = {}; // Nuevo objeto para agrupar menús por negocio

      // Organiza los menús por negocio
      response.data.forEach(menu => {
        if (!menusAgrupados[menu.nombre_negocio]) {
          menusAgrupados[menu.nombre_negocio] = {
            ...menu, // Asume que hay detalles del negocio aquí
            menus: [menu] // Inicia un nuevo arreglo de menús para este negocio
          };
        } else {
          menusAgrupados[menu.nombre_negocio].menus.push(menu);
        }
      });

      // Convierte el objeto agrupado de nuevo en un arreglo para el estado
      const negociosConMenus = Object.values(menusAgrupados);
      setNegocios(negociosConMenus);
    } catch (error) {
      console.error('Error al cargar los negocios y menús:', error);
    }
  };

  cargarNegociosConMenus();
}, []);



const compartirMenu = async (menu) => {
  try {
    const result = await Share.share({
      message: `Mira este menú: ${menu.nombre_negocio} - ${menu.menu}. Más detalles: ${menu.precio} CHF, Dirección: ${menu.columna_direccion}.`,
      // Puedes añadir una URL o cualquier otra información que quieras compartir
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // La compartición se completó (con actividad)
      } else {
        // La compartición se completó (sin actividad específica)
      }
    } else if (result.action === Share.dismissedAction) {
      // La compartición fue cancelada
    }
  } catch (error) {
    alert(error.message);
  }
};


const triggerFavoriteAnimation = () => {
  Animated.sequence([
    Animated.timing(scaleAnime, {
      toValue: 1.5, // Aumenta la escala
      duration: 200, // Duración de 200ms
      useNativeDriver: true, // Utiliza el controlador nativo
    }),
    Animated.timing(scaleAnime, {
      toValue: 1, // Regresa a la escala original
      duration: 200,
      useNativeDriver: true,
    }),
  ]).start();
};


useEffect(() => {
  if (favoritos.length > 0) {
    triggerFavoriteAnimation();
  }
}, [favoritos.length]); // Depende del largo de 'favoritos' para reaccionar a cambios


const openMapModalfavoritos = () => {
  // Solo abre el modal si hay favoritos
  if (favoritos.length > 0) {
    setIsfavoritosModalRef(true);
  } else {
    // Muestra el modal de "no hay favoritos"
    setShowNoFavoritosModal(true);
    // Oculta el modal después de 3 segundos
    setTimeout(() => {
      setShowNoFavoritosModal(false);
    }, 1000);
  }
};


const closeMapModalfavoritos = () => {
  setIsfavoritosModalRef(false);
};

useEffect(() => {
  if (favoritosModalRef.current) {
      if (isfavoritosModalRef) {
        favoritosModalRef.current.open();
      } else {
        favoritosModalRef.current.close();
      }
  }
}, [isfavoritosModalRef]);


const saveFavoritosToStorage = async (favoritos) => {
  try {
    const jsonValue = JSON.stringify(favoritos);
    await AsyncStorage.setItem('@favoritos', jsonValue);
  } catch (e) {
    // guardar error
    console.error('Error saving data', e);
  }
};

const loadFavoritosFromStorage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@favoritos');
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch(e) {
    // cargar error
    console.error('Error loading data', e);
    return []; // En caso de error, devuelve una lista vacía
  }
};

// Luego, modifica tu useEffect inicial para cargar los favoritos cuando la aplicación se carga:
useEffect(() => {
  startBreathingAnimation(); // Inicia la animación al montar el componente
  
  // Nuevo: Carga los favoritos del almacenamiento local al iniciar
  const fetchFavoritos = async () => {
    const storedFavoritos = await loadFavoritosFromStorage();
    setFavoritos(storedFavoritos);
  };

  fetchFavoritos();

  return () => stopBreathingAnimation(); // Opcional: Detiene la animación al desmontar
}, []);

// Finalmente, asegúrate de llamar a saveFavoritosToStorage cada vez que actualices los favoritos:
const toggleFavorito = (menuSeleccionado) => {
  setFavoritos(prevFavoritos => {
    // Verifica si algún menú del negocio ya es favorito
    const isFavorito = prevFavoritos.some(fav => fav.nombre_negocio === menuSeleccionado.nombre_negocio);

    let newFavoritos;

    if (isFavorito) {
      // Si ya es favorito, elimina todos los menús de ese negocio de favoritos
      newFavoritos = prevFavoritos.filter(fav => fav.nombre_negocio !== menuSeleccionado.nombre_negocio);
    } else {
      // Si no es favorito, agrega el negocio completo (todos sus menús) a favoritos
      // Esto puede requerir ajustar cómo se recuperan y almacenan los negocios y sus menús
      // Por simplicidad, aquí se agrega directamente el menuSeleccionado, pero deberías ajustar esto
      // para agregar todos los menús del negocio seleccionado si es necesario
      newFavoritos = [...prevFavoritos, menuSeleccionado];
    }

    // Guardar en el almacenamiento local
    saveFavoritosToStorage(newFavoritos);
    return newFavoritos;
  });
};


// Función para iniciar la animación
const startBreathingAnimation = () => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1, // Escala aumentada
        duration: 2000, // Duración en milisegundos para aumentar
        useNativeDriver: true, // Usa el driver nativo para mejor rendimiento
      }),
      Animated.timing(scaleAnim, {
        toValue: 1, // Vuelve a la escala original
        duration: 2000, // Duración en milisegundos para disminuir
        useNativeDriver: true,
      }),
    ])
  ).start();
};

useEffect(() => {
  startBreathingAnimation(); // Inicia la animación al montar el componente

  return () => stopBreathingAnimation(); // Opcional: Detiene la animación al desmontar
}, []);

// Detiene la animación
const stopBreathingAnimation = () => {
  scaleAnim.setValue(1); // Restablece a la escala original por si acaso
  Animated.loop(Animated.sequence([])).stop(); // Detiene cualquier animación en loop
};

let [fontsLoaded] = useFonts({
  'Poppins-Regular': require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
});
const buttonTextOpacity = scrollY.interpolate({
  inputRange: [0, 50], // Ajusta estos valores según sea necesario
  outputRange: [1, 0], // La opacidad será total al inicio y se desvanecerá con el desplazamiento
  extrapolate: 'clamp', // Asegura que la opacidad no exceda los límites de 0 y 1
});


useEffect(() => {
  const appStateListener = AppState.addEventListener("change", async (nextAppState) => {
    if (nextAppState === "active") {
      console.log('App has come to the foreground!');
      // Llama a la función para verificar los permisos y obtener la ubicación
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        getCurrentLocation(); // Asegúrate de tener una función que obtenga la ubicación actual
      }
    }
  });

  return () => {
    // No olvides remover el listener cuando el componente se desmonte
    appStateListener.remove();
  };
}, []);

useEffect(() => {
  async function verifyLocationPermissionOnStart() {
    let hasPermission = false;

    // Verificar permisos para Android
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Permiso de Ubicación",
          message: "Esta aplicación necesita acceso a tu ubicación.",
          buttonNeutral: "Pregúntame Luego",
          buttonNegative: "Cancelar",
          buttonPositive: "OK"
        }
      );
      hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      // En iOS, la solicitud de permisos se maneja a través del plist y la biblioteca directamente
      const response = await Geolocation.requestAuthorization('whenInUse');
      hasPermission = response === 'granted';
    }

    // Si no se concedieron los permisos, mostrar la alerta
    if (!hasPermission) {
      showAlertPermissionDenied();
    }
  }

  verifyLocationPermissionOnStart();
}, []);



// Función para mostrar el alerta de permiso denegado
function showAlertPermissionDenied() {
  Alert.alert(
    "Permiso de ubicación denegado",
    "Para utilizar esta funcionalidad, necesitas dar permiso de ubicación en los ajustes de tu dispositivo.",
    [
      {
        text: "Cancelar",
        style: "cancel"
      },
      { text: "Abrir Ajustes", onPress: () => Linking.openSettings() } // Esta línea intentará abrir los ajustes del dispositivo para que el usuario pueda cambiar los permisos.
    ]
  );
}

const obtenerDireccion = async (latitude, longitude) => {
  try {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=API`);
    const data = await response.json();
    if (data.status === 'OK') {
      // Asumimos que la primera ubicación es la correcta
      return data.results[0].formatted_address;
    } else {
      console.error('No se pudo obtener la dirección');
      return ''; // Retorna una cadena vacía o maneja este caso como prefieras
    }
  } catch (error) {
    console.error('Error al obtener la dirección:', error);
    return ''; // Maneja el error devolviendo una cadena vacía o como prefieras
  }
};

const getCurrentLocation = () => {
  Geolocation.getCurrentPosition(
    position => {
      console.log(position);
      setCurrentPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    },
    error => {
      console.log(error.code, error.message);
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  );
};


const getLocationAndUpdateSearch = async () => {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) {
    // Si no hay permiso, debería mostrar la alerta aquí también si no se hace en requestLocationPermission
    showAlertPermissionDenied();
    return;
  }
  Geolocation.getCurrentPosition(
    async position => {
      const { latitude, longitude } = position.coords;
      const direccion = await obtenerDireccion(latitude, longitude);
      setSearchText(direccion); // Actualiza el estado del campo de búsqueda con la dirección
    },
    error => {
      console.error(error.code, error.message);
      showAlertPermissionDenied(); // Asegúrate de mostrar la alerta si hay un error al obtener la ubicación
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  );
};



useEffect(() => {
  const cargarNegociosConUbicacion = async () => {
    try {
      const respuesta = await fetch('https://mycode.lweb.ch/negocios/obtener_menus.php');
      const negocios = await respuesta.json();
      const negociosConCoordenadas = await Promise.all(negocios.map(async negocio => {
        // Aquí utilizas el Geocoding API para convertir la dirección en coordenadas
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(negocio.columna_direccion)}&key=API`);
        const data = await response.json();
        if (data.status === 'OK') {
          // Asumimos que la primera ubicación es la correcta
          negocio.coordenadas = data.results[0].geometry.location;
        }
        return negocio;
      }));
      setNegocios(negociosConCoordenadas);
    } catch (error) {
      console.error('Error al cargar los negocios:', error);
    }
  };

  cargarNegociosConUbicacion();
}, []);

const openMapModal = () => {
  setIsMapModalOpened(true);
};

const closeMapModal = () => {
  setIsMapModalOpened(false);
};
useEffect(() => {
  if (mapModalizeRef.current) {
      if (isMapModalOpened) {
          mapModalizeRef.current.open();
      } else {
          mapModalizeRef.current.close();
      }
  }
}, [isMapModalOpened]);


useEffect(() => {
  async function getLocation() {
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      Geolocation.getCurrentPosition(
        position => {
            console.log(position); // Verifica que esta línea esté presente
            setCurrentPosition({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        },
        error => {
            console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
    }
  }
  getLocation();
}, []);

async function requestLocationPermission() {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Permiso de Ubicación",
          message: "Esta aplicación necesita acceso a tu ubicación.",
          buttonNeutral: "Pregúntame Luego",
          buttonNegative: "Cancelar",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Ahora tienes acceso a la ubicación");
        return true; // Permiso concedido
      } else {
        console.log("Permiso de ubicación denegado");
        return false; // Permiso denegado
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true; // En iOS siempre es true porque el permiso se solicita automáticamente
}

const headerHeight = scrollY.interpolate({
  inputRange: [0, 50], // Ajusta según la cantidad de scroll antes de la animación
  outputRange: [100, 0], // Altura original y nueva del contenedor
  extrapolate: 'clamp', // Evita que los valores se extiendan más allá de su rango
});

const headerOpacity = scrollY.interpolate({
  inputRange: [0, 50], // Coincide con el rango de la altura
  outputRange: [1, 0], // Opacidad de visible a invisible
  extrapolate: 'clamp',
});


useEffect(() => {
  axios.get('https://mycode.lweb.ch/negocios/obtener_menus.php')
      .then(response => {
          setMenus(response.data);
      })
      .catch(error => {
          console.log(error);
      });
}, []);

const handlePressPhone = (phone) => {
  const url = `tel:${phone}`;
  Linking.openURL(url);
};

const handlePressEmail = (email) => {
  const url = `mailto:${email}`;
  Linking.openURL(url);
};
const handlePressWeb = async (web) => {
const formattedWeb = web.startsWith('http://') || web.startsWith('https://') ? web : `http://${web}`;
const canOpen = await Linking.canOpenURL(formattedWeb);
if (canOpen) {
  Linking.openURL(formattedWeb);
} else {
  console.error('No se puede abrir la URL:', formattedWeb);
}
};

const fadeIn = () => {
  Animated.timing(opacity, {
    toValue: 1, // Anima la opacidad a 1
    duration: 500, // Duración de 500 milisegundos
    useNativeDriver: true, // Usa el controlador nativo para una mejor performance
  }).start();
};

const fadeOut = () => {
  Animated.timing(opacity, {
    toValue: 0, // Anima la opacidad a 0
    duration: 500, // Duración de 500 milisegundos
    useNativeDriver: true, // Usa el controlador nativo para una mejor performance
  }).start();
};

useEffect(() => {
  if (isModalOpened) {
    fadeOut(); // Desvanece el icono cuando el modal está abierto
  } else {
    fadeIn(); // Aparece el icono cuando el modal está cerrado
  }
}, [isModalOpened]);

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
    const onChoose = async (choice) => {
      setIsVisible(false);
      await AsyncStorage.setItem('tipoUsuario', choice); // Guarda el tipo de usuario
      navigation.navigate(choice);
    };
    const closeModal = async () => {
      // Indica que el modal se está cerrando
      setIsModalOpened(false);
      await reloadData();
      // Opcional: Remover el tipo de usuario si cierran el modal sin elegir
      await AsyncStorage.removeItem('tipoUsuario');
    };
    

    const reloadData = async () => {
      try {
          const response = await axios.get('https://mycode.lweb.ch/negocios/obtener_menus.php');
          setMenus(response.data); // Actualiza el estado con los nuevos menús
          console.log('Menús recargados');
      } catch (error) {
          console.error('Error al recargar los menús:', error);
      } finally {
      }
  };
  
useEffect(() => {
  console.log(negocios.map(negocio => negocio.avatar)); // Imprimirá todas las URLs de los avatares
}, [negocios]);
useEffect(() => {
  const cargarNegocios = async () => {
    try {
      const respuesta = await fetch('https://mycode.lweb.ch/negocios/obtenerNegocios.php');
      const negocios = await respuesta.json();
      console.log(negocios);  // Esto te permitirá ver la respuesta del servidor y asegurarte de que contiene la URL correcta del avatar.
      setNegocios(negocios);
    } catch (error) {
      console.error('Error al cargar los negocios:', error);
    }
  };

  cargarNegocios();
}, []);

useEffect(() => {
  const verificarUsuario = async () => {
    try {
      // Intenta recuperar el tipo de usuario del almacenamiento local
      const tipoUsuario = await AsyncStorage.getItem('tipoUsuario');
      
      // Si hay un tipo de usuario guardado, navega a la pantalla correspondiente
      if (tipoUsuario) {
        navigation.navigate(tipoUsuario);
      }

      // Luego continúa con la carga de negocios
      const respuesta = await fetch('https://mycode.lweb.ch/negocios/obtenerNegocios.php');
      const negocios = await respuesta.json();
      setNegocios(negocios);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  verificarUsuario();
}, []);


if (isLoading) {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',  backgroundColor: '#24243e',}}>
    <ActivityIndicator size="large" color="#fffbd5" />
  </View>
  );
}


const handlePressMore = (nombreNegocio) => {
  setSearchText(nombreNegocio); // Actualiza el input de búsqueda con el nombre del negocio
  setIsMapModalOpened(false); // Cierra el modal del mapa
  // Si necesitas cerrar también el modal de búsqueda o realizar alguna otra acción, añádela aquí
};

const handlePress = async () => {
  openMapModal();
};



const filteredMenus = menus.filter(menu => {
  // Limpia los términos de búsqueda y los divide en términos individuales.
  const searchTerms = searchText.toLowerCase().split(" ").map(term => term.replace(/,/g, ""));
  
  // Verifica si alguno de los términos de búsqueda aparece en los atributos relevantes del negocio.
  const matchesSearch = searchTerms.some(term => 
    menu.nombre_negocio.toLowerCase().includes(term) ||
    (menu.columna_direccion && menu.columna_direccion.toLowerCase().includes(term))
  );

  return matchesSearch;
});


const handlePressmapa = () => {
  Linking.openSettings();
};

const agruparMenusPorNegocio = (menus) => {
  const grupos = {};
  
  menus.forEach((menu) => {
    if (!grupos[menu.nombre_negocio]) {
      grupos[menu.nombre_negocio] = {
        nombre_negocio: menu.nombre_negocio,
        columna_direccion: menu.columna_direccion,
        imagen_url: menu.imagen_url, // Asume que todos los menús de un negocio comparten la misma imagen
        email_negocio: menu.email_negocio,
        web_negocio: menu.web_negocio,
        telefono_negocio: menu.telefono_negocio,
        menus: []
      };
    }
    grupos[menu.nombre_negocio].menus.push(menu);
  });

  return Object.values(grupos);
};

const negociosConMenus = agruparMenusPorNegocio(filteredMenus);


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
      {
  showNoFavoritosModal && (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showNoFavoritosModal}
      onRequestClose={() => {
        setShowNoFavoritosModal(false);
      }}
    >
      <View style={styles.centeredViewfavo}>
        <View style={styles.modalViewfavo}>
          <Text style={styles.modalText}>No hay favoritos</Text>
        </View>
      </View>
    </Modal>
  )
}

<Modalize ref={mapModalizeRef} modalHeight={modalHeight} onClosed={closeMapModal}>
    {currentPosition && (
      <MapView
    style={{ width: windowWidth, height: modalHeight }}
initialRegion={{
  latitude: currentPosition.latitude,
  longitude: currentPosition.longitude,
  latitudeDelta: 0.5, // Valor aumentado para menos zoom
  longitudeDelta: 0.5, // Valor aumentado para menos zoom
}}

    showsUserLocation={true}
>
    <Marker
        coordinate={{
            latitude: currentPosition.latitude,
            longitude: currentPosition.longitude,
        }}
        title={"Tu Ubicación"}
    />
{negocios.map((negocio, index) => 
  negocio.coordenadas && (
<Marker
  key={index}
  coordinate={{
    latitude: negocio.coordenadas.lat,
    longitude: negocio.coordenadas.lng,
  }}
>
  <View style={styles.customMarker}>
    <Image
      source={negocio.imagen_url ? { uri: negocio.imagen_url } : require('../assets/imagenes/headerImage.png')}
      style={styles.negocioAvatarStyle}
    />
  </View>
  <Callout tooltip>
    <View style={styles.customCallout}>
    <Image
      source={negocio.imagen_url ? { uri: negocio.imagen_url } : require('../assets/imagenes/headerImage.png')}
      style={styles.negocioAvatarStyle}
    />
      <Text style={styles.menuPromotionnombre}>{negocio.nombre_negocio}</Text>
      <Text style={styles.menuPromotiondireccion}>{negocio.columna_direccion}</Text>
      <TouchableOpacity  style={styles.moreButton} onPress={() => handlePressMore(negocio.nombre_negocio)}>
      <Ionicons  style={styles.moreButtonTexticono} name="restaurant-outline" size={24} color={theme === 'dark' ? '#5bdfd3' : 'black'} />
      <Text style={styles.moreButtonText}>Ver Menu</Text>
  </TouchableOpacity>
   
   <Text style={styles. menuPromotionmapa}>{negocio.promocion_negocio}</Text>

   <View style={styles.contactIcons}>
   <TouchableOpacity onPress={() => handlePressEmail(negocio.email_negocio)}>
   <Ionicons name="mail-outline" size={24} color=  {theme === 'dark' ? '#67e8dc' : '#333'} />
 </TouchableOpacity>
<TouchableOpacity onPress={() => handlePressPhone(negocio.telefono_negocio)}>
  <Ionicons name="call-outline" size={24} color=  {theme === 'dark' ? '#67e8dc' : '#333'} />
   </TouchableOpacity>
   <TouchableOpacity onPress={() => handlePressWeb(negocio.web_negocio)}>
 <Ionicons name="globe-outline" size={24} color=  {theme === 'dark' ? '#67e8dc' : '#333'} />
  </TouchableOpacity>
  

</View>

    </View>
  </Callout>
</Marker>
  )
)}

</MapView>

    )}
     <Text style={styles.modalTextmapas}>Esta aplicación necesita acceso a tu ubicación para mostrar el mapa.</Text>
     <TouchableOpacity onPress={handlePressmapa}>
     <Text style={styles.text}>Presiona aqui para abrir la configuración</Text>
    </TouchableOpacity>
</Modalize>


<Animated.View style={[styles.headerContaineri, { height: headerHeight, opacity: headerOpacity }]}>
  <TouchableOpacity onPress={openModal} style={styles.iconButton}>
    <Ionicons name="person-circle-outline" size={42} color={theme === 'dark' ? '#EEEEEE' : '#333'} />
  </TouchableOpacity>
  <TextInput
    placeholder="Buscar Negocio o Ciudad..."
    placeholderTextColor={theme === 'dark' ? '#888' : '#888'}
    value={searchText}
    onChangeText={setSearchText}
    style={[styles.input, { fontSize: 16 }]}
  />
    {searchText ?
    (<TouchableOpacity onPress={() => setSearchText('')} style={styles.clearButton}>
      <Ionicons name="close-circle" size={24} color={theme === 'dark' ? '#EEEEEE' : '#333'} />
    </TouchableOpacity>) : null
  }
</Animated.View>



<View style={styles.buttonContainer}>
  
<Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
<TouchableOpacity onPress={() => {
  getLocationAndUpdateSearch();
  stopBreathingAnimation(); // Detiene la animación cuando se presiona el botón
}} style={[styles.button, styles.leftButton]}>

    <Ionicons name="location-outline" size={30} color={theme === 'dark' ? 'white' : '#333'} />
    <Animated.Text style={[styles.buttonText, { opacity: buttonTextOpacity }]}>
      Mi ubicación
    </Animated.Text>
  </TouchableOpacity>
  </Animated.View>


  <TouchableOpacity onPress={handlePress} style={[styles.button, styles.rightButton]}>
    <Ionicons name="map-outline" size={26} color={theme === 'dark' ? 'white' : '#333'} />
    <Animated.Text style={[styles.buttonText, { opacity: buttonTextOpacity }]}>
      Ver mapa
    </Animated.Text>
  </TouchableOpacity>

  <TouchableOpacity onPress={openMapModalfavoritos} style={[styles.button, styles.rightButton]}>
  <Animated.View style={{
    transform: [{ scale: scaleAnime }],
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  }}>
    <Ionicons
      name={favoritos.length > 0 ? "heart" : "heart-outline"}
      size={28}
      color={theme === 'dark' ? 'white' : '#333'}
    />
    <Animated.Text style={[styles.buttonText, { opacity: buttonTextOpacity, marginTop: 4 }]}>
      Favoritos
    </Animated.Text>
  </Animated.View>
</TouchableOpacity>


</View>


<Modalize
                ref={modalizeRef}
                modalHeight={modalHeight}
                overlayStyle={styles.overlay}
                handleStyle={styles.handle}
                handlePosition="inside"
                modalStyle={{ backgroundColor: theme === 'dark' ? '#110c37' : '#fffbd5' }}
                onClosed={closeModal} // Agrega el evento onClosed para resetear el estado
            >
    <LinearGradient
      colors={gradientColors}
      style={styles.modalView}
    >
      <View style={styles.switchContainer}>
        <TouchableOpacity onPress={toggleTheme}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Ícono de sol */}
            {theme === 'dark' ? (
              <Ionicons name="sunny-outline" size={24} color="yellow" />
            ) : (
              // Ícono de luna
              <Ionicons name="moon-outline" size={24} color="gray" />
            )}
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContent}>
<TextoAnimadoFidelize/>
  </View>
      <Image source={exampleImage} style={styles.yourImageStyle} />
      <Text style={styles.modalText}>¿A dónde quieres ir?</Text>
      <TouchableOpacity style={styles.buttones} onPress={() => onChoose('Usuario')}>
  <Ionicons name="person" size={24} color={theme === 'dark' ? '#f0f0f0' : 'black'} />
  <Text style={[styles.buttonText, {color: theme === 'dark' ? '#f0f0f0' : 'black'}]}>Usuario</Text>
</TouchableOpacity>
<TouchableOpacity style={styles.buttones} onPress={() => onChoose('Negocios')}>
  <Ionicons name="business" size={24} color={theme === 'dark' ? '#f0f0f0' : 'black'} />
  <Text style={[styles.buttonText, {color: theme === 'dark' ? '#f0f0f0' : 'black'}]}>Negocio</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.buttoneso} onPress={() =>  setIsModalOpened(false) }>
  <Ionicons name="restaurant-outline" size={28} color={theme === 'dark' ? '#5bdfd3' : 'black'} />
  <Text style={[styles.buttonTextos, {color: theme === 'dark' ? '#5bdfd3' : 'black'}]}>Menüs de el dia</Text>
</TouchableOpacity>


    </LinearGradient>
    </Modalize>

    <Modalize
                ref={favoritosModalRef}
                modalHeight={modalHeight}
                overlayStyle={styles.overlay}
                modalStyle={{ backgroundColor: theme === 'dark' ? '#110c37' : '#bad9d6' }}
                onClosed={closeMapModalfavoritos} // Agrega el evento onClosed para resetear el estado
            >
  <FlatList
    data={favoritos}
    renderItem={({ item }) => (
      <View style={styles.menuItem}>
        
                         <LinearGradient
                            colors={theme === 'dark' ? ['#2c3e50', '#3d3d3d'] : ['#bad9d6', '#cacddb']} // Gradiente ajustado según el tema
                            style={styles.gradientBackground}>
                        
                            <Image
                              source={item.imagen_url ? { uri: item.imagen_url } : defaultAvatar}
                              style={styles.negocioAvatarStyle}
                            />
                            <View style={styles.header}>
                              <Text style={styles.menuBusiness}>{item.nombre_negocio}</Text>
                              
                            </View>

  <TouchableOpacity
          onPress={() => {
            setSearchText(item.nombre_negocio);
            favoritosModalRef.current?.close();
          }}
          style={styles.favoriteIconeplus}
        >
          <Ionicons name="add" size={36}  color=  {theme === 'dark' ? '#5bdfd3' : '#075f57'} />
        </TouchableOpacity>
                          </LinearGradient>

      </View>
    )}

  />
</Modalize>

    <Animated.ScrollView
  style={styles.scrollViewStyle}
  contentContainerStyle={styles.contentContainerStyle}
  scrollEnabled={!isModalOpened}
  onScroll={Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  )}
  scrollEventThrottle={16} // Ajusta según sea necesario para la suavidad
>
  
{filteredMenus.length > 0 ? (
  <FlatList
    data={negociosConMenus} // Suponiendo que este es tu nuevo arreglo de negocios con menús agrupados
    renderItem={({ item: negocio }) => (
      <View style={styles.menuItemese}>
                  <View style={styles.contactIconses}>
                  <TouchableOpacity onPress={() => handlePressEmail(negocio.email_negocio)} style={styles.iconButtones}>
  <Ionicons name="mail-outline" size={24} color={theme === 'dark' ? '#5bdfd3' : '#075f57'} />
</TouchableOpacity>
<TouchableOpacity onPress={() => handlePressPhone(negocio.telefono_negocio)} style={styles.iconButtones}>
  <Ionicons name="call-outline" size={24} color={theme === 'dark' ? '#5bdfd3' : '#075f57'} />
</TouchableOpacity>
<TouchableOpacity onPress={() => handlePressWeb(negocio.web_negocio)} style={styles. iconButtones}>
  <Ionicons name="globe-outline" size={24} color={theme === 'dark' ? '#5bdfd3' : '#075f57'} />
</TouchableOpacity>
<TouchableOpacity onPress={() => toggleFavorito(negocio)}  style={styles. iconButtones}>
      <Ionicons
          name={favoritos.some(fav => fav.nombre_negocio === negocio.nombre_negocio) ? "heart" : "heart-outline"}
          size={26}
          color="red"
      />
    </TouchableOpacity>

              </View>
              
           <Image
                  source={negocio.imagen_url ? { uri: negocio.imagen_url } : defaultAvatar}
                  style={{ width: 70, height: 70, borderRadius: 50 }}
                />
<View style={{ margin: 10 }}>
  <View style={{ flexDirection: 'row', alignItems: 'center', }}>
    <Text style={styles.menuBusiness}>{negocio.nombre_negocio}</Text>

  </View>
  <TouchableOpacity onPress={() => openMaps(negocio.columna_direccion)}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: -5 }}>
      <Ionicons name="location-outline" size={20}  color={theme === 'dark' ? '#5bdfd3' : '#075f57'}/>
      <Text style={styles.menuAddressfront}>{negocio.columna_direccion}</Text>
    </View>
  </TouchableOpacity>
</View>


        <FlatList
          data={negocio.menus}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: menu }) => (
            
            <View style={{ marginRight: 20 }}>

              <View style={styles.menuItemes}>
              <Text style={styles.menuBusinessfecha}>{menu.fecha}</Text>
              <Text style={styles.menuDay}>{menu.dia}</Text>
              <Text style={styles.menuTitle}>{menu.menu}</Text>
              <Text style={styles.menuDetails}>{menu.precio} CHF</Text>
              <Text style={styles.menuPromotion}>{menu.promocion_negocio}</Text>
              <View style={styles.compartirContenedor}>
  <TouchableOpacity onPress={() => compartirMenu(menu)} style={styles.shareIcon}>
    <Ionicons name="share-social-outline" size={24} color={theme === 'dark' ? '#5bdfd3' : '#075f57'} />
  </TouchableOpacity>
</View>
              </View>
    
              </View>
          )}
          keyExtractor={(menu) => menu.id.toString()}
        />
      </View>
    )}
    keyExtractor={(negocio, index) => index.toString()}
  />
) : (
  <Text style={styles.noMenusText}>No hay menús disponibles.</Text>
)}

     <View style={{ height: 50 }}></View> 
     </Animated.ScrollView>
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
    width: '110%',
  },
  contentContainerStyle: {
    alignItems: 'center', // Centra los hijos horizontalmente
    justifyContent: 'start', // Alinea los hijos al inicio del ScrollView
  },
  userInfoContainer: {
    marginBottom: 20,
    backgroundColor: theme === 'dark' ? '#222831' : 'white',
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
    color: theme === 'dark' ? '#b8b8b8' : '#b8b8b8',
    fontWeight: 'bold', // Agrega un poco de grosor al texto para mejorar la legibilidad
    marginLeft: -20,

  },
  changePasswordButton: {
    backgroundColor: '#0000ff',
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
    color: theme === 'dark' ? '#18d8d8' : '#067b7b',
    textAlign: 'center',
    fontWeight: 'bold', // Agrega un poco de grosor al texto para mejorar la legibilidad
    marginTop: 10,
    fontFamily: 'Poppins-Regular',
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
  },
  
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: '90%',
    marginBottom: 40,
    borderWidth: 1,
    borderColor: theme === 'dark' ? '#a1a1a1' : 'black',
    color: theme === 'dark' ? 'white' : 'black', // Cambia el color del texto del input basado en el tema
    padding: 10,
    borderRadius: 50,
    marginTop: 40,
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
    minWidth: '100%',

  },
  negocioAvatarStyle: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginRight: 10,
  },
  negocioNombreStyle: {
    fontSize: 21,
    color: theme === 'dark' ? '#ffffff' : '#000000',
  },
  negociodireccioneStyle: {
    fontSize: 16,
    color: theme === 'dark' ? '#c6c6c6' : '#000000',
  },


  pointItem: {
    fontWeight: 'bold',
    fontSize: 24, // Tamaño de fuente grande para los puntos
    color: theme === 'dark' ? '#18d8d8' : '#067b7b',
    marginBottom: 5, // Espacio entre los puntos y el texto promocional
    marginLeft: 20, // Ajusta según necesites
    marginBottom: 30, // Espacio entre cada item de puntos

  },
  textoPromocionalStyle: {
    fontSize: 14, // Ajusta según necesites
    color: theme === 'dark' ? '#8e8e8e' : '#067b7b',
    textAlign: 'center', // Asegúrate de que el texto esté centrado
    marginTop: 5, // Ajusta según necesites
    marginBottom: 15, // Ajusta según necesites
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
  top: 52, // Ajusta según sea necesario para tu layout
  right: 10, // Ajusta según sea necesario para tu layout
  zIndex: 1, // Asegúrate de que el switch se muestre por encima de otros elementos si es necesario
},
pointItemContainer: {
  backgroundColor: theme === 'dark' ? '#191e2585' : '#ececec', // Cambia el fondo del input basado en el tema
  padding: 15, // Espacio dentro del contenedor
  borderRadius: 10, // Bordes redondeados
  marginBottom: 15, // Espacio entre cada item de puntos


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
  backgroundColor: theme === 'dark' ? '#0f0c29' : 'white', // Cambia el fondo del modal según el tema
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
  fontFamily: 'Poppins-ExtraBold',
},
iconButton: {
  // Aquí tus estilos, por ejemplo:
  marginHorizontal: 10,
  padding: 10,

  // Ajusta estos valores según necesites
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
  fontSize: 20, // Aumenta el tamaño del texto
  marginLeft: 10, // Espacio entre el icono y el texto
  fontFamily: 'Poppins-Regular',
},
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
modalTextmapas: {
  marginBottom: 15,
  textAlign: "center",
  color: theme === 'dark' ? 'black' : '#333',
  marginTop: 60,
  fontSize: 21,
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
  fontFamily: 'Poppins-ExtraBold',
  marginTop: -200,
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},
button: {
  borderRadius: 20,
  padding: 10,
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 10,
   marginTop: -20,
   marginRight: 3,
},

buttones: {
  flexDirection: 'row',
  borderRadius: 20,
  padding: 10,
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 10,
  width: 200, // Ajusta según tus necesidades
  borderWidth: 1,
  borderColor: theme === 'dark' ? '#f0f0f0' : '#333', // Añade un borde para resaltar la imagen del avatar

},
buttoneso: {
  flexDirection: 'row',
  borderRadius: 20,
  padding: 10,
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 10,
  width: 250, // Ajusta según tus necesidades
  borderWidth: 1,
  borderColor: theme === 'dark' ? '#5bdfd3' : '#333', // Añade un borde para resaltar la imagen del avatar
  marginTop: 20,
},

buttonText: {
  color: theme === 'dark' ? '#5bdfd3' : '#333',
  marginLeft: 10,
  fontSize: 18,
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},

buttonTextos: {
  color: theme === 'dark' ? '#5bdfd3' : '#333',
  marginLeft: 10,
  fontSize: 23,
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},


headerContaineri: {
  flexDirection: 'row',
  justifyContent: 'center', // Centra los hijos verticalmente
  alignItems: 'center', // Centra los hijos horizontalmente
  padding: 10,
  marginTop: 20,
},
iconButton: {
  marginRight: 10,
},
closeButton: {
  position: 'absolute',
  top: 50,
  left: 20,
},
yourImageStyle: {
  width: 100, // Establece el ancho de tu imagen
  height: 100, // Establece la altura de tu imagen
  resizeMode: 'contain', // Esto hace que la imagen se escale proporcionalmente
  marginVertical: 10, // Añade un margen vertical si es necesario
},
negociodireccioneStyle: {
  fontSize: 14, // Menor que negocioNombreStyle
  color: theme === 'dark' ? '#cccccc' : '#666666', // Asumiendo que quieres un color más claro o oscuro según el tema
},
backgroundImage: {
  flex: 1,
  width: '100%',
  height: '100%',
},
menuItem: {
  borderRadius: 10,
  overflow: 'hidden',
  shadowColor: theme === 'dark' ? '#000' : '#ccc',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: theme === 'dark' ? 0.3 : 0.1,
  shadowRadius: 4,
  elevation: theme === 'dark' ? 5 : 3,
  marginBottom: 20,
  minWidth: '95%',
},

menuItemes: {
  borderRadius: 10,
  overflow: 'hidden',
  shadowColor: theme === 'dark' ? '#000' : '#ccc',
  backgroundColor: theme === 'dark' ? '#2d4b73e6' : '#f8f8f8', // Cambia el fondo del input basado en el tema
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: theme === 'dark' ? 0.3 : 0.1,
  shadowRadius: 4,
  elevation: theme === 'dark' ? 5 : 3,
  marginBottom: 20,
  maxWidth: 300,
  minHeight: 260,
  padding: 15,
},
menuItemese: {
  borderRadius: 10,
  overflow: 'hidden',
  shadowColor: theme === 'dark' ? '#000' : '#ccc',
  backgroundColor: theme === 'dark' ? '#253d5de6' : '#ececec', // Cambia el fondo del input basado en el tema
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: theme === 'dark' ? 0.3 : 0.1,
  shadowRadius: 4,
  elevation: theme === 'dark' ? 5 : 3,
  marginBottom: 20,
  maxWidth: 340,
  minHeight: 300,
  padding: 10,
},

gradientBackground: {
  padding: 15,
  borderRadius: 10,
},
// 
negocioAvatarStyle: {
  width: 60,
  height: 60,
  borderRadius: 30,
  marginBottom: 10,
},
header: {
  flexDirection: 'column',
  marginBottom: 10,
},
menuBusiness: {
  fontSize: 23,
  fontWeight: 'bold',
  color: theme === 'dark' ? '#EEEEEE' : '#333',
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},
menuBusinessfecha: {
  fontSize: 21,
  fontWeight: 'bold',
  color: theme === 'dark' ? '#EEEEEE' : '#333',
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},
menuAddressfront: {
  fontSize: 16,
  color: theme === 'dark' ? '#EEEEEE' : '#333',
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
  marginTop: 5,
},
menuDate: {
  fontSize: 14,
  color: theme === 'dark' ? '#EEEEEE' : '#333',
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},
modalTextfavo: {
  fontSize: 21,
  color: theme === 'dark' ? '#cccccc' : '#333',
  fontFamily: 'Poppins-Regular',
  marginBottom: 5,
  textAlign: 'center',
  marginTop: 40,
},
menuDay: {
  fontSize: 21,
  color: theme === 'dark' ? '#EEEEEE' : '#333',
  fontFamily: 'Poppins-Bold',
  fontWeight: 'bold',
  marginBottom: 5,
},
menuTitle: {
  fontSize: 17,
  fontWeight: 'bold',
  color: theme === 'dark' ? '#EEEEEE' : '#333',
  marginBottom: 5,
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},

menuDetails: {
  fontSize: 14,
  color: theme === 'dark' ? '#EEEEEE' : '#333',
  marginBottom: 5,
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},
menuPromotion: {
  fontSize: 14,
  color: theme === 'dark' ? '#5bdfd3' : '#075f57',
  fontStyle: 'italic',
marginTop: 20,
marginBottom: 10,
fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
textAlign: 'center',
},
menuPromotionnombre: {
  fontSize: 23,
  color: theme === 'dark' ? '#EEEEEE' : 'black',
  fontWeight: 'bold',
  fontStyle: 'italic',
  padding: 5,
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},
menuPromotiondireccion: {
  fontSize: 16,
  color: theme === 'dark' ? '#EEEEEE' : 'black',
  fontStyle: 'italic',
  padding: 5,
  marginBottom: -25,
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},
contactIconses: {
position: 'absolute',
  justifyContent: 'space-around', // Distribuye el espacio de manera uniforme entre los íconos
   top: 10,
   right: 0,
   flexDirection: 'row', // Alinea los íconos horizontalmentes
  
},

contactIcons: {
  flexDirection: 'row', // Alinea los íconos horizontalmente
  justifyContent: 'space-around', // Distribuye el espacio de manera uniforme entre los íconos
},
backgroundImage: {
  flex: 1,
  width: '100%',
  height: '100%',
  
},
negocioAvatarStyle: {
  width: 60,
  height: 60,
  borderRadius: 25,
  marginRight: 10,
},
  map: {
    width: windowWidth,
    height: windowHeight,
  },
    customMarker: {
    width: 50, // Puedes ajustar estas dimensiones según necesites
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 2, // Opcional: si quieres un borde alrededor del avatar
    borderColor: 'white', // Opcional: el color del borde
  },
  customCallout: {
    borderRadius: 10,
    padding: 5,
    width: 320, // Ajusta el ancho según necesites
    height:280, // Ajusta el alto según necesites
   backgroundColor: theme === 'dark' ? '#303062' : '#fffbd5',
  },
  calloutView: {
    // Estilos para la vista contenedora dentro del Callout
  },
  calloutTitle: {
    fontWeight: 'bold',
    // Estilos adicionales para el título
  },
  calloutText: {
    // Estilos para el texto promocional
  },
  text: {
    textAlign: 'center',
    color: theme === 'dark' ? '#0000ff' : 'black',
    
  },
  menuPromotionmapa: {
    fontSize: 14,
    marginBottom: 5,
    color: theme === 'dark' ? '#67e8dc' : '#009688', // Asumiendo que quieres un color más claro o oscuro según el t
    textAlign: 'center',
    padding: 5,
    marginTop: 30,
    fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
  },
  moreButtonText: {
    color: theme === 'dark' ? '#EEEEEE' : 'black',
    position: 'absolute',
    right: 30,
    fontSize: 16,
    

  },

  moreButtonTexticono: {
    color: theme === 'dark' ? '#EEEEEE' : 'black',
    position: 'absolute',
    right: 0,
    fontSize: 16,
    fontWeight: 'bold',
    right: 5,

  },
  buttonContainer: {
    flexDirection: 'row', // Alinea los botones horizontalmente
    justifyContent: 'space-around', // Añade espacio entre los botones
    alignItems: 'center', // Centra los botones verticalmente
    justifyContent: 'center', // Centra los hijos verticalmente
    marginLeft: -10, // Ajusta el margen izquierdo para separar los botones del borde
  },

  leftButton: {
    marginRight: 10, // Ajusta el margen derecho para separarlo del botón de la derecha
  },
  rightButton: {
    marginLeft: 10, // Ajusta el margen izquierdo para separarlo del botón de la izquierda
  },
  buttonText: {
    marginLeft: 8, // Asegura un poco de espacio entre el ícono y el texto
    fontSize: 15, // Ajusta el tamaño del texto según necesites
    color: theme === 'dark' ? '#EEEEEE' : 'black',
    fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
   marginTop: -200,
  },
  favoriteIcon: {
    position: 'absolute', // Posicionamiento absoluto respecto a su contenedor más cercano con position: 'relative'
    right: 20, // Ajusta la distancia desde la derecha según necesites
    top: 20, // Ajusta la distancia desde la parte superior según necesites
    // Puedes añadir más estilos al botón si es necesario
  },
  favoriteIconeplus: {
    position: 'absolute', // Posicionamiento absoluto respecto a su contenedor más cercano con position: 'relative'
    right: 18, // Ajusta la distancia desde la derecha según necesites
    top: 60, // Ajusta la distancia desde la parte superior según necesites
    // Puedes añadir más estilos al botón si es necesario
  },
  centeredViewfavo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalViewfavo: {
    margin: 20,
    backgroundColor: theme === 'dark' ? '#303062' : '#fffbd5',
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
  compartirContenedor: {
    flex: 1, // Usa flex para ocupar el espacio disponible
    justifyContent: 'center', // Centra el contenido a lo largo del eje principal (verticalmente)
    alignItems: 'center', // Centra el contenido a lo largo del eje transversal (horizontalmente)
    // Asegúrate de que este contenedor tenga dimensiones si no está dentro de otro contenedor flex
    height: '100%', // Puedes ajustar esto según sea necesario
    width: '100%',
  },
  iconButtones: {
    marginTop: 23,
   marginRight: 25, 
  },
});


export default UserProfile;

