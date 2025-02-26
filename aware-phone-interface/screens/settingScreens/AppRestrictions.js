import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { supabase } from '../../lib/supabase'; // Import Supabase client

const AppRestrictions = ({ navigation }) => {
  // State to store the list of apps
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get the previous route name
  const previousRouteName =
    navigation.getState().routes[navigation.getState().index - 1]?.name || 'Back';

  // Fetch apps with restriction status
  useEffect(() => {
    const fetchAppsWithRestrictions = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('apps')
        .select('id, app_name, app_restrictions (is_restricted)');

      if (error) {
        console.error('Error fetching apps:', error);
      } else {
        const formattedApps = data.map((app) => ({
          id: app.id,
          name: app.app_name,
          isRestricted: app.app_restrictions?.[0]?.is_restricted || false,
        }));
        setApps(formattedApps);
      }
      setLoading(false);
    };

    fetchAppsWithRestrictions();
  }, []);

  const handleToggle = async (appId, isRestricted) => {
  console.log('Toggling restriction for:', appId, 'New Status:', isRestricted);

  // Optimistically update UI first
  setApps((prevApps) =>
    prevApps.map((app) =>
      app.id === appId ? { ...app, isRestricted } : app
    )
  );

  // Check if the app already has a restriction entry
  const { data: existingEntry, error: fetchError } = await supabase
    .from('app_restrictions')
    .select('id')
    .eq('app_id', appId)
    .maybeSingle();

  if (fetchError) {
    console.error('Error checking existing restriction:', fetchError);
    return;
  }

  if (existingEntry) {
    // UPDATE if the row already exists
    const { error: updateError } = await supabase
      .from('app_restrictions')
      .update({ is_restricted: isRestricted })
      .eq('app_id', appId);

    if (updateError) {
      console.error('Error updating app restriction:', updateError);
    }
  } else {
    // INSERT if the row does not exist
    const { error: insertError } = await supabase
      .from('app_restrictions')
      .insert([{ app_id: appId, is_restricted: isRestricted }]);

    if (insertError) {
      console.error('Error inserting new restriction:', insertError);
    }
  }
};

  // Render each app with a toggle
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.name}</Text>
      <Switch
        value={item.isRestricted}
        onValueChange={(value) => {
          handleToggle(item.id, value); // Update restriction in Supabase
          setApps((prevApps) =>
            prevApps.map((app) =>
              app.id === item.id ? { ...app, isRestricted: value } : app
            )
          );
        }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Back Button & Title */}
      <Text style={styles.title}>App Restrictions</Text>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="blue" />
        <Text style={styles.backButtonText}>{previousRouteName}</Text>
      </TouchableOpacity>

      <View style={styles.appSelection}>
        {loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : apps.length === 0 ? (
          <Text style={styles.noAppsText}>No apps found.</Text>
        ) : (
          <FlatList
            data={apps}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 10,
    paddingLeft: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingTop: 60,
    paddingBottom: 10,
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
  appSelection: {
    marginTop: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 18,
  },
  noAppsText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
  },
});

export default AppRestrictions;