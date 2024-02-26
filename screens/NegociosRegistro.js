import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Modal, Text, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useTheme } from './ThemeContext'; // Asegúrate de que la ruta sea correcta
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const enviarSolicitudRestablecimiento = async () => {
    try {
      const response = await axios.post('https://mycode.lweb.ch/negocios/enviar_contraseña_nueva.php', {
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
      const response = await axios.post('https://mycode.lweb.ch/negocios/enviar_codigo_verificacion.php', {
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
            await AsyncStorage.setItem('usuarioEmail', email); // Guarda el email del usuario
            await AsyncStorage.setItem('usuarioNombre', nombre); // Guarda el nombre del usuario
            Alert.alert('Éxito', 'Negocio registrado exitosamente');
            navigation.navigate('LoginNegocios'); // Asegúrate de que 'LoginNegocios' es la ruta correcta
        } else {
            Alert.alert('Error', response.data.error || 'No se pudo registrar el negocio');
        }
    } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Ocurrió un error durante el registro');
    }
};


const navegarALogin = () => {
  navigation.navigate('LoginNegocios');
};


  return (
    <View style={styles.container}>

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
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <Button title="Enviar" onPress={enviarSolicitudRestablecimiento} />
    </View>
  </View>
</Modal>
<TextInput
  placeholder="Nombre"
  value={nombre}
  onChangeText={setNombre}
  placeholderTextColor={theme === 'dark' ? '#EEEEEE' : '#888'} // Asegúrate de aplicar este cambio a todos los TextInput
  style={styles.input}
/>

<TextInput
  placeholder="Email"
  value={email}
  onChangeText={setEmail}
  placeholderTextColor={theme === 'dark' ? '#EEEEEE' : '#888'} // Ajusta los colores según necesites
  style={styles.input}
/>

<TextInput
  placeholder="Contraseña"
  value={contraseña}
  onChangeText={setContraseña}
  secureTextEntry
  placeholderTextColor={theme === 'dark' ? '#EEEEEE' : '#888'} // Usa un color claro para el tema oscuro y un gris para el tema claro
  style={styles.input}
/>

      <Button
        title={botonPresionado ? "Reenviar Código" : "Enviar Código"}
        onPress={enviarCodigoVerificacion}
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
            value={pagina_web}
            onChangeText={setPaginaWeb}
            style={styles.input}
        />
        <TextInput
  placeholder="Texto Promocional"
  value={textoPromocional}
  onChangeText={setTextoPromocional}
  placeholderTextColor={theme === 'dark' ? '#EEEEEE' : '#888'}
  style={styles.input}
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
        <Button title="Registrarse" onPress={verificarCodigo} />
      )}
<Button title="¿Estás registrado? Inicia sesión aquí" onPress={navegarALogin} />    
      <Button title="¿Olvidaste tu contraseña?" onPress={() => setModalRestablecerVisible(true)} />
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
  input: {
    width: '80%',
    height: 50,
    margin: 12,
    borderWidth: 1,
    borderColor: theme === 'dark' ? '#393E46' : '#007bff',
    padding: 10,
    borderRadius: 10,
    backgroundColor: theme === 'dark' ? '#222831' : 'white',
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
  // Asegúrate de adaptar o añadir más estilos según sea necesario
});


export default Registro;
