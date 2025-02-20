import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const ProductManagementScreen = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    type: "",
    barcode: "",
    price: "",
    supplier: "",
    image: "",
  });
  const [inStock, setInStock] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortCriteria, setSortCriteria] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigation = useNavigation();

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://192.168.1.109:3001/products");
      // Ensure all products have a stocks array
      const productsWithStocks = response.data.map(product => ({
        ...product,
        stocks: product.stocks || [] // Default to empty array if stocks is undefined
      }));
      setProducts(productsWithStocks);
      setFilteredProducts(productsWithStocks);
    } catch (error) {
      console.error("Error fetching products:", error.message);
      setError("Failed to fetch products. Check network or server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (field, value) => {
    setNewProduct({ ...newProduct, [field]: value });
  };

  const createProduct = async () => {
    if (
      !newProduct.name ||
      !newProduct.type ||
      !newProduct.barcode ||
      !newProduct.price ||
      !newProduct.supplier
    ) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const productToAdd = {
      ...newProduct,
      id: products.length + 1,
      price: parseFloat(newProduct.price),
      stocks: inStock ? [{ id: 1, quantity: 1 }] : [],
      editedBy: [],
    };

    try {
      const response = await axios.post(
        "http://192.168.1.109:3001/products",
        productToAdd
      );
      const newProductWithStocks = {
        ...response.data,
        stocks: response.data.stocks || [] // Ensure stocks exists
      };
      setProducts([...products, newProductWithStocks]);
      setFilteredProducts([...products, newProductWithStocks]);
      setModalVisible(false);
      Alert.alert("Success", "Product created successfully!");
      setNewProduct({
        name: "",
        type: "",
        barcode: "",
        price: "",
        supplier: "",
        image: "",
      });
      setInStock(true);
    } catch (error) {
      console.error("Error creating product:", error.message);
      Alert.alert("Error", "Failed to create product. Check server connection.");
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.type.toLowerCase().includes(query.toLowerCase()) ||
        product.supplier.toLowerCase().includes(query.toLowerCase()) ||
        product.price.toString().includes(query)
    );
    setFilteredProducts(filtered);
  };

  const handleSort = (criteria, order) => {
    setSortCriteria(criteria);
    setSortOrder(order);
    const sorted = [...filteredProducts].sort((a, b) => {
      if (criteria === "price") {
        return order === "asc" ? a.price - b.price : b.price - a.price;
      } else if (criteria === "name") {
        return order === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (criteria === "stock") {
        // Safely access stocks array
        const aStocks = a.stocks || [];
        const bStocks = b.stocks || [];
        return order === "asc"
          ? aStocks.length - bStocks.length
          : bStocks.length - aStocks.length;
      }
      return 0;
    });
    setFilteredProducts(sorted);
  };

  const renderItem = ({ item }) => {
    // Ensure stocks exists before accessing length
    const stocks = item.stocks || [];
    
    return (
      <TouchableOpacity
        onPress={() => {
          console.log("Navigating to SingleProduct with:", item);
          navigation.navigate("SingleProduct", { product: item });
        }}
      >
        <View style={styles.productContainer}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productType}>{item.type}</Text>
          <Text style={styles.productPrice}>Price: ${item.price}</Text>
          <Text style={stocks.length > 0 ? styles.inStock : styles.outOfStock}>
            {stocks.length > 0 ? "In Stock" : "Out of Stock"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Rest of the component remains the same...
  // (Keep all the existing return JSX and styles)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Products</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by name, type, price, or supplier"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortCriteria === "name" && styles.sortButtonActive,
          ]}
          onPress={() => handleSort("name", sortOrder === "asc" ? "desc" : "asc")}
        >
          <Text style={styles.sortButtonText}>
            Name {sortCriteria === "name" && (sortOrder === "asc" ? "↑" : "↓")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortCriteria === "price" && styles.sortButtonActive,
          ]}
          onPress={() => handleSort("price", sortOrder === "asc" ? "desc" : "asc")}
        >
          <Text style={styles.sortButtonText}>
            Price {sortCriteria === "price" && (sortOrder === "asc" ? "↑" : "↓")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortCriteria === "stock" && styles.sortButtonActive,
          ]}
          onPress={() => handleSort("stock", sortOrder === "asc" ? "desc" : "asc")}
        >
          <Text style={styles.sortButtonText}>
            Stock {sortCriteria === "stock" && (sortOrder === "asc" ? "↑" : "↓")}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.createProductButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.createProductButtonText}>Create Product</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* Keep the existing Modal component and its content */}
      {/* ... */}

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
    marginBottom: 20,
  },
  searchInput: {
    width: "90%",
    height: 40,
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sortLabel: {
    marginRight: 10,
    fontSize: 16,
  },
  sortButton: {
    backgroundColor: "#d1d5db",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  sortButtonActive: {
    backgroundColor: "#0a7ea4",
  },
  sortButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  productContainer: {
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productType: {
    fontSize: 16,
    color: "#666",
  },
  productPrice: {
    fontSize: 16,
    color: "#333",
  },
  inStock: {
    marginTop: 5,
    color: "green",
    fontWeight: "bold",
  },
  outOfStock: {
    marginTop: 5,
    color: "red",
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
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
  stockStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  stockStatusLabel: {
    marginRight: 10,
    fontSize: 16,
  },
  stockStatusButton: {
    backgroundColor: "#d1d5db",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  stockStatusButtonActive: {
    backgroundColor: "#0a7ea4",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  addButton: {
    backgroundColor: "#0a7ea4",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
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
  // Simple Create Product Button Styles
  createProductButton: {
    backgroundColor: "#0a7ea4", // Button color
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  createProductButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ProductManagementScreen;