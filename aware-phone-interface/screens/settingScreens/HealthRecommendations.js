import React, {useState} from 'react';
import {Text, StyleSheet, ScrollView, TouchableOpacity, TextInput} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Card, Title, Paragraph, List} from 'react-native-paper';
import { supabase } from '../../lib/supabase';

const HealthRecommendations = ({navigation}) => {
  const previousRouteName =
    navigation.getState().routes[navigation.getState().index - 1]?.name || "Back";

  // State variables for weight, height, and BMI
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [alcoholUnits, setAlcoholUnits] = useState(null);

  // Calculate BMI based on user input
  const calculateBMI = async () => {
    if (weight && height) {
      const heightMeters = height / 100;
      const bmiValue = (weight / (heightMeters * heightMeters)).toFixed(2);
      setBmi(bmiValue);
      calculateAlcoholUnits(bmiValue); // Calculate alcohol units based on BMI

      await supabase
        .from('user_health_data')
        .upsert([{ weight, height }])
        .then(({ error }) => {
          if (error) {
            console.error('Error saving data to Supabase:', error);
          } else {
            console.log('Health data saved to Supabase');
          }
        });
    }
  };

  // Calculate recommended alcohol units based on BMI
  const calculateAlcoholUnits = (bmiValue) => {
    let recommendedUnits = bmiValue < 18.5 ? 2 : bmiValue > 25 ? 4 : 3;
    setAlcoholUnits(recommendedUnits); // Set recommended units
  };

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="blue" />
        <Text style={styles.backButtonText}>{`${previousRouteName}`}</Text>
      </TouchableOpacity>

      {/* Header Card */}
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Ionicons name="heart" size={50} style={styles.icon} />
          <Title style={styles.title}>Health Recommendations</Title>
          <Paragraph style={styles.paragraph}>
            Below are Health Recommendations related to your alcohol intake
          </Paragraph>
        </Card.Content>
      </Card>

      {/* BMI Calculator Section */}
      <Text style={styles.sectionTitle}>BMI Calculator</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight} // Set weight state
      />
      <TextInput
        style={styles.input}
        placeholder="Enter height (cm)"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight} // Set height state
      />
      <TouchableOpacity style={styles.button} onPress={calculateBMI}>
        <Text style={styles.buttonText}>Calculate & Save BMI</Text>
      </TouchableOpacity>
      {bmi && <Text style={styles.resultText}>Your BMI: {bmi}</Text>}

      {/* Alcohol Unit Recommendations Section */}
      {alcoholUnits && (
        <Card style={styles.infoCard}>
          <Card.Content>
            <Title>Recommended Alcohol Intake</Title>
            <Paragraph>Based on your BMI, you should drink no more than {alcoholUnits} units per session.</Paragraph>
            <Paragraph>For reference, 3 units is roughly equivalent to:</Paragraph>
            <List.Item title="Pint of beer (around 4%)" left={() => <Ionicons name="beer" size={24} />} />
            <List.Item title="Large glass of wine (250ml, 12%)" left={() => <Ionicons name="wine" size={24} />} />
            <List.Item title="Double shot of spirits (50ml, 40%)" left={() => <Ionicons name="pint-outline" size={24} />} />
          </Card.Content>
        </Card>
      )}

      {/* Smart Drinking Tips Section */}
      <List.Section>
        <List.Subheader style={styles.sectionTitle}>Smart Drinking Tips</List.Subheader>
        <List.Item title="Drink water between alcoholic drinks" left={() => <Ionicons name="water" size={24} />} />
        <List.Item title="Eat before drinking to slow absorption" left={() => <Ionicons name="restaurant" size={24} />} />
        <List.Item title="Limit alcohol to one unit per hour" left={() => <Ionicons name="hourglass" size={24} />} />
        <List.Item title="Know your limits and drink responsibly" left={() => <Ionicons name="warning" size={24} />} />
      </List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  card: {
    marginTop: 60,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  cardContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 10,
  },
  backButtonText: {
    fontSize: 18,
    marginLeft: 5,
    color: 'blue',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  resultText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  infoCard: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
});

export default HealthRecommendations;
