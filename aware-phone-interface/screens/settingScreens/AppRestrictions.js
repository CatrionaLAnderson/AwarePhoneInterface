import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Card, Title, Paragraph, List } from "react-native-paper";
import { fetchAllApps, fetchAppRestrictions, toggleAppRestriction } from "@/services/AppService";

const AppRestrictions = ({ navigation }) => {
  const [apps, setApps] = useState([]); // State for storing apps and their restriction status
  const [loading, setLoading] = useState(true); // Loading state to handle fetching data

  const previousRouteName = navigation.getState().routes[navigation.getState().index - 1]?.name || 'Back';

  // Fetch all apps and their restriction status on component mount
  useEffect(() => {
    const loadApps = async () => {
      setLoading(true);
      try {
        const allApps = await fetchAllApps();
        const updatedApps = await fetchAppRestrictions(allApps); // Merge apps and their restriction data
        setApps(updatedApps); // Update state with the app data
      } catch (error) {
        console.error("Error loading apps:", error);
      }
      setLoading(false); // Set loading to false after fetching data
    };

    loadApps();
  }, []);

  // Handle toggle of app restriction status
  const handleToggle = async (appId, isRestricted) => {
    const success = await toggleAppRestriction(appId, isRestricted); // Toggle app restriction in DB

    if (success) {
      // Update the app state with the new restriction status
      setApps((prevApps) =>
        prevApps.map((app) =>
          app.id === appId ? { ...app, isRestricted: isRestricted } : app
        )
      );
    }
  };

  return (
    <ScrollView style={styles.container}>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="blue" />
        <Text style={styles.backButtonText}>{previousRouteName}</Text>
      </TouchableOpacity>

      {/* Header Card */}
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Ionicons name="apps" size={50} style={styles.icon} />
          <Title style={styles.title}>App Restrictions</Title>
          <Paragraph style={styles.paragraph}>
           Select which apps you want to restrict access to when drunk mode is enabled.
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Loading or App List */}
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : apps.length === 0 ? (
        <Text style={styles.noDataText}>No apps found.</Text>
      ) : (
        <View style={styles.listSection}>
          <List.Section>
            {apps.map((app) => (
              <List.Item
                key={app.id}
                title={app.name}
                description={app.isRestricted ? "Restricted" : "Not Restricted"}
                titleStyle={styles.listTitle}
                descriptionStyle={styles.listDescription}
                style={styles.listItem}
                right={() => (
                  <Switch
                    value={app.isRestricted} // Toggle app restriction state
                    onValueChange={(value) => handleToggle(app.id, value)} // Update restriction status
                  />
                )}
              />
            ))}
          </List.Section>
        </View>
      )}
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
    marginVertical: 16,
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
    left: 10,
  },
  backButtonText: {
    fontSize: 18,
    marginLeft: 5,
    color: 'blue',
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 10,
  },
  noDataText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
    color: 'gray',
  },
  listSection: {
    marginVertical: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  listItem: {
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  listTitle: {
    fontWeight: '600',
    fontSize: 16,
  },
  listDescription: {
    color: 'gray',
    fontSize: 14,
  },
});

export default AppRestrictions;