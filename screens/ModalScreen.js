import React, { useRef, useState, useEffect } from 'react';
import { View, Button, Text, Dimensions, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';
import { Modalize } from 'react-native-modalize';
import { useTheme } from './ThemeContext'; // Importa useTheme de tu ThemeContext
import { Switch } from 'react-native'; 


function AnimatedStyleUpdateExample(props) {
    const randomWidth = useSharedValue(10);
    const modalizeRef = useRef(null);
    const [isModalOpened, setIsModalOpened] = useState(false); // Nuevo estado para controlar la apertura del modal
    const { theme, toggleTheme } = useTheme();
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

    // Define los estilos aquí para usar el tema
    const styles = getStyles(theme);

    return (
        <View style={styles.container}>
            <Button title="Open Modal" onPress={openModal} />
            <Modalize
                ref={modalizeRef}
                modalHeight={modalHeight}
                modalStyle={styles.modalContainer}
                overlayStyle={styles.overlay}
                handleStyle={styles.handle}
                onClosed={closeModal} // Agrega el evento onClosed para resetear el estado
            >
                <View style={styles.modalContent}> 
                    <Text style={styles.text}>Desliza hacia abajo para cerrar</Text>
                    <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={theme === 'dark' ? "#f5dd4b" : "#f4f3f4"}
          />
                </View>
            </Modalize>
        </View>
    );
}



// Función para aplicar los estilos según el tema
const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: theme === 'dark' ? 'black' : 'white',
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
        backgroundColor: theme === 'dark' ? '#1c1c1c' : 'white', // Cambia el fondo del modal según el tema
    },
    text: {
        color: theme === 'dark' ? 'white' : 'black', // Cambia el color del texto según el tema
    },
});
export default AnimatedStyleUpdateExample;