import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useTheme } from './ThemeContext'; // Asegúrate de que la ruta sea correcta

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const { theme } = useTheme();
    const styles = getStyles(theme);

    useEffect(() => {
        fetch('https://foodscan-ai.com/obtener_datos.php') // Ruta actualizada al script PHP
            .then(response => response.json())
            .then(data => {
                if (data.message === "Datos obtenidos exitosamente") {
                    setUsuarios(data.data);
                } else {
                    console.log(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    return (
        <ScrollView style={styles.container}>
            {usuarios.map((usuario, index) => (
                <View key={index} style={styles.userContainer}>
                    <Text style={styles.userText}>Nombre: {usuario.nombre}</Text>
                    <Text style={styles.userText}>Email: {usuario.email}</Text>
                    {/* Verifica si la URL de la imagen existe y muestra la imagen */}
                    {usuario.avatar ? (
                        <View style={styles.imageContainer}>
                            <Image 
                                source={{ uri: usuario.avatar }} 
                                style={styles.userImage} 
                            />
                        </View>
                    ) : (
                        <Text style={styles.userText}>No hay imagen disponible</Text>
                    )}
                </View>
            ))}
        </ScrollView>
    );
};
const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: theme === 'dark' ? 'black' : '#f0f0f0',
       paddingTop:80,
    },
    userContainer: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        backgroundColor: theme === 'dark' ? '#393E46' : 'white',
        borderRadius: 5,

        borderRadius: 5,
    },
    userText: {
        fontSize: 16,
        marginBottom: 5,
        color: theme === 'dark' ? '#EEEEEE' : '#333',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 10,
        color: theme === 'dark' ? '#EEEEEE' : '#333',
    },
    userImage: {
        width: 100,
        height: 100,
        borderRadius: 50, // Ajusta para imágenes circulares
    }
});

export default Usuarios;
