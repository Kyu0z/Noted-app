import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import WikiAPI from '../../api/WikiAPI';
import { getRandomWiki } from '../../api/WikiRandom';
import Icon from 'react-native-vector-icons/FontAwesome';

const Search = ({
  setResults,
  setRandom,
}: {
  setResults: any;
  setRandom: any;
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const inputRef = useRef<TextInput>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showNoResults, setShowNoResults] = useState<boolean>(false);

  const fetchData = async () => {
    if (searchTerm.trim() === '') return;
    const start = new Date().getTime();
    setLoading(true);
    setShowNoResults(false);
    try {
      const res = await WikiAPI.get('', {
        params: { srsearch: searchTerm },
      });
      if (res.data.query.search && res.data.query.search.length > 0) {
        setResults({
          ...res.data.query,
          time: `${(new Date().getTime() - start) / 1000}s`,
        });
      } else {
        setShowNoResults(true);
      }
    } catch (error) {
      console.error(error);
      setShowNoResults(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    Keyboard.dismiss();
    setResults({ search: [] });
    setRandom(false);
    fetchData();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder='Search Wikipedia'
          value={searchTerm}
          onChangeText={setSearchTerm}
          ref={inputRef}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Icon
              name='search'
              size={20}
              color='white'
              style={styles.buttonText}
            />
          </TouchableOpacity>
        </View>
      </View>
      {loading && (
        <ActivityIndicator
          size='large'
          color='#007BFF'
          style={{ marginTop: 30 }}
        />
      )}
      {showNoResults && !loading && (
        <Text style={styles.noResultsText}>
          No results found, please try again.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#eaeaea',
    borderRadius: 8,
    padding: 10,
    color: '#fff',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
  },
  noResultsText: {
    marginTop: 80,
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Search;
