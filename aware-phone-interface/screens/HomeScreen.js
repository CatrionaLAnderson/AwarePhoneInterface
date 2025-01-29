import React from 'react';
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

const apps = [
  { name: 'Phone', color: '#f54242', icon: 'call' },
  { name: 'Messages', color: '#42a5f5', icon: 'chatbubble' },
  { name: 'Camera', color: '#66bb6a', icon: 'camera' },
  { name: 'Photos', color: '#ffca28', icon: 'images' },
  { name: 'Calendar', color: '#ab47bc', icon: 'calendar' },
  { name: 'Settings', color: '#8d6e63', icon: 'settings' },
  { name: 'Uber', color: '#546e7a', icon: 'car' },
  { name: 'Spotify', color: '#1db954', icon: 'musical-notes' },
  { name: 'Instagram', color: '#e1306c', icon: 'logo-instagram' },
];

const dockApps = [
  { name: 'Phone', color: '#f54242', icon: 'call' },
  { name: 'Messages', color: '#42a5f5', icon: 'chatbubble' },
  { name: 'Safari', color: '#007aff', icon: 'compass' },
  { name: 'Music', color: '#ff3b30', icon: 'musical-notes' },
];

const numColumns = 4;
const screenWidth = Dimensions.get('window').width;
const itemSize = screenWidth / numColumns - 20;
const dockSize = screenWidth / 5;

export default function HomeScreen() {
  const navigation = useNavigation();
   const [searchQuery, setSearchQuery] = React.useState('');

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.item, { backgroundColor: item.color }]} onPress={() => navigation.navigate(item.name)}>
      <Ionicons name={item.icon} size={40} color="#fff" />
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderDockItem = ({ item }) => (
    <TouchableOpacity style={[styles.dockItem, { backgroundColor: item.color }]} onPress={() => navigation.navigate(item.name)}>
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
      
      <FlatList
        data={apps}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        numColumns={numColumns}
        contentContainerStyle={styles.grid}
      />

      
      <View style={styles.dockContainer}>
       

        <FlatList
          data={dockApps}
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
    paddingHorizontal: 10,
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
});
