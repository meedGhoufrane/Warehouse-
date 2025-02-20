import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from "react-native";

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const handleSaveSettings = () => {
    Alert.alert("Settings Saved", `Notifications: ${notificationsEnabled ? "Enabled" : "Disabled"}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
      </View>

     

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 10,
  },
  settingLabel: {
    fontSize: 18,
  },
  slider: {
    width: 200,
  },
  volumeValue: {
    marginLeft: 10,
    fontSize: 16,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#0a7ea4",
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SettingsScreen;