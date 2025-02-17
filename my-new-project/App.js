import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./app/(auth)/LoginScreen";
import HomeScreen from "./app/(home)/HomeScreen";
import ProductManagementScreen from "./app/(product)/ProductManagementScreen"; // Add this line
import SingleProductScreen from "./app/(product)/SingleProductScreen";
import EditProductScreen from "./app/(product)/EditProductScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} // Hide the header for the Login screen
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProductManagement" // Add this route
          component={ProductManagementScreen}
          options={{ title: "Manage Products" }}
        />
        <Stack.Screen
          name="SingleProduct"
          component={SingleProductScreen}
          options={{ title: "Product Details" }}
        />
        <Stack.Screen
          name="EditProduct"
          component={EditProductScreen}
          options={{ title: "Edit Product" }}
        />
        <Stack.Screen
          name="QRCode"
          component={QRCodeScreen}
          options={{ title: "QR Code Scanner" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;