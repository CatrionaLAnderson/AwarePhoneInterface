import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Searchbar } from 'react-native-paper'; 
import { supabase } from '../lib/supabase'; // Adjust the import path for your Supabase client

const numColumns = 4;
const screenWidth = Dimensions.get('window').width;
const itemSize = screenWidth / numColumns - 20;
const dockSize = screenWidth / 5;

export default function HomeScreen() {
  const navigation = useNavigation();

  // State for apps and search query
  const [apps, setApps] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch apps from Supabase
  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('apps').select('id, app_name, icon');
      if (error) {
        console.error('Error fetching apps:', error);
      } else {
        const formattedApps = data.map((app, index) => ({
          name: app.app_name,
          color: ['#f54242', '#42a5f5', '#66bb6a', '#ffca28', '#ab47bc', '#8d6e63'][index % 6], // Optional: Add colors dynamically
          icon: app.icon || 'help', // Use the icon from the database, fallback to a default if missing
        }));
        setApps(formattedApps);
      }
      setLoading(false);
    };

    fetchApps();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, { backgroundColor: item.color || '#8d6e63' }]} // Use default color if not provided
      onPress={() => navigation.navigate(item.name)}
    >
      <Ionicons name={item.icon} size={40} color="#fff" />
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderDockItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.dockItem, { backgroundColor: item.color }]}
      onPress={() => navigation.navigate(item.name)}
    >
      <Ionicons name={item.icon} size={40} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      {loading ? (
        <Text style={styles.loadingText}>Loading apps...</Text>
      ) : (
        <FlatList
          data={apps.filter((app) =>
            app.name.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
          numColumns={numColumns}
          contentContainerStyle={styles.grid}
        />
      )}

      <View style={styles.dockContainer}>
        <FlatList
          data={apps.slice(0, 4)} // Show the first 4 apps in the dock as an example
          renderItem={renderDockItem}
          keyExtractor={(item) => item.name}
          horizontal
          contentContainerStyle={styles.dock}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 40,
  },
  grid: {
    justifyContent: 'center',
  },
  item: {
    width: itemSize,
    height: itemSize,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  itemText: {
    marginTop: 5,
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  dockContainer: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dock: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  dockItem: {
    width: dockSize,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginHorizontal: 5,
  },
  searchbar: {
    backgroundColor: 'white',
    marginLeft: 1,
  },
  loadingText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
});