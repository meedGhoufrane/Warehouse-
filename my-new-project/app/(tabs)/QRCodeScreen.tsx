import React, { useState, useCallback, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Modal,
    TextInput,
    Dimensions,
    ActivityIndicator
} from "react-native";
import {
    CameraView,
    BarcodeScanningResult,
    useCameraPermissions,
} from "expo-camera";
import axios from "axios";

const QRCodeScreen = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [isScanning, setIsScanning] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const lastScanRef = useRef(0);
    const SCAN_COOLDOWN = 2000;
    const [newProduct, setNewProduct] = useState({
        name: "",
        type: "",
        barcode: "",
        price: "",
        supplier: ""
    });

    const { width } = Dimensions.get("window");
    const SCAN_AREA_SIZE = width * 0.7;

    const validateBarcode = (barcode) => {
        const cleanBarcode = barcode.trim();
        if (!/^\d+$/.test(cleanBarcode)) {
            return false;
        }
        const validLengths = [8, 12, 13, 14];
        return validLengths.includes(cleanBarcode.length);
    };

    const handleBarCodeScanned = useCallback(
        ({ data }) => {
            const now = Date.now();
            if (now - lastScanRef.current < SCAN_COOLDOWN) {
                return;
            }

            lastScanRef.current = now;
            setIsScanning(false);
            handleScan(data);
        },
        []
    );

    const handleScan = async (barcode) => {
        if (!validateBarcode(barcode)) {
            Alert.alert("Invalid Barcode", "The scanned barcode appears to be invalid. Please try again.");
            setIsScanning(true);
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(`http://192.168.1.109:3001/products?barcode=${barcode}`, {
                timeout: 5000
            });
            
            // Check if the product exists in the response
            const product = response.data.find(p => p.barcode === barcode);
            
            if (product) {
                setSelectedProduct(product);
                setModalVisible(true);
            } else {
                // Reset new product form with just the barcode
                setNewProduct({
                    name: "",
                    type: "",
                    barcode: barcode,
                    price: "",
                    supplier: ""
                });
                setSelectedProduct(null);
                setModalVisible(true);
            }
        } catch (error) {
            Alert.alert(
                "Error",
                "Failed to check product. Please try again.",
                [{ text: "OK", onPress: () => setIsScanning(true) }]
            );
        } finally {
            setIsLoading(false);
            setIsScanning(true);
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedProduct(null);
        setNewProduct({
            name: "",
            type: "",
            barcode: "",
            price: "",
            supplier: ""
        });
    };

    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.type || !newProduct.barcode || !newProduct.price || !newProduct.supplier) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        const productToAdd = {
            ...newProduct,
            id: Date.now(),
            price: parseFloat(newProduct.price),
            stocks: [] // Initialize empty stocks array
        };

        setIsLoading(true);
        try {
            await axios.post("http://192.168.1.109:3001/products", productToAdd, {
                timeout: 5000
            });
            Alert.alert("Success", "Product added successfully!");
            handleCloseModal();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.code === 'ECONNABORTED') {
                    Alert.alert("Connection Timeout", "Server is taking too long to respond. Please try again.");
                } else if (error.message === 'Network Error') {
                    Alert.alert("Network Error", "Please check your internet connection and server status.");
                } else {
                    Alert.alert("Error", `Failed to add product: ${error.message}`);
                }
            } else {
                Alert.alert("Error", "An unexpected error occurred while adding the product.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!permission?.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Camera permission is required to scan barcodes</Text>
                <TouchableOpacity
                    onPress={requestPermission}
                    style={styles.permissionButton}
                >
                    <Text style={styles.permissionButtonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const renderProductDetails = () => (
        <>
            <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
            <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>Type: {selectedProduct.type}</Text>
                <Text style={styles.detailText}>Price: ${selectedProduct.price}</Text>
                <Text style={styles.detailText}>Supplier: {selectedProduct.supplier}</Text>
                <Text style={styles.detailText}>Stock Status: {selectedProduct.stocks && selectedProduct.stocks.length > 0 ? "In Stock" : "Out of Stock"}</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
        </>
    );

    const renderAddProductForm = () => (
        <>
            <Text style={styles.modalTitle}>Add New Product</Text>
            <TextInput
                placeholder="Name"
                style={styles.input}
                value={newProduct.name}
                onChangeText={(value) => setNewProduct(prev => ({ ...prev, name: value }))}
            />
            <TextInput
                placeholder="Type"
                style={styles.input}
                value={newProduct.type}
                onChangeText={(value) => setNewProduct(prev => ({ ...prev, type: value }))}
            />
            <TextInput
                placeholder="Barcode"
                style={styles.input}
                value={newProduct.barcode}
                editable={false}
            />
            <TextInput
                placeholder="Price"
                style={styles.input}
                value={newProduct.price}
                onChangeText={(value) => setNewProduct(prev => ({ ...prev, price: value }))}
                keyboardType="numeric"
            />
            <TextInput
                placeholder="Supplier"
                style={styles.input}
                value={newProduct.supplier}
                onChangeText={(value) => setNewProduct(prev => ({ ...prev, supplier: value }))}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.addButton]}
                    onPress={handleAddProduct}
                >
                    <Text style={styles.buttonText}>Add Product</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={handleCloseModal}
                >
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </>
    );

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                onBarcodeScanned={isScanning ? handleBarCodeScanned : undefined}
                barcodeScannerSettings={{
                    barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "code39", "code128"],
                }}
            >
                <View style={styles.overlay}>
                    <View style={styles.scanAreaContainer}>
                        <View
                            style={[
                                styles.scanArea,
                                {
                                    width: SCAN_AREA_SIZE,
                                    height: SCAN_AREA_SIZE,
                                },
                            ]}
                        >
                            <View style={styles.scanAreaTransparent} />
                            {isScanning && (
                                <View style={styles.scanLine} />
                            )}
                        </View>

                        <Text style={styles.guidanceText}>
                            {isScanning ? "Position barcode within the frame" : "Processing barcode..."}
                        </Text>
                    </View>
                </View>

                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#3b82f6" />
                        <Text style={styles.loadingText}>Processing...</Text>
                    </View>
                )}
            </CameraView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        {selectedProduct ? renderProductDetails() : renderAddProductForm()}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    scanAreaContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanArea: {
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
    },
    scanAreaTransparent: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    scanLine: {
        height: 2,
        backgroundColor: '#3b82f6',
        position: 'absolute',
        width: '100%',
        top: '50%',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    guidanceText: {
        color: 'white',
        textAlign: 'center',
        marginTop: 16,
        paddingHorizontal: 16,
    },
    loadingContainer: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    loadingText: {
        color: 'white',
        marginTop: 8,
    },
    permissionButton: {
        backgroundColor: '#3b82f6',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    permissionButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
        width: "90%",
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
    },
    detailsContainer: {
        width: '100%',
        marginBottom: 15,
    },
    detailText: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    button: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        marginHorizontal: 5,
    },
    addButton: {
        backgroundColor: '#3b82f6',
    },
    cancelButton: {
        backgroundColor: '#dc2626',
    },
    closeButton: {
        backgroundColor: "#3b82f6",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
    },
    title: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 16,
    },
});

export default QRCodeScreen;