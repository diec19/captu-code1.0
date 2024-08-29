// precios.js

import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Alert } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { handleBarCodeScanned } from "../libs/authService";

export default function Precios() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [productInfo, setProductInfo] = useState(null);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  useEffect(() => {
    if (productInfo) {
      Alert.alert("Información del Producto", JSON.stringify(productInfo, null, 2));
    }
  }, [productInfo]);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : (event) => handleBarCodeScanned(event, setScanned, setProductInfo)}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417", "ean13", "upc_a", "upc_e", "code128", "ean8", "code39"],
        }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Top Overlay */}
      <View style={[styles.overlay, styles.topOverlay]} />
      {/* Bottom Overlay */}
      <View style={[styles.overlay, styles.bottomOverlay]} />
      {/* Left Overlay */}
      <View style={[styles.overlay, styles.leftOverlay]} />
      {/* Right Overlay */}
      <View style={[styles.overlay, styles.rightOverlay]} />

      {scanned && (
        <Button title={"Presione para Escanear"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "blue",
  },
  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  topOverlay: {
    top: 0,
    left: 0,
    right: 0,
    height: '25%',
  },
  bottomOverlay: {
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  leftOverlay: {
    top: '50%',
    bottom: '80%',
    left: 0,
    width: '15%',
  },
  rightOverlay: {
    top: '50%',
    bottom: '80%',
    right: 0,
    width: '15%',
  },
});
