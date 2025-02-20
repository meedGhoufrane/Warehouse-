import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Alert, TouchableOpacity } from "react-native";
import axios from "axios";
import * as Print from 'expo-print';

const Statistics = () => {
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalCities, setTotalCities] = useState(0);
    const [outOfStockProducts, setOutOfStockProducts] = useState(0);
    const [totalInventoryValue, setTotalInventoryValue] = useState(0);
    const [recentlyAdded, setRecentlyAdded] = useState([]);
    const [recentlyRemoved, setRecentlyRemoved] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await axios.get("http://192.168.1.109:3001/products");
                const products = response.data.map(product => ({
                    ...product,
                    stocks: product.stocks || [], 
                    city: product.city || 'Unknown', 
                    createdAt: product.createdAt || new Date().toISOString() 
                }));

                setTotalProducts(products.length);
                
                const cities = new Set(products.map(product => product.city).filter(Boolean));
                setTotalCities(cities.size);
                
                const outOfStock = products.filter(product => {
                    const stocks = product.stocks || [];
                    return stocks.length === 0;
                });
                setOutOfStockProducts(outOfStock.length);
                
                const totalValue = products.reduce((acc, product) => {
                    const price = parseFloat(product.price) || 0;
                    return acc + price;
                }, 0);
                setTotalInventoryValue(totalValue);

                const sortedProducts = products.sort((a, b) => {
                    const dateA = new Date(a.createdAt || 0);
                    const dateB = new Date(b.createdAt || 0);
                    return dateB - dateA;
                });
                setRecentlyAdded(sortedProducts.slice(0, 5));
                setRecentlyRemoved([]);
            } catch (error) {
                console.error("Error fetching statistics:", error);
                Alert.alert(
                    "Error",
                    "Failed to fetch statistics. Please check your connection and try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    const generatePDF = async () => {
        const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { font-size: 28px; text-align: center; margin-bottom: 20px; }
            h2 { font-size: 24px; margin-top: 20px; }
            p { font-size: 18px; }
            ul { margin: 0; padding: 0; list-style: none; }
            li { font-size: 16px; margin-bottom: 8px; }
          </style>
        </head>
        <body>
          <h1>Inventory Statistics</h1>
          <p><strong>Total Products:</strong> ${totalProducts}</p>
          <p><strong>Total Cities:</strong> ${totalCities}</p>
          <p><strong>Out of Stock Products:</strong> ${outOfStockProducts}</p>
          <p><strong>Total Inventory Value:</strong> $${totalInventoryValue.toFixed(2)}</p>
  
          <h2>Recently Added Products</h2>
          <ul>
            ${recentlyAdded.map(product => `
              <li>${product.name || 'Unnamed Product'} - Added on: ${new Date(product.createdAt || new Date()).toLocaleDateString()}</li>
            `).join('')}
          </ul>
        </body>
      </html>
    `;

        try {
            await Print.printAsync({ html });
            Alert.alert('Success', 'The PDF has been generated successfully.');
        } catch (error) {
            console.error("Error generating PDF:", error);
            Alert.alert("Error", "Failed to generate PDF. Please try again.");
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0a7ea4" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Inventory Statistics</Text>
            <View style={styles.statisticCard}>
                <View style={styles.statisticItem}>
                    <Text style={styles.statisticLabel}>Total Products</Text>
                    <Text style={styles.statisticValue}>{totalProducts}</Text>
                </View>
                <View style={styles.statisticItem}>
                    <Text style={styles.statisticLabel}>Total Cities</Text>
                    <Text style={styles.statisticValue}>{totalCities}</Text>
                </View>
                <View style={styles.statisticItem}>
                    <Text style={styles.statisticLabel}>Out of Stock Products</Text>
                    <Text style={styles.statisticValue}>{outOfStockProducts}</Text>
                </View>
                <View style={styles.statisticItem}>
                    <Text style={styles.statisticLabel}>Total Inventory Value</Text>
                    <Text style={styles.statisticValue}>${totalInventoryValue.toFixed(2)}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.pdfButton} onPress={generatePDF}>
                <Text style={styles.pdfButtonText}>Generate PDF</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f8f9fa",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
        textAlign: "center",
    },
    statisticCard: {
        backgroundColor: "#ffffff",
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    statisticItem: {
        marginBottom: 15,
    },
    statisticLabel: {
        fontSize: 16,
        color: "#666",
        marginBottom: 5,
    },
    statisticValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#0a7ea4",
    },
    recentProductsContainer: {
        marginBottom: 20,
    },
    recentProductCard: {
        backgroundColor: "#ffffff",
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    recentProductName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    recentProductDate: {
        fontSize: 14,
        color: "#666",
    },
    noProductsText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
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
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    pdfButton: {
        backgroundColor: "#0a7ea4", // Button background color
        paddingVertical: 12, // Vertical padding
        paddingHorizontal: 24, // Horizontal padding
        borderRadius: 8, // Rounded corners
        marginVertical: 10, // Vertical margin
        alignItems: "center", // Center the text
        justifyContent: "center", // Center the text
        elevation: 3, // Shadow for Android
        shadowColor: "#000", // Shadow color for iOS
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    pdfButtonText: {
        color: "#fff", // Text color
        fontSize: 16, // Font size
        fontWeight: "bold", // Bold text
        textAlign: "center", // Center text
    },
});

export default Statistics;