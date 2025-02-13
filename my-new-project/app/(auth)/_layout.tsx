import React from "react";
import { Stack } from "expo-router";
import { ThemedView } from "@/components/ThemedView";

const AuthLayout = () => {
    return (
        <ThemedView style={{ flex: 1 }}>
            <Stack>
                <Stack.Screen
                    name="(auth)/LoginScreen"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="(home)/HomeScreen"
                    options={{ headerShown: false }}
                />
            </Stack>
        </ThemedView>
    );
};

export default AuthLayout; 