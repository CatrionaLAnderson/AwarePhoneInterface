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
import { useDrunkMode } from "../constants/DrunkModeContext"; // Import the context

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
  
  // Global Drunk Mode state
  const { isDrunkMode, toggleDrunkMode } = useDrunkMode(); // Use global Drunk Mode state

  // Fetch apps dynamically
  const fetchApps = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('apps')
      .select('id, app_name, icon, colour, app_restrictions (is_restricted)');
  
    if (error) {
      console.error('Error fetching apps:', error);
    } else {
      console.log('Fetched Apps Data:', data); // Check if "colour" is being retrieved correctly
  
      const formattedApps = data.map((app) => ({
        id: app.id,
        name: app.app_name,
        colour: app.colour || '#707B7C', // Fallback to default grey if no colour is set
        icon: app.icon || 'help',
        isRestricted: app.app_restrictions?.[0]?.is_restricted || false,
      }));
      
      console.log('Formatted Apps Data:', formattedApps); // Log formatted apps
  
      setApps(formattedApps);
    }
    setLoading(false);
  };

  // Load apps on mount & subscribe to real-time updates
  useEffect(() => {
    fetchApps(); // Initial fetch

    // Wait for changes in `app_restrictions`
    const subscription = supabase
      .channel('realtime app_restrictions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'app_restrictions' }, fetchApps)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription); // Cleanup on unmount
    };
  }, []);

  // // Toggle Drunk Mode and refetch apps
  // const toggleDrunkMode = () => {
  //   setIsDrunkMode((prev) => !prev);
  //   fetchApps(); // Ensure restrictions update immediately
  // };

  // Filter apps based on Drunk Mode
  const visibleApps = apps.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => {
    const isDisabled = isDrunkMode && item.isRestricted;
  
    console.log(`Rendering ${item.name}: ${item.colour}`); // Log colour for each app
  
    return (
      <TouchableOpacity
        style={[
          styles.item,
          { backgroundColor: item.colour || '#707B7C', opacity: isDisabled ? 0.5 : 1 }, // Ensure "colour" is applied
        ]}
        onPress={() => !isDisabled && navigation.navigate(item.name)}
        disabled={isDisabled}
      >
        <Ionicons name={item.icon} size={40} color="#fff" />
        <Text style={styles.itemText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };


  const renderDockItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.dockItem, { backgroundColor: item.colour || '#707B7C' }]} // Use "colour" instead of "color"
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

      {/*Drunk Mode Toggle*/}
      <View style={styles.drunkModeContainer}>
        <Text style={styles.drunkModeText}>Drunk Mode</Text>
        <TouchableOpacity onPress={toggleDrunkMode} style={styles.drunkModeButton}>
          <Text style={styles.drunkModeButtonText}>
            {isDrunkMode ? 'ON' : 'OFF'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* App Grid */}
      {loading ? (
        <Text style={styles.loadingText}>Loading apps...</Text>
      ) : (
        <FlatList
          data={visibleApps}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={styles.grid}
        />
      )}

      {/* Dock Apps */}
      <View style={styles.dockContainer}>
        <FlatList
          data={visibleApps.slice(0, 4)} // Show first 4 apps
          renderItem={renderDockItem}
          keyExtractor={(item) => item.id}
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
  drunkModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  drunkModeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  drunkModeButton: {
    backgroundColor: 'blue',
    padding: 8,
    borderRadius: 5,
  },
  drunkModeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});