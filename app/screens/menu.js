import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, Alert,TouchableOpacity } from 'react-native';
import axios from 'axios';
import { handleMenu } from '../libs/authService';
import { useLocalSearchParams, useNavigation} from 'expo-router';


const MenuScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username } = useLocalSearchParams();
  const navigation = useNavigation(); // Hook para la navegación

 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await handleMenu(username);
        setData(result.objects);
        console.log(":",username)
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

  const handlePress = (descripcion) => {
    navigation.push('/', { descripcion }); // Navega a la pantalla de detalles y pasa la descripción
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Datos Obtenidos:</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()} // Usando `id` como clave única
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.itemContainer} onPress={() => handlePress(item.descripcion)}>
            <Text>{item.descripcion ? item.descripcion : "Sin descripción"}</Text>
          </TouchableOpacity>
        )}
      />

   


    
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  itemContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
});

export default MenuScreen;