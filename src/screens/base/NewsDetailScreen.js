import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const NewsDetailScreen = ({ route }) => {
  const { news } = route.params;
  const [isExpanded, setIsExpanded] = useState(false);

  const handleReadMore = () => {
    setIsExpanded(true); // После нажатия текст разворачивается и кнопка "Read More" исчезает.
  };

  const shortenedDescription = news.description.length > 60
    ? `${news.description.slice(0, 60)}...`
    : news.description;

  return (
    <ScrollView style={styles.container}>
      {/* Использование изображения из JSON */}
      <Image source={{ uri: news.image }} style={styles.image} />
      <Text style={styles.title}>{news.title}</Text>
      <Text style={styles.description}>
        {isExpanded ? news.description : shortenedDescription}{' '}
        {!isExpanded && (
          <Text style={styles.readMoreLink} onPress={handleReadMore}>
            Read More
          </Text>
        )}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  readMoreLink: {
    color: '#007BFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default NewsDetailScreen;
