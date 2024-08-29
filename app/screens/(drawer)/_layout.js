import { View,Text,Alert } from "react-native";
import React from 'react'
import {Drawer} from 'expo-router/drawer'
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import Octicons from '@expo/vector-icons/Octicons';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from "expo-router";

const CustomDrawerContent =(props)=>{
    return(
    <DrawerContentScrollView {...props}>
        <DrawerItem
            icon={({color,size})=>(
                <Octicons name="person-fill" size={24} color="black" />
            )}
            label={"Perfil"}
            onPress={()=>{
                router.push('/perfil');
            }}
            />
         <DrawerItem
            icon={({color,size})=>(
                <Ionicons name="settings-sharp" size={24} color="black" />
            )}
            label={"Configuracion"}
            onPress={()=>{
                router.push('/perfil');
            }}
            />

         <DrawerItem
            icon={({color,size})=>(
                <FontAwesome6 name="contact-card" size={24} color="black" />
            )}
            label={"Contactenos"}
            onPress={()=>{
                router.push('/perfil');
            }}
            />    
          <DrawerItem
            icon={({color,size})=>(
                <Entypo name="log-out" size={24} color="black" />
            )}
            label={"Cerrar seción"}
            onPress={() => {
                Alert.alert(
                  'Confirmación',
                  '¿Estás seguro de que deseas Salir?',
                  [
                    {
                      text: 'Cancelar',
                      onPress: () => console.log('Cancelado'),
                      style: 'cancel',
                    },
                    {
                      text: 'Aceptar',
                      onPress: () => {
                        router.push('../../SimpleLogin');
                      },
                    },
                  ],
                  { cancelable: false } // Esto asegura que el usuario tenga que elegir una opción
                );
              }}
            />       
       
    </DrawerContentScrollView>
    )
}

export default function Layout(){
    return(
        <Drawer drawerContent={(props)=><CustomDrawerContent{...props} />}/>
    )
}