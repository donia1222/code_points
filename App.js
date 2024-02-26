import React from 'react';
import AppNavigation from './AppNavigation'; // Asegúrate de que la ruta sea correcta
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './screens/ThemeContext'; // Asegúrate de que la ruta sea correcta


function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1,  }}>
      <ThemeProvider>
      <AppNavigation />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export default App;