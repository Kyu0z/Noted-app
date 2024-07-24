import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Github from "../Github";

const Header = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <Text style={styles.highlight}>Wiki</Text>Search
      </Text>
      <Github />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      // marginVertical: 20,
    },
    title: {
      fontSize: 36, 
      fontWeight: "bold",
      marginVertical: 10,
      color: "#fff",
    },
    highlight: {
      color: "#3b82f6", 
    },
  });
  
  export default Header;