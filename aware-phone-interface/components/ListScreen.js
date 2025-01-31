import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';

const ListItems = ({ items, navigation }) => {
  const [toggles, setToggles] = useState(items.map(() => false));

  const handleToggle = (index) => {
    const newToggles = [...toggles];
    newToggles[index] = !newToggles[index];
    setToggles(newToggles);
  };

  return (
    <View>
      {items.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <TouchableOpacity style={styles.item} onPress={() => navigation.navigate(item.screen)}>
            <Text style={styles.itemText}>{item.label}</Text>
          </TouchableOpacity>
          <Switch
            value={toggles[index]}
            onValueChange={() => handleToggle(index)}
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