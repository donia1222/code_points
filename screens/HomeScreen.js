import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import axios from 'axios';

const AnalizarCodigo = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setShowCamera(false); // Cierra la cámara después de escanear
    fetchUserData(data);
  };

  const fetchUserData = async (qrCodeIdentifier) => {
    try {
      const response = await axios.get(`http://mycode.lweb.ch/obtener_qr.php?qrCodeIdentifier=${encodeURIComponent(qrCodeIdentifier)}`);
      if (response.data.success) {
        setUserData(response.data.data);
      } else {
        alert('Usuario no encontrado');
      }
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      alert('Ocurrió un error al obtener los datos del usuario');
    }
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso de cámara...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No se tiene acceso a la cámara</Text>;
  }

  return (
    <View style={styles.container}>
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
  {scanned && <Button title={'Tocar para escanear de nuevo'} onPress={() => setScanned(false)} />}
</Camera>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.scanButton} onPress={() => setShowCamera(true)}>
            <Text style={styles.scanButtonText}>Escanear Código QR</Text>
          </TouchableOpacity>
        </View>
      )}
      {userData && (
        <View style={styles.userDataContainer}>
          <Text style={styles.userDataText}>Nombre: {userData.nombre}</Text>
          <Text style={styles.userDataText}>Email: {userData.email}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 20,
  },
  userDataContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
    alignItems: 'center', // Centra el texto en el contenedor
  },
  userDataText: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default AnalizarCodigo;
