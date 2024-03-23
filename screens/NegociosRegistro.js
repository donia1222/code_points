import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Modal, Text, Image, TouchableOpacity, Dimensions, ImageBackground} from 'react-native';
import axios from 'axios';
import { useTheme } from './ThemeContext'; // Asegúrate de que la ruta sea correcta
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Modalize } from 'react-native-modalize';
import headerImage from './maletin.png'; 
import LinearGradient from 'react-native-linear-gradient';

const Registro = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [direccion, setDireccion] = useState('');
const [telefono, setTelefono] = useState('');
const [pagina_web, setPaginaWeb] = useState('');
  const [codigoVerificacion, setCodigoVerificacion] = useState('');
  const [mostrarBotonRegistro, setMostrarBotonRegistro] = useState(false);
  const [botonPresionado, setBotonPresionado] = useState(false); // Estado para el cambio de texto del botón
  const [modalRestablecerVisible, setModalRestablecerVisible] = useState(false);
  const [avatar, setAvatar] = useState(null); // Estado para almacenar la URI de la imagen
  const { theme } = useTheme();
  const styles = getStyles(theme); // Aplica los estilos basados en el tema
  const [textoPromocional, setTextoPromocional] = useState('');
  const modalizeRef = useRef(null);
  const [isModalOpened, setIsModalOpened] = useState(false); // Nuevo estado para controlar la apertura del modal
  const { themes, toggleTheme } = useTheme();
  const screenHeight = Dimensions.get('window').height;
  const [contraseñaRepetida, setContraseñaRepetida] = useState('');
  const modalHeight = screenHeight * 0.75;
  const gradientColors = theme === 'dark' ? ['#16142ced', '#322d6ded', '#24243e69'] : ['#fffbd5', '#2f8080a3', '#fffbd54f'];
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
      const response = await axios.post('https://mycode.lweb.ch/negocios/enviar_contrasena_nueva.php', {
        email,
      });
  
      if (response.data.message === 'Nueva contraseña enviada') {
        Alert.alert('Éxito', 'Revisa tu correo electrónico para obtener tu nueva contraseña', [
          { text: 'OK', onPress: () => navigation.navigate('Negocios') },
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
    if (contraseña !== contraseñaRepetida) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }
  
    try {
      const response = await axios.post('https://mycode.lweb.ch/negocios/verificar_codigo.php', {
        email,
        codigo: codigoVerificacion,
      });
  
      if (response.data.message === 'Verificación exitosa') {
        registrarNegocio();
      } else {
        Alert.alert('Error', 'Código de verificación incorrecto');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Ocurrió un error al verificar el código');
    }
  };
  
  const registrarNegocio = async () => {
    try {
        const response = await axios.post('https://mycode.lweb.ch/negocios/registro.php', {
            nombre,
            email,
            contraseña,
            direccion,
            telefono,
            pagina_web,
            avatar, 
            texto_promocional: textoPromocional, // Incluye el campo de texto promocional aquíckend
        });

        if (response.data.message === 'Registro exitoso del negocio') {
          await AsyncStorage.setItem('usuarioEmail', email); // Esto ya está
          await AsyncStorage.setItem('usuarioNombre', nombre); // Esto ya está
          // Almacenar también el email y la contraseña para el inicio de sesión
          await AsyncStorage.setItem('ultimoEmailRegistrado', email);
          await AsyncStorage.setItem('ultimaContraseñaRegistrada', contraseña);
          Alert.alert('Éxito', 'Negocio registrado exitosamente');
          navigation.navigate('NegociosLogin', {
              email: email,
              contraseña: contraseña
          }); // Pasar como parámetros
      }
    } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Ocurrió un error durante el registro');
    }
};


const navegarALogin = () => {
  navigation.navigate('Negocios');
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

               <Text style={styles.modalTextheader}>Bussines Login</Text>
               <Image
          source={headerImage} // Usando la imagen importada
          style={styles.headerImage}
        />
              
              <LinearGradient
  colors={theme === 'dark' ? ['#009688', '#24243e'] : ['#009688', '#858585']} // Gradientes para tema oscuro y claro
  start={{x: 0, y: 0}}
  end={{x: 1, y: 0}}
  style={styles.botonGradiente}
>
  <TouchableOpacity onPress={openModal} style={styles.botonTransparente}>
    <Text style={styles.textoBotonGradiente}>Registrate aquí como Negocio</Text>
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
                  <LinearGradient
    colors={gradientColors}
  >
 <View style={styles.containerimputs}> 

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
  placeholderTextColor={theme === 'dark' ? '#888' : '#888'} // Usa un color claro para el tema oscuro y un gris para el tema claro
  style={styles.input}
/>
<TextInput
  placeholder="Repetir Contraseña"
  value={contraseñaRepetida}
  onChangeText={setContraseñaRepetida}
  secureTextEntry
  placeholderTextColor={theme === 'dark' ? '#888' : '#888'}
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
        placeholderTextColor={theme === 'dark' ? '#EEEEEE' : '#888'} // Mantén consistencia en el color del placeholder
        style={styles.input}
      />
      
          )}

{mostrarBotonRegistro && (
  <TouchableOpacity style={styles.botonModern} onPress={verificarCodigo}>
    <Text style={styles.textoBoton}>Registrarse</Text>
  </TouchableOpacity>
)}
</View>
</LinearGradient>
</Modalize>

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
    marginTop: 20,
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
    color: theme === 'dark' ? '#EEEEEE' : '#333',
    fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
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
    fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
  },
  text: {
    color: theme === 'dark' ? '#EEEEEE' : '#333', // Texto blanco para modo oscuro, negro para modo claro
    fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
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
    backgroundColor: theme === 'dark' ? '#1c1c1c' : 'white', // Cambia el fondo del contenido del modal según el tema
    borderRadius: 50,
},
modalContainer: { // Estilo para el CONTENEDOR del modal
    backgroundColor: theme === 'dark' ? '#24243e' : '#fffbd5', // Cambia el fondo del modal según el tema
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
  color: theme === 'dark' ? '#5bdfd3' : '#333',
  fontSize: 32,
  marginBottom: 50,
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
},
botonModern: {
  paddingVertical: 5,
  borderRadius: 25,
  alignItems: 'center',
  marginVertical: 5, // Espacio vertical para separar los botones
},
textoBoton: {
  color: theme === 'dark' ? '#a1a1a1' : '#333', // Texto blanco para modo oscuro, negro para modo claro
  fontSize: 16,
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
backgroundImage: {
  flex: 1,
  width: '100%',
  height: '100%',
},
});


export default Registro;
