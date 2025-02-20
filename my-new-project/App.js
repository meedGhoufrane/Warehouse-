import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./app/(auth)/LoginScreen";
import HomeScreen from "./app/(home)/HomeScreen";
import ProductManagementScreen from "./app/(product)/ProductManagementScreen";
import SingleProductScreen from "./app/(product)/SingleProductScreen"; // Ensure this import is correct
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
          name="ProductManagement"
          component={ProductManagementScreen}
        />
        <Stack.Screen
          name="SingleProduct" // Ensure the route name matches exactly
          component={SingleProductScreen}
          options={{ title: "Product Details" }} // Optional: Customize the title
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;