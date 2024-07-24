import React, { useState, useEffect, useRef } from "react";
import { View, TextInput, Button, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import WikiAPI from "../../api/WikiAPI";
import { getRandomWiki } from "../../api/WikiRandom";

const Search = ({ setResults, setRandom }: { setResults: any; setRandom: any }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const inputRef = useRef<TextInput>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const fetchData = async () => {
    if (searchTerm.trim() === "") return;
    const start = new Date().getTime()
    setLoading(true);
    try {
      const res = await WikiAPI.get("", {
        params: { srsearch: searchTerm },
      });
      setResults({ ...res.data.query, time: `${(new Date().getTime() - start) / 1000}s` });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setResults({ search: [] });
    setRandom(false);
    fetchData();
  };

  const handleRandom = async () => {
    const start = new Date().getTime();
    setLoading(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    setResults({ search: [] });
    setRandom(true);
    try {
      const res = await getRandomWiki();
      setResults({
        ...res.data.query,
        time: `${(new Date().getTime() - start) / 1000}s`,
        search: res.data.query.random,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search Wikipedia"
        value={searchTerm}
        onChangeText={setSearchTerm}
        ref={inputRef}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {showConfetti && <Text>Confetti Placeholder</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
  },
});

export default Search;
