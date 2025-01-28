// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Бургер-меню */}


      <Text style={styles.title}>Welcome to the News App</Text>
      <Text style={styles.description}>
        Discover the latest updates and read detailed news articles!
      </Text>

      <Button title="View All News" onPress={() => navigation.navigate('AllNews')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  burgerMenu: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
  },
  burgerText: {
    fontSize: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
});

export default HomeScreen;
