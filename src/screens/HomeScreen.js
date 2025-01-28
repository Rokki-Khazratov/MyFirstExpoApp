import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [plantations, setPlantations] = useState([]);
  const [district, setDistrict] = useState('');
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlantations();
  }, []);

  const fetchPlantations = async (url = 'http://127.0.0.1:8000/api/plantations/forme/') => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setPlantations((prevPlantations) => [...prevPlantations, ...data.results]);
      setNextPage(data.next);
      if (data.results.length > 0 && !district) {
        const districtName = data.results[0]?.district;
        setDistrict(`${districtName.region} - ${districtName.name}`);
      }
    } catch (error) {
      console.error('Error fetching plantations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (nextPage && !loading) {
      fetchPlantations(nextPage);
    }
  };

  const handleEdit = (id) => {
    navigation.navigate('EditPlantation', { plantationId: id });
  };

  const handleDelete = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await fetch(`http://127.0.0.1:8000/api/plantations/${id}/update/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_deleting: true }),
      });
      alert('Plantation marked for deletion.');
    } catch (error) {
      alert('Failed to delete.');
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" color="#007BFF" style={{ marginVertical: 16 }} />;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mening Hududim</Text>
      <Text style={styles.subtitle}>{district}</Text>
      <FlatList
        data={plantations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.district.name}</Text>
            <Text>Region: {item.district.region}</Text>
            <Text>Established Year: {item.garden_established_year}</Text>
            <Text>Total Area: {item.total_area} ha</Text>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(item.id)}
              >
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  editButton: {
    backgroundColor: '#007BFF',
    padding: 8,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: '#FF5C5C',
    padding: 8,
    borderRadius: 8,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;