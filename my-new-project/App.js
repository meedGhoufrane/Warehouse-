import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./app/(tabs)/LoginScreen"; 
import HomeScreen from "./app/(tabs)/HomeScreen"; 

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
          name="Home" // Ensure this matches the name used in navigation.navigate("Home")
          component={HomeScreen}
          options={{ title: "Accueil" }} // Customize the header title for the Home screen
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;