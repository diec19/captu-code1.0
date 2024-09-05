import axios from 'axios';
import { Alert } from 'react-native';

export const handleLogin = async (username, password) => {
  try {
    const headers = {
      'X-Token': 'mu@3Y7RTumKh^FbEZD?aD9*5qctA$a#3eB*7PKFPp_!FNjgdP!V4Z2w+w5mJ!z7KHUf?y=#6@5Zf7q3#xygTp^#U7M9Lr6-TmbMb+y7!Pe!DNLcGZaR=aTvgabp$Y=Ya#et+_EcJ+Q^-yr3qcw2BPj7r$XxTJ2Zgh^3ZTYWstdUnaFp%jCgq&F=gUN3P_RHecJ&_7jnSYVWgCvj5R_HSX=GwVK=2$czzm$ddZSu-rk8Z!6!FSMN?zB3YzjTz5*zN',
    };

    const response = await axios.post('http://kcode.californiasa.com.ar:31030/supermercados/api/query/logon', null, {
      params: {
        uid: username,
        pwd: password,
      },
      headers: headers,
    });

    console.log('Response Data:', response.data);

    return response.data; // Devuelve los datos de respuesta para su uso posterior
  } catch (error) {
    console.error('Error:', error);
    Alert.alert('Error', 'Hubo un problema al iniciar sesión');
    throw error; // Lanza el error para que el componente llamante lo maneje si es necesario
  }
};

export const handleMenu = async (username) => {
  try {
    // Aquí puedes usar el username para obtener o manejar datos de menú específicos
    const headers = {
      'X-Token': 'mu@3Y7RTumKh^FbEZD?aD9*5qctA$a#3eB*7PKFPp_!FNjgdP!V4Z2w+w5mJ!z7KHUf?y=#6@5Zf7q3#xygTp^#U7M9Lr6-TmbMb+y7!Pe!DNLcGZaR=aTvgabp$Y=Ya#et+_EcJ+Q^-yr3qcw2BPj7r$XxTJ2Zgh^3ZTYWstdUnaFp%jCgq&F=gUN3P_RHecJ&_7jnSYVWgCvj5R_HSX=GwVK=2$czzm$ddZSu-rk8Z!6!FSMN?zB3YzjTz5*zN',
    };

    const response = await axios.post(`http://kcode.californiasa.com.ar:31030/supermercados/api/query/aplicaciones?personal=${username}&aplicacion=0`, null, {
      headers: headers,
    });

    console.log('Response Data:', response.data.objects);

    return response.data; // Devuelve los datos de respuesta para su uso posterior
  } catch (error) {
    console.error('Error en la operación de menú:', error);
    Alert.alert('Error', 'Hubo un problema al realizar la operación de menú');
    throw error; // Lanza el error para que el componente llamante lo maneje si es necesario
  }
};

// authService.js


export const handleBarCodeScanned = async ({ type, data }, setScanned, setProductInfo) => {
  setScanned(true);

  try {
    const headers = {
      'X-Token': 'mu@3Y7RTumKh^FbEZD?aD9*5qctA$a#3eB*7PKFPp_!FNjgdP!V4Z2w+w5mJ!z7KHUf?y=#6@5Zf7q3#xygTp^#U7M9Lr6-TmbMb+y7!Pe!DNLcGZaR=aTvgabp$Y=Ya#et+_EcJ+Q^-yr3qcw2BPj7r$XxTJ2Zgh^3ZTYWstdUnaFp%jCgq&F=gUN3P_RHecJ&_7jnSYVWgCvj5R_HSX=GwVK=2$czzm$ddZSu-rk8Z!6!FSMN?zB3YzjTz5*zN',
    };
    const sku = data; // El código de barras escaneado
    const url = `http://kcode.californiasa.com.ar:31030/supermercados/api/query/sku?sucursal=7&deposito=7&sku=${sku}`;

    const response = await axios.post(url, null, { headers });

    if (response.data) {
      setProductInfo(response.data); // Pasar la información del producto
    } else {
      Alert.alert("Información", "No se recibieron datos del servidor.");
    }
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "No se pudo obtener la información del producto");
  }
};

