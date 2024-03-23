import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ImageBackground} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Asegúrate de importar useNavigation
import { useTheme } from './ThemeContext'; // Importa useTheme de tu ThemeContext
import LinearGradient from 'react-native-linear-gradient';
const categories = [
    {
        name: 'Escanear Código QR',
        icon: 'qr-code',
        description: 'Escanea códigos QR de clientes para otorgar puntos automáticamente.',
      },
      {
        name: 'Promociones',
        icon: 'gift',
        description: 'Crea promociones basadas en puntos para incentivar las compras recurrentes.',
      },
    {
      name: 'Gestión de Menús',
      icon: 'restaurant',
      description: 'Añade y actualiza los menús diarios, incluyendo precios y descripciones.',
    },

    {
      name: 'Perfil del Restaurante',
      icon: 'business',
      description: 'Actualiza la información de tu restaurante, incluyendo contacto y dirección.',
    },
    {
      name: 'Historial de Clientes',
      icon: 'time',
      description: 'Consulta el historial de clientes a los que has otorgado puntos.',
    },

  ];
  
const CategoryList = () => {
  const navigation = useNavigation(); // Usa el hook useNavigation para acceder a la navegación
  const gradientColors = theme === 'dark' ? ['#16142ced', '#322d6ded', '#24243e69'] : ['#fffbd5', '#8a96cbdb', '#8a96cb6b'];
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (

    <LinearGradient
    colors={gradientColors}
    style={styles.container}
  >
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={styles.container}>
        {categories.map((category, index) => (
          <View key={index} style={styles.item}>
            <Ionicons name={category.icon} size={60} color={theme === 'dark' ? '#322d6ded' : '#322d6ded'} style={styles.icon} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{category.name}</Text>
              <Text style={styles.description}>{category.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      {/* Botón redondo fijo en la esquina superior derecha */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('NegociosLogin')}
      >
        <Ionicons name="arrow-back-circle" size={50} color={theme === 'dark' ? '#322d6ded' : '#322d6ded'} />
      </TouchableOpacity>
    </SafeAreaView>
    </LinearGradient>

  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
   paddingTop: 50,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    marginTop:10,
  },
  icon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,

  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
    color: theme === 'dark' ? '#322d6ded' : '#322d6ded',
    fontFamily: 'Poppins-Regular', 
  },
  description: {
    fontSize: 16,
    color: theme === 'dark' ? 'black' : 'black',
    marginTop: 4,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    borderRadius: 25, // Hace el botón completamente redondo
    padding: 5, // Espaciado interno para asegurar que el icono no toque los bordes
    marginTop:-20,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default CategoryList;
