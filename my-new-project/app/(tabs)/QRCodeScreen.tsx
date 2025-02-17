import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert, Modal, TextInput } from "react-native";
import { Camera, CameraType } from 'expo-camera';  // Updated import
import axios from "axios";

const QRCodeScreen = () => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [cameraVisible, setCameraVisible] = useState<boolean>(false);
    const [scannedData, setScannedData] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        type: "",
        barcode: "",
        price: "",
        supplier: ""
    });

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    const handleScanProduct = () => {
        if (hasPermission) {
            setCameraVisible(true);
        } else {
            Alert.alert("Permission not granted", "Please allow camera access.");
        }
    };

    const handleBarCodeScanned = async ({ type, data }) => {
        setScannedData(data);
        setCameraVisible(false);

        // Check if the product exists in the database
        try {
            const response = await axios.get("http://192.168.1.109:3001/products");
            const productExists = response.data.some(product => product.barcode === data);

            if (productExists) {
                Alert.alert("Product already exists", "This product is already in the database.");
            } else {
                setNewProduct(prev => ({ ...prev, barcode: data }));
                setModalVisible(true);
            }
        } catch (error) {
            console.error("Error fetching products:", error.message);
            Alert.alert("Error", "Failed to check product in the database.");
        }
    };

    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.type || !newProduct.barcode || !newProduct.price || !newProduct.supplier) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        const productToAdd = {
            ...newProduct,
            id: Date.now(), // Generate a unique ID
            price: parseFloat(newProduct.price), // Convert price to a number
        };

        try {
            await axios.post("http://192.168.1.109:3001/products", productToAdd);
            Alert.alert("Success", "Product added successfully!");
            setModalVisible(false);
            setNewProduct({ name: "", type: "", barcode: "", price: "", supplier: "" });
        } catch (error) {
            console.error("Error adding product:", error.message);
            Alert.alert("Error", "Failed to add product. Check server connection.");
        }
    };
    if (cameraVisible && hasPermission === true) {
        return (
            <View style={styles.cameraContainer}>
                <Camera
                    style={styles.camera}
                    onBarCodeScanned={handleBarCodeScanned}
                    type="back"  // Just use string "back" instead of trying to access Constants
                >
                    <View style={styles.buttonContainer}>
                        <Button title="Cancel" onPress={() => setCameraVisible(false)} />
                    </View>
                </Camera>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>QR Code Scanner</Text>
            <Button title="Scan Product" onPress={handleScanProduct} />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Add New Product</Text>
                        <TextInput
                            placeholder="Name"
                            style={styles.input}
                            value={newProduct.name}
                            onChangeText={(value) => setNewProduct({ ...newProduct, name: value })}
                        />
                        <TextInput
                            placeholder="Type"
                            style={styles.input}
                            value={newProduct.type}
                            onChangeText={(value) => setNewProduct({ ...newProduct, type: value })}
                        />
                        <TextInput
                            placeholder="Barcode"
                            style={styles.input}
                            value={newProduct.barcode}
                            onChangeText={(value) => setNewProduct({ ...newProduct, barcode: value })}
                        />
                        <TextInput
                            placeholder="Price"
                            keyboardType="numeric"
                            style={styles.input}
                            value={newProduct.price}
                            onChangeText={(value) => setNewProduct({ ...newProduct, price: value })}
                        />
                        <TextInput
                            placeholder="Supplier"
                            style={styles.input}
                            value={newProduct.supplier}
                            onChangeText={(value) => setNewProduct({ ...newProduct, supplier: value })}
                        />
                        <View style={styles.buttonContainer}>
                            <Button title="Add Product" onPress={handleAddProduct} />
                            <Button title="Cancel" onPress={() => setModalVisible(false)} />
                        </View>
                    </View>
                </View>
            </Modal>
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
    cameraContainer: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 20,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
    },
    input: {
        width: "100%",
        height: 40,
        borderColor: "#d1d5db",
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
});

export default QRCodeScreen;