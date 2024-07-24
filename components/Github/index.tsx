import React from "react";
import { View, TouchableOpacity, StyleSheet, Text, Linking } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const GithubLink = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          Linking.openURL("https://github.com/Kyu0z").catch(err =>
            console.error("An error occurred", err)
          );
        }}
      >
        <Icon name="github" size={24} color="white" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  icon: {
    color: "white",
  },
  iconHover: {
    color: "blue",
    transform: [{ scale: 1.05 }],
  },
});

export default GithubLink;