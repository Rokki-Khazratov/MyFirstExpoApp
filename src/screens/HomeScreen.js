import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [plantations, setPlantations] = useState([]);
  const [district, setDistrict] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const fetchPlantations = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`http://127.0.0.1:8000/api/plantations/forme/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
  
        // Проверяем, есть ли данные
        if (data && data.results) {
          if (page === 1) {
            setPlantations(data.results);
          } else {
            setPlantations((prev) => [...prev, ...data.results]);
          }
  
          if (data.results.length > 0 && page === 1) {
            const districtName = data.results[0]?.district || {};
            setDistrict(`${districtName.region || 'N/A'} - ${districtName.name || 'N/A'}`);
          }
        } else {
          console.error('Некорректный формат ответа:', data);
        }
      } catch (error) {
        console.error('Ошибка при загрузке плантаций:', error);
      }
    };
  
    fetchPlantations();
  }, [page]);
  

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

  const handleLoadMore = () => {
    if (!loading) {
      fetchPlantations(page + 1);
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
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
            <Text>Total Area: {item.total_area} GA</Text>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(item.id)}
              >
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.moreButton}
                onPress={() => navigation.navigate('PlantationDetail', { plantationId: item.id })}
              >
                <Text style={styles.actionText}>More</Text>
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
  moreButton: {
    backgroundColor: '#FFA500',
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
  loadingFooter: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});

export default HomeScreen;
