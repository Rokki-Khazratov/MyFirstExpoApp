import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomDrawerContent = ({ navigation }) => {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        setUsername(storedUsername || 'My Profile');
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };
    fetchUsername();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear(); // Очищаем сохраненные данные
      Alert.alert('Logged Out', 'You have been logged out successfully.');
      // Используем navigation.navigate вместо replace
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout.');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{username}</Text>
      <View style={styles.divider} />
      <TouchableOpacity onPress={() => Linking.openURL('https://example.com/faq')}>
        <Text style={styles.menuItem}>FAQ</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Linking.openURL('https://t.me/rokki_khazratov')}>
        <Text style={styles.menuItem}>Telegram Support</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Linking.openURL('tel:+998971299707')}>
        <Text style={styles.menuItem}>Contact Support</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 12,
  },
  menuItem: {
    fontSize: 16,
    marginBottom: 12,
    color: '#007BFF',
    textAlign: 'left',
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: '#FF5C5C',
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CustomDrawerContent;
