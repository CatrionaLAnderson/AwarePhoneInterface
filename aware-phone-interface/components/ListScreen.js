import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';

const ListItems = ({ items, navigation }) => {
  // State to keep track of the toggle switches (false by default)
  const [toggles, setToggles] = useState(items.map(() => false));

  // Handle the toggle switch change for each item
  const handleToggle = (index) => {
    const newToggles = [...toggles]; // Copy the current toggle state
    newToggles[index] = !newToggles[index]; // Toggle the state of the selected switch
    setToggles(newToggles); // Update the state
  };

  return (
    <View>
      {/* Iterate over the items and render each one */}
      {items.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          {/* TouchableOpacity to navigate to a screen when the item is pressed */}
          <TouchableOpacity style={styles.item} onPress={() => navigation.navigate(item.screen)}>
            <Text style={styles.itemText}>{item.label}</Text>
          </TouchableOpacity>
          
          {/* Switch to toggle the state */}
          <Switch
            value={toggles[index]} // Controlled by the state of the specific switch
            onValueChange={() => handleToggle(index)} // Call handleToggle when switch value changes
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
  },
  item: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
  },
});

export default ListItems;