// precios.js

import React, { useState, useEffect,useCallback, useRef, useMemo } from "react";
import { Text, View, StyleSheet, Button, Modal, Pressable, ScrollView,TextInput } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { handleBarCodeScanned } from "../libs/authService";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet from "@gorhom/bottom-sheet";
import Icon from 'react-native-vector-icons/MaterialIcons';




export default function Precios() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [productInfo, setProductInfo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [productCode, setProductCode] = useState("");

  const BottomSheetref = useRef(null);
  const snapPoints = useMemo(()=>["1%","1%","80%"])

 
 

  useEffect(() => {    //detecta un evento de permiso de camara
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  useEffect(() => {   //para el modal
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

  const handleCloseAction=()=>BottomSheetref.current?.close();
  const handleOpenPress=()=>BottomSheetref.current?.expand();

  const handleSearch = () => {
   // Lógica para buscar el producto por código en la base de datos simulada
   const foundProduct = productsDatabase.find(product => product.code === productCode);

   if (foundProduct) {
     // Si el producto es encontrado, actualiza el estado
     setProductInfo({ objects: [foundProduct] });
   } else {
     // Si el producto no es encontrado, muestra un mensaje de error
     alert("Producto no encontrado.");
   }
   
   // Cierra el BottomSheet después de la búsqueda
   BottomSheetref.current?.close();
  };

  const productDetails = productInfo?.objects?.map((item) => ({  //recoore y extrae el precio y descripcion del producto
    descripcion: item.descripcion,
    precio_publico: item.precio_publico,
  }));

  return (
    <GestureHandlerRootView style={{flex:1}}>
      
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

       {/* Botón con ícono redondeado */}
       <Pressable style={styles.floatingButton} onPress={handleOpenPress}>
          <Icon name="add" size={30} color="#fff" />
        </Pressable>

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
      
      <View>  
     </View>
    
      
      </View>
      <BottomSheet
        
        ref={BottomSheetref}
        index={1}
        snapPoints={snapPoints}
        backgroundStyle={{backgroundStyle:"#fff"}}
      
      >      
          <View style={styles.bottomSheetContent}>
            <Text style={styles.bottomSheetTitle}>Buscar Producto</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese el código del producto"
              value={productCode}
              onChangeText={setProductCode}
            />
            <Button title="Buscar" onPress={handleSearch} />
            <Button title="Cerrar" onPress={handleCloseAction} />
          </View>
      </BottomSheet>
      </GestureHandlerRootView>
     
    
      
    
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
    borderRadius: 20,
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

  floatingButton: {
    position: 'absolute',
    bottom: 300,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  }


});
