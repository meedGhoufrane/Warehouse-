// app/(home)/HomeScreen.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProductManagementScreen from "../(tabs)/productManagement";
import SettingsScreen from "../(tabs)/settings";
import QRCodeScreen from "../(tabs)/QRCodeScreen";
import Statistics from "../(tabs)/Statistics";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === "Products") {
                        iconName = "inventory";
                    } else if (route.name === "Settings") {
                        iconName = "settings";
                    } else if (route.name === "QR Code") {
                        iconName = "qr-code";
                    } else if (route.name === "Statistics") {
                        iconName = "bar-chart";
                    }

                    return <MaterialIcons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "#0a7ea4",
                tabBarInactiveTintColor: "gray",
            })}
        >
            <Tab.Screen name="Products" component={ProductManagementScreen} />
            <Tab.Screen name="Statistics" component={Statistics} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
            <Tab.Screen name="QR Code" component={QRCodeScreen} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    // Add any styles you need here
});

export default HomeScreen;