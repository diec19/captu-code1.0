import { View, Text } from 'react-native'
import { Tabs } from 'expo-router'
import React from 'react'
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';

export default function _layout() {
  return (

    <Tabs>
       <Tabs.Screen name='menu' options={{
        tabBarIcon:()=>(
          <Entypo name="home" size={24} color="black" />
        ),
        tabBarLabel:'Home',
        headerTitle:'Home'
       }}/>

<Tabs.Screen name='perfil' options={{
        tabBarIcon:()=>(
          <Octicons name="person-fill" size={24} color="black" />
        ),
        tabBarLabel:'Perfil',
         headerTitle:'Perfil'
       }}/>

<Tabs.Screen name='setting' options={{
        tabBarIcon:()=>(
          <Ionicons name="settings-sharp" size={24} color="black" />
        ),
        tabBarLabel:'Configuracion',
         headerTitle:'Configuracion'
       }}/>
    </Tabs>
  )
}