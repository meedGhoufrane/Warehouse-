// components/ThemedView.tsx
import React from "react";
import { View, ViewProps, StyleSheet } from "react-native";

const ThemedView = ({ style, ...props }: ViewProps) => {
    return <View style={[styles.container, style]} {...props} />;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default ThemedView;