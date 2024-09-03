import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { handleMenu } from '../../../libs/authService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';








const MenuScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await handleMenu(username);
        setData(result.objects)
        console.log(":", username);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando datos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Ocurrió un error al obtener los datos.</Text>
        <Text>{error.message}</Text>
      </View>
    );
  }

  const getIcon = (descripcion) => {
    // Función para seleccionar el icono basado en la descripción
    switch (descripcion.toLowerCase()) {
      case 'ajustes de stock':
        return <AntDesign name="inbox" size={90} color="blue" />;
      case 'precios':
        return <MaterialIcons name="price-check" size={90} color="blue" />
      case 'codigos':
        return <Ionicons name="barcode" size={90} color="blue" />
      case 'compras directas':
        return <MaterialIcons name="shopping-cart-checkout" size={90} color="blue" />;
      case 'despachos manuales':
          return <MaterialCommunityIcons name="send" size={90} color="blue" />;
          
      case 'despachos proporcionales':
        return <MaterialCommunityIcons name="send-clock" size={90} color="blue" />;
      case 'compras directas':
          return <MaterialIcons name="shopping-cart-checkout" size={90} color="blue" />;  
      case 'dev a proveedores':
        return   <MaterialCommunityIcons name="file-restore" size={90} color="blue" />  
      case 'dev internas':
          return   <MaterialCommunityIcons name="file-restore-outline" size={90} color="blue" />       
      case 'dev no aptos p/venta':
          return <MaterialCommunityIcons name="restore" size={90} color="blue" />        
      case 'dev p/vencimientos':
              return   <MaterialCommunityIcons name="restore-alert" size={90} color="blue" />
      case 'etiquetas':
          return   <FontAwesome name="tags" size={90} color="blue" />          
      case 'inventarios':
            return  <MaterialIcons name="inventory" size={90} color="blue" />
      case 'movimientos':
            return  <Feather name="move" size={90} color="blue" />
      case 'recepciones de compras':
          return  <MaterialIcons name="add-shopping-cart" size={90} color="blue" /> 
      case 'reposiciones':
          return  <Entypo name="shop" size={90} color="blue" /> 
      case 'transf internas':
          return  <MaterialCommunityIcons name="bank-transfer" size={90} color="blue" /> 
      case 'ubicaciones':
            return   <FontAwesome6 name="map-location-dot" size={90} color="blue" />                      
      // Agrega más casos para otros iconos
      default:
        return <FontAwesome name="question" size={90} color="blue" />;
    }
  };

  const handlePress = (descripcion) => {
    router.push(`../../${descripcion.toLowerCase()}`); // Navega a la pantalla de detalles y pasa la descripción
    console.log(descripcion);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handlePress(item.descripcion)}>
      <View style={styles.itemContent}>
        {getIcon(item.descripcion)}
        <Text style={styles.itemText}>{item.descripcion ? item.descripcion : "Sin descripción"}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()} // Usando `id` como clave única
        renderItem={renderItem}
        numColumns={2} // Establece el número de columnas
        columnWrapperStyle={styles.row} // Estilo para el contenedor de las columnas
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8', // Color de fondo para el contenedor
  },
  itemContainer: {
    flex: 1, // Permite que la tarjeta ocupe el espacio disponible en la columna
    backgroundColor: '#fff', // Fondo blanco para las tarjetas
    borderRadius: 10, // Bordes redondeados
    padding: 16, // Espaciado interno de la tarjeta
    margin: 8, // Espaciado entre tarjetas
    shadowColor: '#000', // Color de la sombra
    shadowOffset: { width: 0, height: 2 }, // Desplazamiento de la sombra
    shadowOpacity: 0.1, // Opacidad de la sombra
    shadowRadius: 5, // Radio de la sombra
    elevation: 2, // Elevación para Android
    flexDirection: 'row', // Para alinear el ícono y el texto horizontalmente
    alignItems: 'center', // Alinea verticalmente el ícono y el texto
  },
  itemContent: {
    flexDirection: 'column', // Alinea el ícono y el texto en una fila
    alignItems: 'center', // Alinea verticalmente el ícono y el texto
  },
  itemText: {
    flex:1,
    fontSize: 14, // Tamaño del texto
    color: '#333', // Color del texto
    marginTop: 8, // Espaciado entre el ícono y el texto
    
  },
  row: {
    justifyContent: 'space-between', // Espaciado igual entre las tarjetas en una fila
  },
});

export default MenuScreen;
