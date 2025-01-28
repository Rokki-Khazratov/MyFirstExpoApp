import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EditPlantationScreen = ({ route }) => {
  const { plantationId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Plantation</Text>
      <Text style={styles.text}>Editing plantation with ID: {plantationId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#555',
  },
});

export default EditPlantationScreen;
