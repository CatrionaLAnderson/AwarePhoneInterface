import React, { useEffect, useState } from "react";
import { Text, StyleSheet, ScrollView, Switch, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Card, Title, Paragraph, List } from "react-native-paper";
import { fetchAppsWithNotificationStatus, toggleNotificationMute } from "@/services/NotificationService";

const NotificationRestrictions = ({ navigation }) => {
  const [apps, setApps] = useState([]); // State for storing apps and their notification mute status
  const [loading, setLoading] = useState(true); // Loading state to manage fetch process

  const previousRouteName = navigation.getState().routes[navigation.getState().index - 1]?.name || "Back";

  // Fetch apps and their notification mute status on component mount
  useEffect(() => {
    const loadApps = async () => {
      setLoading(true);
      const fetchedApps = await fetchAppsWithNotificationStatus(); // Get apps and mute status
      setApps(fetchedApps); // Update state with fetched apps
      setLoading(false); // Set loading state to false
    };

    loadApps();
  }, []);

  // Toggle notification mute status for a specific app
  const handleToggle = async (appId, isMuted) => {
    const success = await toggleNotificationMute(appId, isMuted); // Update mute status in DB

    if (success) {
      setApps((prevApps) =>
        prevApps.map((app) =>
          app.id === appId ? { ...app, isMuted: !isMuted } : app
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
          <Ionicons name="notifications" size={50} style={styles.icon} />
          <Title style={styles.title}>Notifications</Title>
          <Paragraph style={styles.paragraph}>
            Select which notifications you want to receive/block when Drunk Mode is enabled.
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Loading Text */}
      {loading ? <Text style={styles.loadingText}>Loading...</Text> : null}

      {/* Display List of Apps with Mute Toggles */}
      <View style={styles.listSection}>
        <List.Section>
          {apps.map((app) => (
            <List.Item
              key={app.id}
              title={app.name}
              description={app.isMuted ? "Muted" : "Not Muted"} // Show mute status
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
              style={styles.listItem}
              right={() => (
                <Switch
                  value={app.isMuted} // Toggle mute status
                  onValueChange={() => handleToggle(app.id, app.isMuted)} // Update mute status
                />
              )}
            />
          ))}
        </List.Section>
      </View>
    </ScrollView>
  );
};

// Styles
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

export default NotificationRestrictions;