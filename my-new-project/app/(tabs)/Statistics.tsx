import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import axios from "axios";

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
        const products = response.data;

        setTotalProducts(products.length);
        setTotalCities(new Set(products.map(product => product.city)).size);
        const outOfStock = products.filter(product => product.stocks.length === 0);
        setOutOfStockProducts(outOfStock.length);
        setTotalInventoryValue(products.reduce((acc, product) => acc + product.price, 0));

        const sortedProducts = products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentlyAdded(sortedProducts.slice(0, 5));
        setRecentlyRemoved([]); // Implement logic for removed products if available
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

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

      <Text style={styles.title}>Recently Added Products</Text>
      <View style={styles.recentProductsContainer}>
        {recentlyAdded.map(product => (
          <View key={product.id} style={styles.recentProductCard}>
            <Text style={styles.recentProductName}>{product.name}</Text>
            <Text style={styles.recentProductDate}>Added on: {new Date(product.createdAt).toLocaleDateString()}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.title}>Recently Removed Products</Text>
      <View style={styles.recentProductsContainer}>
        {recentlyRemoved.length > 0 ? (
          recentlyRemoved.map(product => (
            <View key={product.id} style={styles.recentProductCard}>
              <Text style={styles.recentProductName}>{product.name}</Text>
              <Text style={styles.recentProductDate}>Removed on: {new Date(product.removedAt).toLocaleDateString()}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noProductsText}>No recently removed products.</Text>
        )}
      </View>
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
});

export default Statistics;