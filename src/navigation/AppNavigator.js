import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from '../screens/HomeScreen';
import ContactScreen from '../screens/ContactScreen';
import LoginScreen from '../screens/LoginScreen';
import EditPlantationScreen from '../screens/EditPlantationScreen';
import PlantationDetailScreen from '../screens/PlantationDetailScreen'; // Импорт вашего экрана PlantationDetail


const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ navigation }) => {
  const [username, setUsername] = useState('Loading...');
  const [userPhone, setUserPhone] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        const storedPhone = await AsyncStorage.getItem('phone');
        setUsername(storedUsername || 'Guest');
        setUserPhone(storedPhone || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('Logged Out', 'You have been logged out successfully.');
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout.');
    }
  };

  return (
    <SafeAreaView style={styles.drawerContainer}>
      <View style={styles.userInfo}>
        <Text style={styles.username}>{username}</Text>
        {userPhone ? <Text style={styles.userPhone}>{userPhone}</Text> : null}
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.menuItem}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Linking.openURL('https://example.com/faq')}>
        <Text style={styles.menuItem}>FAQ</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Linking.openURL('https://t.me/rokki_khazratov')}>
        <Text style={styles.menuItem}>Telegram Support</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Contact')}>
        <Text style={styles.menuItem}>Contact Support</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Login"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="Login" component={LoginScreen} />
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Contact" component={ContactScreen} />
        <Drawer.Screen name="EditPlantation" component={EditPlantationScreen} />
        <Drawer.Screen name="PlantationDetail" component={PlantationDetailScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  userInfo: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
  },
  menuItem: {
    fontSize: 16,
    color: '#007BFF',
    marginBottom: 12,
  },
  logoutButton: {
    marginTop: 24,
    paddingVertical: 12,
    backgroundColor: '#FF5C5C',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AppNavigator;
