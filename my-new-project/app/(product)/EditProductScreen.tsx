// // app/(tabs)/EditProductScreen.tsx
// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import database from "@/database.json"; // Import your database

// const EditProductScreen = () => {
//     const { id } = useLocalSearchParams();
//     const product = database.products.find((p) => p.id === parseInt(id as string));
//     const [quantity, setQuantity] = useState("");
//     const router = useRouter();

//     const handleUpdateQuantity = (warehouseId: number) => {
//         const warehouse = product?.stocks.find((s) => s.id === warehouseId);
//         if (warehouse) {
//             warehouse.quantity += parseInt(quantity);
//             Alert.alert("Succès", "Quantité mise à jour");
//         }
//     };

//     if (!product) {
//         return <Text>Produit non trouvé</Text>;
//     }

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Modifier le produit: {product.name}</Text>
//             <Text>Type: {product.type}</Text>
//             <Text>Prix: {product.price} DH</Text>
//             <Text>Fournisseur: {product.supplier}</Text>
//             <Text>Stocks:</Text>
//             {product.stocks.map((stock) => (
//                 <View key={stock.id} style={styles.stockContainer}>
//                     <Text>{stock.name}: {stock.quantity} unités</Text>
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Quantité à ajouter/retirer"
//                         value={quantity}
//                         onChangeText={setQuantity}
//                         keyboardType="numeric"
//                     />
//                     <TouchableOpacity
//                         style={styles.button}
//                         onPress={() => handleUpdateQuantity(stock.id)}
//                     >
//                         <Text style={styles.buttonText}>Mettre à jour</Text>
//                     </TouchableOpacity>
//                 </View>
//             ))}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//         backgroundColor: "#f8f9fa",
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: "bold",
//         marginBottom: 20,
//     },
//     stockContainer: {
//         marginBottom: 20,
//     },
//     input: {
//         width: "100%",
//         height: 40,
//         borderColor: "gray",
//         borderWidth: 1,
//         marginBottom: 10,
//         padding: 10,
//     },
//     button: {
//         backgroundColor: "#007bff",
//         padding: 10,
//         borderRadius: 5,
//         alignItems: "center",
//     },
//     buttonText: {
//         color: "#fff",
//         fontSize: 16,
//     },
// });

// export default EditProductScreen;