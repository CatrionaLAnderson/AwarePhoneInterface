import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
  FlatList,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { fetchAppsWithRestrictions, toggleAppRestriction } from "@/services/AppService";

const AppRestrictions = ({ navigation }) => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const previousRouteName =
    navigation.getState().routes[navigation.getState().index - 1]?.name || "Back";

    useEffect(() => {
      const loadApps = async () => {
        setLoading(true);
        setApps(await fetchAppsWithRestrictions(apps)); // Pass existing apps for merging
        setLoading(false);
      };
      loadApps();
    }, []);

  const handleToggle = async (appId, isRestricted) => {
    const success = await toggleAppRestriction(appId, isRestricted);

    if (success) {
      setApps((prevApps) =>
        prevApps.map((app) =>
          app.id === appId ? { ...app, isRestricted: isRestricted } : app
        )
      );
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.name}</Text>
      <Switch
        value={item.isRestricted}
        onValueChange={(value) => handleToggle(item.id, value)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Restrictions</Text>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="blue" />
        <Text style={styles.backButtonText}>{previousRouteName}</Text>
      </TouchableOpacity>

      <View style={styles.appSelection}>
        {loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : apps.length === 0 ? (
          <Text style={styles.noAppsText}>No apps found.</Text>
        ) : (
          <FlatList data={apps} renderItem={renderItem} keyExtractor={(item) => item.id} />
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