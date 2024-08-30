// precios.js

import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Modal, Pressable, ScrollView } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { handleBarCodeScanned } from "../libs/authService";

export default function Precios() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [productInfo, setProductInfo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  useEffect(() => {
    if (productInfo) {
      setModalVisible(true);
    }
  }, [productInfo]);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  // Extract the description and price from productInfo
  const productDetails = productInfo?.objects?.map((item) => ({
    descripcion: item.descripcion,
    precio_publico: item.precio_publico,
  }));

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

      {/* Modal for Product Info */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          setProductInfo(null);  // Reset product info
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Información del Producto</Text>
            <ScrollView>
              {productDetails?.map((item, index) => (
                <View key={index} style={styles.productInfo}>
                  <Text style={styles.modalText}> {item.descripcion}</Text>
                  <Text style={styles.modalTextPrecio}>${item.precio_publico.toFixed(2)}</Text>
                </View>
              ))}
            </ScrollView>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setModalVisible(!modalVisible);
                setProductInfo(null);  // Reset product info
              }}
            >
              <Text style={styles.buttonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '70%',        // Limit height to 70% of the screen
    width: '90%',            // Adjust width if necessary
    position: 'relative',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  productInfo: {
    marginBottom: 5,
  },
  modalText: {
    fontSize: 25,
    marginBottom: 5,
    textAlign: "center",
    
  },
  modalTextPrecio: {
    fontSize: 30,
    marginBottom: 5,
    color:"red",
    fontWeight: "bold",
    textAlign: "center",
   
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 10,
    
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
