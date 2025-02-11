// app/_layout.tsx
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";

export default function RootLayout() {
    return (
        <ThemedView style={styles.container}>
            <Stack>
                <Stack.Screen
                    name="(tabs)" // This matches the folder name
                    options={{ headerShown: false }} // Hide the header for this stack
                />
            </Stack>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
});