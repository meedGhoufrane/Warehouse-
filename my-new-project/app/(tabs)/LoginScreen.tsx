// app/(tabs)/LoginScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router"; 
import database from '../../database.json'; // Import the database

const LoginScreen = () => {
    const [secretKey, setSecretKey] = useState(""); // Change secretCode to secretKey
    const router = useRouter();

    const handleLogin = () => {
        const isValidKey = database.warehousemans.some(warehouseman => warehouseman.secretKey === secretKey);
        
        if (isValidKey) {
            Alert.alert("Connexion réussie", "Bienvenue !");
            router.push("/(tabs)/HomeScreen"); 
        } else {
            Alert.alert("Erreur", "Code secret incorrect");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Connexion</Text>
            <TextInput
                style={styles.input}
                placeholder="Entrez votre code secret"
                secureTextEntry
                keyboardType="default"
                value={secretKey}
                onChangeText={setSecretKey}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Se connecter</Text>
            </TouchableOpacity>
            <Text style={styles.footerText}>
                Si vous ne voyez pas la page, vérifiez la configuration.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        backgroundColor: '#f3f4f6', 
    },
    title: {
        fontSize: 24, // Equivalent to 2rem
        fontWeight: 'bold',
        color: '#4b5563', // Dark gray text
        marginBottom: 24, // Equivalent to 1.5rem
    },
    input: {
        width: '80%',
        height: 40, // Equivalent to 2.5rem
        borderColor: '#d1d5db', // Light gray border
        borderWidth: 1,
        borderRadius: 8, // Equivalent to 0.5rem
        padding: 10, // Equivalent to 0.5rem
        marginBottom: 16, // Equivalent to 1rem
    },
    button: {
        width: '80%',
        height: 40, // Equivalent to 2.5rem
        backgroundColor: '#3b82f6', // Blue background
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8, // Equivalent to 0.5rem
    },
    buttonText: {
        fontSize: 18, // Equivalent to 1.125rem
        fontWeight: 'bold',
        color: '#fff', // White text
    },
    footerText: {
        marginTop: 16, // Equivalent to 1rem
        color: '#6b7280', // Gray text
        textAlign: 'center',
    },
});

export default LoginScreen;