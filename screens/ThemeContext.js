// En ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // Tema por defecto

  // Esta función se llama cuando queremos cambiar el tema
  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'; // Cambia el tema actual
    setTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme); // Guarda el nuevo tema en AsyncStorage
  };

  // Efecto para cargar el tema guardado cuando la aplicación inicia
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme); // Si hay un tema guardado, lo establece
      }
    };

    loadTheme();
  }, []); // El array vacío asegura que este efecto se ejecute una vez

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
