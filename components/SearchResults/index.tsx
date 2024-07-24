import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Linking } from "react-native";

const SearchResults = ({ results, _random }: { results: any; _random: boolean }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>
        {results.searchinfo && results.searchinfo.totalhits > 0
          ? `${results.searchinfo.totalhits} results in ${results.time}`
          : null}
      </Text>
      <FlatList
        data={results.search}
        keyExtractor={(item) => item.pageid.toString()}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.content}>{item.snippet.replace(/<\/?[^>]+(>|$)/g, "")}</Text>
            <Text style={styles.date}>Last edited on {new Date(item.timestamp).toLocaleDateString()}</Text>
            <TouchableOpacity onPress={() => Linking.openURL(`https://en.wikipedia.org/?curid=${item.pageid}`)}>
              <Text style={styles.link}>Read More</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  infoText: {
    fontSize: 12,
    marginBottom: 10,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    color: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#fff',
  },
  content: {
    color: '#fff',
  },
  date: {
    color: '#fff',
  },
  link: {
    marginTop: 5,
    color: "red",
  },
});

export default SearchResults;
