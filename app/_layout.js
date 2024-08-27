import { Slot } from "expo-router";
import { View, Text } from "react-native";

export default function Layout(){

    return(
        <View className="flex-1 bg-black">
            <Slot/>
        </View>
    )
}