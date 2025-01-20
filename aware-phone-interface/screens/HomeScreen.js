import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const apps = [
  { name: 'Phone', color: '#f54242' },
  { name: 'Messages', color: '#42a5f5' },
  { name: 'Camera', color: '#66bb6a' },
  { name: 'Photos', color: '#ffca28' },
  { name: 'Calendar', color: '#ab47bc' },
  { name: 'Settings', color: '#8d6e63' },
  { name: 'Uber', color: '#546e7a' },
  { name: 'Spotify', color: '#1db954' },
  { name: 'Instagram', color: '#e1306c' },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>12:30</Text>
      </View>

      {/* App Grid */}
      <FlatList
        data={apps}
        keyExtractor={(item) => item.name}
        numColumns={3}
        contentContainerStyle={styles.appGrid}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.appIcon, { backgroundColor: item.color }]}>
            <Text style={styles.appName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Dock */}
      <View style={styles.dock}>
        <TouchableOpacity style={styles.dockIcon}>
          <Text style={styles.appName}>Phone</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dockIcon}>
          <Text style={styles.appName}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dockIcon}>
          <Text style={styles.appName}>Safari</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: 10,
  },
  statusBar: {
    height: 60,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  appGrid: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  appIcon: {
    flex: 1,
    height: 100,
    margin: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  dock: {
    height: 80,
    backgroundColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dockIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#757575',
    width: 70,
    height: 70,
    borderRadius: 35,
  },
});