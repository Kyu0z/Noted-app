import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';

const SearchResults = ({
  results,
  _random,
}: {
  results: any;
  _random: boolean;
}) => {
  const hasResults = results.search && results.search.length > 0;
  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>
        {results.searchinfo && results.searchinfo.totalhits > 0
          ? `${results.searchinfo.totalhits} results in ${results.time}`
          : null}
      </Text>
      {hasResults && (
        <View style={styles.resultContainer}>
          <FlatList
            data={results.search}
            keyExtractor={(item) => item.pageid.toString()}
            renderItem={({ item }) => (
              <View style={styles.resultItem}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.content}>
                  {item.snippet.replace(/<\/?[^>]+(>|$)/g, '')}
                </Text>
                <Text style={styles.date}>
                  Last edited on {new Date(item.timestamp).toLocaleDateString()}
                </Text>
                <View style={styles.linkContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(
                        `https://en.wikipedia.org/?curid=${item.pageid}`
                      )
                    }
                  >
                    <Text style={styles.link}>Read More</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            style={styles.list}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    flex: 1,
  },
  infoText: {
    fontSize: 12,
    marginBottom: 10,
    color: '#fff',
  },
  resultContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  list: {
    flexGrow: 1,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    fontSize: 14,
    lineHeight: 16,
    color: '#ffffffe6',
    marginTop: 5,
    marginBottom: 7,
  },
  date: {
    color: '#ffffffa3',
    fontSize: 12,
    marginBottom: 5,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  link: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'red',
  },
});

export default SearchResults;
