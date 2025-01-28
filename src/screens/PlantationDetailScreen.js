import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';

const PlantationDetailScreen = ({ route, navigation }) => {
  const { plantationId } = route.params;
  const [plantation, setPlantation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  useEffect(() => {
    const fetchPlantationDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/plantations/${plantationId}/`);
        const data = await response.json();
        setPlantation(data);
      } catch (error) {
        console.error('Error fetching plantation details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlantationDetails();
  }, [plantationId]);

  const openImageFullscreen = (imageUri) => {
    setFullscreenImage(imageUri);
  };

  const closeImageFullscreen = () => {
    setFullscreenImage(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Ma’lumotlar yuklanmoqda...</Text>
      </View>
    );
  }

  if (!plantation) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Ma’lumotlarni yuklashda xatolik yuz berdi.</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Orqaga qaytish tugmasi */}
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Orqaga</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Plantatsiya Tafsilotlari</Text>

        {/* Umumiy ma’lumotlar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Umumiy ma’lumotlar</Text>
          <Text>Viloyat: {plantation.district?.region}</Text>
          <Text>Tuman: {plantation.district?.name}</Text>
          <Text>Yil tashkil etilgan: {plantation.garden_established_year}</Text>
          <Text>Umumiy maydon: {plantation.total_area} gektar</Text>
          <Text>Sug’oriladigan maydon: {plantation.irrigation_area || 0} gektar</Text>
          <Text>Hosildorlik ko‘rsatkichi: {plantation.fertility_score || 'N/A'}</Text>
          <Text>Yer turi: {plantation.land_type}</Text>
          <Text>Hosildormi: {plantation.is_fertile ? 'Ha' : 'Yo‘q'}</Text>
        </View>

        {/* Fermer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fermer</Text>
          <Text>Ismi: {plantation.farmer?.name || 'N/A'}</Text>
          <Text>Manzil: {plantation.farmer?.address || 'N/A'}</Text>
          <Text>INN: {plantation.farmer?.inn || 'N/A'}</Text>
          <Text>Tashkil etilgan yil: {plantation.farmer?.established_year || 'N/A'}</Text>
        </View>

        {/* Investitsiyalar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investitsiyalar</Text>
          {plantation.investments?.length > 0 ? (
            plantation.investments.map((investment, index) => (
              <View key={index} style={styles.investmentItem}>
                <Text>Tur: {investment.invest_type}</Text>
                <Text>Miqdor: {investment.investment_amount} UZS</Text>
              </View>
            ))
          ) : (
            <Text>Investitsiyalar mavjud emas.</Text>
          )}
        </View>

        {/* Subsidiyalar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subsidiyalar</Text>
          {plantation.subsidies?.length > 0 ? (
            plantation.subsidies.map((subsidy, index) => (
              <View key={index} style={styles.subsidyItem}>
                <Text>Yil: {subsidy.year}</Text>
                <Text>Miqdor: {subsidy.amount} UZS</Text>
                <Text>Yo‘nalish: {subsidy.direction}</Text>
                <Text>Samaradorlik: {subsidy.efficiency}</Text>
              </View>
            ))
          ) : (
            <Text>Subsidiyalar mavjud emas.</Text>
          )}
        </View>

        {/* Shpalera */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shpalerar</Text>
          {plantation.trellises?.length > 0 ? (
            plantation.trellises.map((trellis, index) => (
              <View key={index} style={styles.trellisItem}>
                <Text>Maydon: {trellis.trellis_installed_area} gektar</Text>
                <Text>Shpalera turi: {trellis.trellis_type || 'N/A'}</Text>
                <Text>Shpalera soni: {trellis.trellis_count}</Text>
              </View>
            ))
          ) : (
            <Text>Shpalerar mavjud emas.</Text>
          )}
        </View>
        
        {/* Meva zonalari */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meva zonalari</Text>
          {plantation.fruit_areas?.length > 0 ? (
            plantation.fruit_areas.map((fruitArea, index) => (
              <View key={index} style={styles.fruitAreaItem}>
                <Text>Meva turi: {fruitArea.fruit}</Text>
                <Text>Nav: {fruitArea.variety}</Text>
                <Text>Ildiz tizimi: {fruitArea.rootstock}</Text>
                <Text>Ekilgan yil: {fruitArea.planted_year}</Text>
                <Text>Maydon: {fruitArea.area} gektar</Text>
                <Text>O‘simlik sxemasi: {fruitArea.schema}</Text>
              </View>
            ))
          ) : (
            <Text>Meva zonalari mavjud emas.</Text>
          )}
        </View>

        {/* Rasm galereyasi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rasmlar</Text>
          {plantation.images?.length > 0 ? (
            <ScrollView horizontal>
              {plantation.images.map((image, index) => (
                <TouchableOpacity key={index} onPress={() => openImageFullscreen(image)}>
                  <Image source={{ uri: image }} style={styles.image} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Text>Rasmlar mavjud emas.</Text>
          )}
        </View>
      </ScrollView>

      {/* Modal uchun tasvir */}
      {fullscreenImage && (
        <Modal visible={true} transparent={true}>
          <TouchableOpacity style={styles.fullscreenContainer} onPress={closeImageFullscreen}>
            <Image source={{ uri: fullscreenImage }} style={styles.fullscreenImage} />
          </TouchableOpacity>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  backButton: { marginBottom: 8, padding: 8, backgroundColor: '#007BFF', borderRadius: 8 },
  backButtonText: { color: '#fff', fontSize: 16 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  fruitAreaItem: { marginBottom: 8, padding: 8, backgroundColor: '#e0e0e0', borderRadius: 8 },
  investmentItem: { marginBottom: 8, padding: 8, backgroundColor: '#f9f9f9', borderRadius: 8 },
  subsidyItem: { marginBottom: 8, padding: 8, backgroundColor: '#f2f2f2', borderRadius: 8 },
  trellisItem: { marginBottom: 8, padding: 8, backgroundColor: '#f9f9f9', borderRadius: 8 },
  image: { width: 150, height: 100, marginRight: 8, borderRadius: 8 },
  fullscreenContainer: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: 'center', alignItems: 'center' },
  fullscreenImage: { width: '90%', height: '70%', resizeMode: 'contain' },
});

export default PlantationDetailScreen;