import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card, Title, Paragraph, List } from 'react-native-paper';
import { supabase } from '../../lib/supabase';

const NotificationRestrictions = ({ navigation }) => {
  const [apps, setApps] = useState([]); // Store fetched apps
  const [loading, setLoading] = useState(true); // Show loading state

  // Get the previous route name for the back button
  const previousRouteName =
    navigation.getState().routes[navigation.getState().index - 1]?.name || "Back";

  // Fetch data when component loads
  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    setLoading(true);
  
    // 1️⃣ Fetch all apps from the "apps" table
    const { data: appsData, error: appsError } = await supabase
      .from('apps')
      .select('id, app_name'); // Get all apps
  
    if (appsError) {
      console.error('Error fetching apps:', appsError);
      setLoading(false);
      return;
    }
  
    // 2️⃣ Fetch existing mute settings from "notifications"
    const { data: notificationsData, error: notificationsError } = await supabase
      .from('notifications')
      .select('app_id, is_muted');
  
    if (notificationsError) {
      console.error('Error fetching notifications:', notificationsError);
      setLoading(false);
      return;
    }
  
    // 3️⃣ Merge data so every app has an "is_muted" status
    const appsWithMuteStatus = appsData.map((app) => {
      const notification = notificationsData.find((n) => n.app_id === app.id);
      return {
        ...app,
        is_muted: notification ? notification.is_muted : false, // Default to false if missing
      };
    });
  
    console.log("Final app data:", appsWithMuteStatus); // Debugging log
    setApps(appsWithMuteStatus);
    setLoading(false);
  };

  const toggleMute = async (app_id, currentValue) => {
    // Check if a mute setting exists for this app
    const { data: existingEntry, error: checkError } = await supabase
      .from('notifications')
      .select('id')
      .eq('app_id', app_id)
      .single(); // Get only one record
  
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking notification:', checkError);
      return;
    }
  
    if (existingEntry) {
      // If entry exists, update it
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ is_muted: !currentValue })
        .eq('app_id', app_id);
  
      if (updateError) {
        console.error('Error updating mute status:', updateError);
        return;
      }
    } else {
      // If no entry, create a new row
      const { error: insertError } = await supabase
        .from('notifications')
        .insert([{ app_id, is_muted: !currentValue }]);
  
      if (insertError) {
        console.error('Error inserting mute status:', insertError);
        return;
      }
    }
  
    // Update UI state
    setApps((prevApps) =>
      prevApps.map((app) =>
        app.id === app_id ? { ...app, is_muted: !currentValue } : app
      )
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="blue" />
        <Text style={styles.backButtonText}>{`${previousRouteName}`}</Text>
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
      {loading && <Text style={styles.loadingText}>Loading...</Text>}

      {/* Show list of apps with mute toggles */}
      <List.Section>
    {apps.map((app) => (
      <List.Item
        key={app.id}
        title={app.app_name} // App name
        description={app.is_muted ? "Muted" : "Not Muted"} // Small line under name
        right={() => (
          <Switch
            value={app.is_muted}
            onValueChange={() => toggleMute(app.id, app.is_muted)}
          />
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