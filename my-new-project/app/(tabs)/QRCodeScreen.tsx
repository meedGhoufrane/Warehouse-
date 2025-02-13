import React from "react";
import { View, Text, StyleSheet } from "react-native";

const QRCodeScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>QR Code Screen</Text>
            {/* You can add your QR code generation/display logic here */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
});

export default QRCodeScreen;