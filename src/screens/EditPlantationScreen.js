import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditPlantationScreen = ({ route, navigation }) => {
  const { plantationId } = route.params;
  const [plantation, setPlantation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [landType, setLandType] = useState(2); // Default value for land type
  const [qarorType, setQarorType] = useState(1);
  const [showLandTypePicker, setShowLandTypePicker] = useState(false);
  const [showQarorTypePicker, setShowQarorTypePicker] = useState(false);

  useEffect(() => {
    const fetchPlantationDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/plantations/${plantationId}/`);
        const data = await response.json();
        setPlantation(data);
        setLandType(data.land_type || 2);
        setQarorType(data.qaror_type || 1);
      } catch (error) {
        console.error('Error fetching plantation details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlantationDetails();
  }, [plantationId]);

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api/plantations/${plantationId}/update/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plantation),
      });

      if (response.ok) {
        Alert.alert('Muvaffaqiyatli', 'Plantatsiya ma’lumotlari saqlandi.');
        navigation.navigate('Home');
      } else {
        Alert.alert('Xatolik', 'Ma’lumotlarni saqlashda muammo yuz berdi.');
      }
    } catch (error) {
      console.error('Error saving plantation:', error);
      Alert.alert('Xatolik', 'Ma’lumotlarni saqlashda xatolik yuz berdi.');
    }
  };

  const handleAddObject = (key) => {
    setPlantation((prev) => ({
      ...prev,
      [key]: [
        ...(prev[key] || []),
        {},
      ],
    }));
  };

  const handleRemoveObject = (key, index) => {
    setPlantation((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Yuklanmoqda...</Text>
      </View>
    );
  }

  if (!plantation) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Plantatsiya ma’lumotlari yuklanmadi.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Orqaga</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Plantatsiyani Tahrirlash</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Umumiy Ma’lumotlar</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Tashkil etilgan yil:</Text>
          <TextInput
            style={styles.input}
            value={String(plantation.garden_established_year)}
            onChangeText={(value) =>
              setPlantation((prev) => ({ ...prev, garden_established_year: parseInt(value, 10) }))
            }
            placeholder="Tashkil etilgan yil"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Umumiy maydon (gektar):</Text>
          <TextInput
            style={styles.input}
            value={String(plantation.total_area)}
            onChangeText={(value) =>
              setPlantation((prev) => ({ ...prev, total_area: parseFloat(value) }))
            }
            placeholder="Umumiy maydon (gektar)"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Sug’oriladigan maydon (gektar):</Text>
          <TextInput
            style={styles.input}
            value={String(plantation.irrigation_area)}
            onChangeText={(value) =>
              setPlantation((prev) => ({ ...prev, irrigation_area: parseFloat(value) }))
            }
            placeholder="Sug’oriladigan maydon (gektar)"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Hosildorlik ko‘rsatkichi:</Text>
          <TextInput
            style={styles.input}
            value={String(plantation.fertility_score)}
            onChangeText={(value) =>
              setPlantation((prev) => ({ ...prev, fertility_score: parseFloat(value) }))
            }
            placeholder="Hosildorlik ko‘rsatkichi"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Yer turi:</Text>
          <TouchableOpacity onPress={() => setShowLandTypePicker(!showLandTypePicker)}>
            <Text style={styles.input}>{landType}</Text>
          </TouchableOpacity>
          {showLandTypePicker && (
            <Picker
              selectedValue={String(landType)}
              style={styles.picker}
              onValueChange={(value) => {
                setLandType(Number(value));
                setPlantation((prev) => ({ ...prev, land_type: Number(value) }));
              }}
            >
              <Picker.Item label="Lalmi" value="1" />
              <Picker.Item label="Tog’ oldi" value="2" />
              <Picker.Item label="Adir" value="3" />
              <Picker.Item label="Sug’oriladigan maydon" value="4" />
            </Picker>
          )}
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Qaror turi:</Text>
          <TouchableOpacity onPress={() => setShowQarorTypePicker(!showQarorTypePicker)}>
            <Text style={styles.input}>{qarorType}</Text>
          </TouchableOpacity>
          {showQarorTypePicker && (
            <Picker
              selectedValue={String(qarorType)}
              style={styles.picker}
              onValueChange={(value) => {
                setQarorType(Number(value));
                setPlantation((prev) => ({ ...prev, qaror_type: Number(value) }));
              }}
            >
              <Picker.Item label="Tog’ridan togri" value="1" />
              <Picker.Item label="Ochiq eletron tanlov asosida" value="2" />
            </Picker>
          )}
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Not usable area:</Text>
          <TextInput
            style={styles.input}
            value={String(plantation.not_usable_area)}
            onChangeText={(value) =>
              setPlantation((prev) => ({ ...prev, not_usable_area: parseFloat(value) }))
            }
            placeholder="Not usable area"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Is Fertile:</Text>
          <Switch
            value={plantation.is_fertile}
            onValueChange={(value) =>
              setPlantation((prev) => ({ ...prev, is_fertile: value }))
            }
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Fenced:</Text>
          <Switch
            value={plantation.fenced}
            onValueChange={(value) =>
              setPlantation((prev) => ({ ...prev, fenced: value }))
            }
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subsidiyalar</Text>
        {plantation.subsidies.map((subsidy, index) => (
          <View key={index} style={styles.objectItem}>
            <TextInput
              style={styles.input}
              value={String(subsidy.year)}
              onChangeText={(value) => {
                const updatedSubsidies = [...plantation.subsidies];
                updatedSubsidies[index].year = parseInt(value, 10);
                setPlantation((prev) => ({ ...prev, subsidies: updatedSubsidies }));
              }}
              placeholder="Yil"
            />
            <TextInput
              style={styles.input}
              value={String(subsidy.amount)}
              onChangeText={(value) => {
                const updatedSubsidies = [...plantation.subsidies];
                updatedSubsidies[index].amount = parseFloat(value);
                setPlantation((prev) => ({ ...prev, subsidies: updatedSubsidies }));
              }}
              placeholder="Miqdor (UZS)"
            />
            <TextInput
              style={styles.input}
              value={String(subsidy.direction)}
              onChangeText={(value) => {
                const updatedSubsidies = [...plantation.subsidies];
                updatedSubsidies[index].direction = value;
                setPlantation((prev) => ({ ...prev, subsidies: updatedSubsidies }));
              }}
              placeholder="Yo‘nalish"
            />
            <TextInput
              style={styles.input}
              value={String(subsidy.efficiency)}
              onChangeText={(value) => {
                const updatedSubsidies = [...plantation.subsidies];
                updatedSubsidies[index].efficiency = value;
                setPlantation((prev) => ({ ...prev, subsidies: updatedSubsidies }));
              }}
              placeholder="Samaradorlik"
            />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveObject('subsidies', index)}
            >
              <Text style={styles.removeButtonText}>O‘chirish</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddObject('subsidies')}
        >
          <Text style={styles.addButtonText}>Subsidiyani qo‘shish</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Investitsiyalar</Text>
        {plantation.investments.map((investment, index) => (
          <View key={index} style={styles.objectItem}>
            <TextInput
              style={styles.input}
              value={String(investment.invest_type)}
              onChangeText={(value) => {
                const updatedInvestments = [...plantation.investments];
                updatedInvestments[index].invest_type = value;
                setPlantation((prev) => ({ ...prev, investments: updatedInvestments }));
              }}
              placeholder="Tur"
            />
            <TextInput
              style={styles.input}
              value={String(investment.investment_amount)}
              onChangeText={(value) => {
                const updatedInvestments = [...plantation.investments];
                updatedInvestments[index].investment_amount = parseFloat(value);
                setPlantation((prev) => ({ ...prev, investments: updatedInvestments }));
              }}
              placeholder="Miqdor (UZS)"
            />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveObject('investments', index)}
            >
              <Text style={styles.removeButtonText}>O‘chirish</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddObject('investments')}
        >
          <Text style={styles.addButtonText}>Investitsiyani qo‘shish</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shpalerar</Text>
        {plantation.trellises.map((trellis, index) => (
          <View key={index} style={styles.objectItem}>
            <TextInput
              style={styles.input}
              value={String(trellis.trellis_installed_area)}
              onChangeText={(value) => {
                const updatedTrellises = [...plantation.trellises];
                updatedTrellises[index].trellis_installed_area = parseFloat(value);
                setPlantation((prev) => ({ ...prev, trellises: updatedTrellises }));
              }}
              placeholder="Maydon (gektar)"
            />
            <TextInput
              style={styles.input}
              value={String(trellis.trellis_type)}
              onChangeText={(value) => {
                const updatedTrellises = [...plantation.trellises];
                updatedTrellises[index].trellis_type = value;
                setPlantation((prev) => ({ ...prev, trellises: updatedTrellises }));
              }}
              placeholder="Shpalera turi"
            />
            <TextInput
              style={styles.input}
              value={String(trellis.trellis_count)}
              onChangeText={(value) => {
                const updatedTrellises = [...plantation.trellises];
                updatedTrellises[index].trellis_count = parseInt(value, 10);
                setPlantation((prev) => ({ ...prev, trellises: updatedTrellises }));
              }}
              placeholder="Shpalera soni"
            />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveObject('trellises', index)}
            >
              <Text style={styles.removeButtonText}>O‘chirish</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddObject('trellises')}
        >
          <Text style={styles.addButtonText}>Shpalerani qo‘shish</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suv omborlari</Text>
        {plantation.reservoirs.map((reservoir, index) => (
          <View key={index} style={styles.objectItem}>
            <TextInput
              style={styles.input}
              value={String(reservoir.reservoir_volume)}
              onChangeText={(value) => {
                const updatedReservoirs = [...plantation.reservoirs];
                updatedReservoirs[index].reservoir_volume = value;
                setPlantation((prev) => ({ ...prev, reservoirs: updatedReservoirs }));
              }}
              placeholder="Hajmi"
            />
            <TextInput
              style={styles.input}
              value={String(reservoir.reservoir_type)}
              onChangeText={(value) => {
                const updatedReservoirs = [...plantation.reservoirs];
                updatedReservoirs[index].reservoir_type = value;
                setPlantation((prev) => ({ ...prev, reservoirs: updatedReservoirs }));
              }}
              placeholder="Ombor turi"
            />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveObject('reservoirs', index)}
            >
              <Text style={styles.removeButtonText}>O‘chirish</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddObject('reservoirs')}
        >
          <Text style={styles.addButtonText}>Suv omborini qo‘shish</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Saqlash</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate('FruitAreaScreen', { plantationId })}
      >
        <Text style={styles.nextButtonText}>Keyingi</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  backButton: { marginBottom: 8, padding: 8, backgroundColor: '#007BFF', borderRadius: 8 },
  backButtonText: { color: '#fff', fontSize: 16 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  label: { flex: 1, fontSize: 16 },
  input: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 8,
  },
  picker: { flex: 2 },
  objectItem: { marginBottom: 8, padding: 8, backgroundColor: '#f9f9f9', borderRadius: 8 },
  addButton: { backgroundColor: '#28a745', padding: 12, borderRadius: 8, marginBottom: 16 },
  addButtonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
  saveButton: { backgroundColor: '#007BFF', padding: 12, borderRadius: 8 },
  saveButtonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
  nextButton: { backgroundColor: '#007BFF', padding: 12, borderRadius: 8, marginTop: 16 },
  nextButtonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
  removeButton: { backgroundColor: '#FF5C5C', padding: 8, borderRadius: 8, marginTop: 8 },
  removeButtonText: { color: '#fff', textAlign: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', fontSize: 16 },
});

export default EditPlantationScreen;