import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Text, View, StyleSheet, Button, Modal, Pressable, ScrollView, TextInput, Alert, Keyboard } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import { Vibration } from 'react-native';
import { Audio } from 'expo-av';



import axios from 'axios';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';




export default function Precios() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [productInfo, setProductInfo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [productCode, setProductCode] = useState('');
  const [scannerEnabled, setScannerEnabled] = useState(false); // Nuevo estado


  const BottomSheetref = useRef(null);
  const textInputRef = useRef(null);
  const snapPoints = useMemo(() => ['1%', '1%', '50%'], []);
  const [sound, setSound] = useState(null);

  ///////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync(); // permiso de la camara
      setHasPermission(status === 'granted');
    };
    getCameraPermissions();
  }, []);

  ///////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (productInfo) {
      setModalVisible(true);   //para que aparesca el modal de precios  y descripcion
    }
  }, [productInfo]);
  /////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.focus();   ////focus en buscar
    }
  }, [BottomSheetref.current?.expanded]);
  //////////////////////////////////////////////////////////////////////////////////
  // Vibrar cuando el modal se vuelve visible
  useEffect(() => {
    if (modalVisible) {
      Vibration.vibrate(500); // Vibrar durante 500 ms
    }
  }, [modalVisible]);

  ///////////////////////////////////////////////////////////////////////////////////

  // Cargar y reproducir el sonido
  useEffect(() => {
    const loadAndPlaySound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/beep.mp3') // Asegúrate de que la ruta sea correcta
        );
        setSound(sound);
        await sound.playAsync(); // Reproduce el sonido
      } catch (error) {
        console.error('Error loading or playing sound:', error);
      }
    };

    if (modalVisible) {
      loadAndPlaySound();
    }

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [modalVisible]);
  /////////////////////////////////////////////////////////////////////////


  const handleCloseAction = () => {
    BottomSheetref.current?.close();
    setProductCode('');
  }
  const handleOpenPress = () => BottomSheetref.current?.expand();




  const fetchProductInfo = async (sku) => {
    try {
      const headers = {
        'X-Token': 'mu@3Y7RTumKh^FbEZD?aD9*5qctA$a#3eB*7PKFPp_!FNjgdP!V4Z2w+w5mJ!z7KHUf?y=#6@5Zf7q3#xygTp^#U7M9Lr6-TmbMb+y7!Pe!DNLcGZaR=aTvgabp$Y=Ya#et+_EcJ+Q^-yr3qcw2BPj7r$XxTJ2Zgh^3ZTYWstdUnaFp%jCgq&F=gUN3P_RHecJ&_7jnSYVWgCvj5R_HSX=GwVK=2$czzm$ddZSu-rk8Z!6!FSMN?zB3YzjTz5*zN',
      };
      const url = `http://kcode.californiasa.com.ar:31030/supermercados/api/query/sku?sucursal=7&deposito=7&sku=${sku}`;
      const response = await axios.post(url, null, { headers });
      if (response.data) {
        setProductInfo(response.data); // Guardar el producto escaneado en el estado
      } else {
        Alert.alert('Información', 'No se recibieron datos del servidor.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo obtener la información del producto');
    }
  };

  const handleSearch = () => {
    if (productCode) {
      fetchProductInfo(productCode);
      Keyboard.dismiss(); // Cierra el teclado
    } else {
      Alert.alert('Error', 'Ingrese un código de producto.');
    }
    BottomSheetref.current?.close();
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    fetchProductInfo(data); // Usa el código escaneado para buscar el producto
  };

  const productDetails = productInfo?.objects?.map((item) => ({
    descripcion: item.descripcion,
    precio_publico: item.precio_publico,
    uxb: item.uxb,
    stock: item.stock,
  }));


  const getTextStyle = (value) => ({
    ...styles.modalText,
    color: value < 0 ? 'red' : 'green', // Rojo si negativo, verde si positivo
  });


  const handleButtonPress = () => {
    setScanned(!scanned); // Alterna el estado entre true y false
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'pdf417', 'ean13', 'upc_a', 'upc_e', 'code128', 'ean8', 'code39'],

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

        <Pressable
          style={styles.floatingButton}
          onPress={handleOpenPress}
        >
          <MaterialIcons name="123" size={50} color="black" />
        </Pressable>

        <Pressable style={[styles.floatingButtonA, { backgroundColor: scanned ? 'red' : 'green' }]}
          onPress={handleButtonPress}>
          <Ionicons name="barcode" size={40} color="black" />
        </Pressable>

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
                    <Text style={styles.modalText}>{item.descripcion}</Text>
                    <Text style={styles.modalTextPrecio}>{`$${item.precio_publico.toFixed(2)}`}</Text>
                   
                    <View style={styles.rowContainer}>
                      <View style={styles.tag}>
                        <Text style={styles.tagText}>Stock:</Text>
                      </View>
                      <Text style={getTextStyle(item.stock)}>{item.stock}</Text>
                      <View style={styles.tag}>
                        <Text style={styles.tagText}>UXB:</Text>
                      </View>
                      <Text style={getTextStyle(item.uxb)}>{item.uxb}</Text>
                    </View>
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
        <BottomSheet
          ref={BottomSheetref}
          index={1}
          snapPoints={snapPoints}
          backgroundStyle={{ backgroundColor: '#f8f9fa' }}
          handleIndicatorStyle={styles.handleIndicator}
          onChange={(index) => {
            if (index === 1) {
              setTimeout(() => {
                if (textInputRef.current) {
                  textInputRef.current.focus();
                }
              }, 300); // Delay to ensure the bottom sheet is fully expanded
            }
          }}
        >
          <View style={styles.bottomSheetContent}>
            <Text style={styles.bottomSheetTitle}>Buscar Producto</Text>
            <TextInput
              ref={textInputRef}
              style={styles.input}
              placeholder="Ingrese el código del producto"
              value={productCode}
              onChangeText={setProductCode}
              keyboardType="numeric" // Solo números
              maxLength={14} // Opcional: limitar la longitud del código
            />
            <Pressable
              style={styles.button}
              onPress={handleSearch}
            >
              <Text style={styles.buttonText}>Buscar</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={handleCloseAction}


            >
              <Text style={styles.buttonText}>Cerrar</Text>
            </Pressable>
          </View>
        </BottomSheet>
      </View>
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
    fontSize: 20,
    marginBottom: 5,
    textAlign: "center",

  },
  modalTextPrecio: {
    fontSize: 40,
    marginBottom: 30,
    color: "#0000ff",
    fontWeight: "bold",
    textAlign: "center",

  },
  rowContainer: {
    flexDirection: 'row', // Distribute items horizontally
    alignItems: 'center', // Center items vertically
    justifyContent: 'center', // Center items horizontally
    width: '100%', // Ensure row takes full width
    flexWrap: 'wrap', // Wrap text if necessary
    marginBottom: 15, // Optional: Add some margin at the bottom if needed
  },
  tag: {
    borderRadius: 15, // Border radius for rounded corners
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    backgroundColor: 'lightgreen', // Background color for tag
    alignItems: 'center', // Center the text inside the tag
    justifyContent: 'center', // Center the text inside the tag
  },
  tagText: {
    fontSize: 16,
    color: 'black',
  },

  separatorLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc', // Color de la línea
    marginVertical: 10, // Espacio arriba y abajo de la línea
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 10,

  },
  buttonClose: {
    backgroundColor: "lightcoral",

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
  },
  floatingButtonA: {
    position: 'absolute',
    bottom: 200,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  buttonEnabled: {
    backgroundColor: 'green',
  },
  buttonDisabled: {
    backgroundColor: 'red',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonClose: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 2,
    marginTop: 15,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  bottomSheetContent: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  handleIndicator: {
    backgroundColor: '#000',
    height: 6,
    borderRadius: 3,
  },



});

