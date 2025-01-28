import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

const EditFruitAreasScreen = ({ route, navigation }) => {
  const { fruitAreas, onSave } = route.params;
  const [localFruitAreas, setLocalFruitAreas] = useState([...fruitAreas]);

  const handleAddFruitArea = () => {
    setLocalFruitAreas((prev) => [
      ...prev,
      {
        fruit: '',
        variety: '',
        rootstock: '',
        planted_year: '',
        area: '',
        schema: '',
      },
    ]);
  };

  const handleRemoveFruitArea = (index) => {
    const updatedAreas = localFruitAreas.filter((_, i) => i !== index);
    setLocalFruitAreas(updatedAreas);
  };

  const handleSave = () => {
    if (localFruitAreas.some((area) => !area.fruit || !area.area)) {
      Alert.alert('Xatolik', 'Iltimos, barcha maydonlarni to‘ldiring!');
      return;
    }
    onSave(localFruitAreas);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Meva zonalarini tahrirlash</Text>
      {localFruitAreas.map((area, index) => (
        <View key={index} style={styles.fruitAreaItem}>
          <TextInput
            style={styles.input}
            value={area.fruit}
            onChangeText={(value) => {
              const updatedAreas = [...localFruitAreas];
              updatedAreas[index].fruit = value;
              setLocalFruitAreas(updatedAreas);
            }}
            placeholder="Meva turi"
          />
          <TextInput
            style={styles.input}
            value={String(area.area)}
            onChangeText={(value) => {
              const updatedAreas = [...localFruitAreas];
              updatedAreas[index].area = parseFloat(value);
              setLocalFruitAreas(updatedAreas);
            }}
            placeholder="Maydon (gektar)"
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveFruitArea(index)}
          >
            <Text style={styles.removeButtonText}>O‘chirish</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={handleAddFruitArea}>
        <Text style={styles.addButtonText}>Yangi zona qo‘shish</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Saqlash</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  fruitAreaItem: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  addButton: { backgroundColor: '#28a745', padding: 12, borderRadius: 8, marginBottom: 16 },
  addButtonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
  removeButton: { backgroundColor: '#FF5C5C', padding: 8, borderRadius: 8, marginTop: 8 },
  removeButtonText: { color: '#fff', textAlign: 'center' },
  saveButton: { backgroundColor: '#007BFF', padding: 12, borderRadius: 8 },
  saveButtonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
});

export default EditFruitAreasScreen;
