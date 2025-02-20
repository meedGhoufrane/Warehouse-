import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";

const SingleProductScreen = ({ route, navigation }) => {
  const { product } = route.params; // Get the product passed from the previous screen
  const [loading, setLoading] = useState(false);

  console.log("SingleProductScreen rendered with product:", product); // Debugging log

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://192.168.1.109:3001/products/${product.id}`);
      Alert.alert("Success", "Product deleted successfully!");
      navigation.goBack(); // Navigate back to the previous screen
    } catch (error) {
      console.error("Error deleting product:", error.message);
      Alert.alert("Error", "Failed to delete product. Check server connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigation.navigate("EditProduct", { product }); // Navigate to edit screen
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productType}>{product.type}</Text>
      <Text style={styles.productPrice}>Price: ${product.price}</Text>
      <Text style={product.stocks.length > 0 ? styles.inStock : styles.outOfStock}>
        {product.stocks.length > 0 ? "In Stock" : "Out of Stock"}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.buttonText}>Edit Product</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete Product</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  productImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  productType: {
    fontSize: 18,
    color: "#666",
  },
  productPrice: {
    fontSize: 18,
    color: "#333",
  },
  inStock: {
    color: "green",
    fontWeight: "bold",
  },
  outOfStock: {
    color: "red",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  editButton: {
    backgroundColor: "#0a7ea4",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: "#d9534f",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default SingleProductScreen;