import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Card, Title, Paragraph, List } from "react-native-paper";
import { fetchAppsWithNotificationStatus, toggleNotificationMute } from "@/services/NotificationService";

const NotificationRestrictions = ({ navigation }) => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const previousRouteName =
    navigation.getState().routes[navigation.getState().index - 1]?.name || "Back";

  useEffect(() => {
    const loadApps = async () => {
      setLoading(true);
      const fetchedApps = await fetchAppsWithNotificationStatus();
      setApps(fetchedApps);
      setLoading(false);
    };

    loadApps();
  }, []);

  const handleToggle = async (appId, isMuted) => {
    const success = await toggleNotificationMute(appId, isMuted);

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

      {/* Show loading state */}
      {loading ? <Text style={styles.loadingText}>Loading...</Text> : null}

      {/* Show list of apps with mute toggles */}
      <List.Section>
        {apps.map((app) => (
          <List.Item
            key={app.id}
            title={app.name}
            description={app.isMuted ? "Muted" : "Not Muted"}
            right={() => (
              <Switch value={app.isMuted} onValueChange={() => handleToggle(app.id, app.isMuted)} />
            )}
          />
        ))}
      </List.Section>
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
});

export default NotificationRestrictions;