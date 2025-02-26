import React from "react";
import { Stack } from "expo-router";
import { StyleSheet, View, Text } from "react-native";
import { ThemedView } from "@/components/ThemedView";

const TabsLayout = () => {
    return (
        <ThemedView style={styles.container}>
            <Stack>
                <Stack.Screen
                    name="(auth)/LoginScreen"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="(home)/HomeScreen"
                    options={{ headerShown: false }}
                />
                {/* <Stack.Screen
                    name="(tabs)/QRCodeScreen"
                    options={{ headerShown: false }}
                /> */}
            </Stack>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
});

export default TabsLayout;