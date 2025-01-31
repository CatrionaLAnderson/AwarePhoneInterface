import React from 'react';
import ListScreen from '../../components/ListScreen';
import { StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AppRestrictions = ({ navigation }) => {
  // Get the previous route name
  const previousRouteName = navigation.getState().routes[navigation.getState().index - 1]?.name || 'Back';

  //change this to the supabase query in the future
  const items = [
    { label: 'App 1', screen: 'App1Screen' },
    { label: 'App 2', screen: 'App2Screen' },
    // Add more items here
  ];

  return (
    <View style={styles.container}>
      {/* Back Button & Title */}
      <Text style={styles.title}>App restricitons</Text>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="blue" />
                <Text style={styles.backButtonText}>{`${previousRouteName}`}</Text>
            </TouchableOpacity>


    <View style={styles.appSelection}>
        <ListScreen title="Contact Restrictions" style={styles.appSelection} items={items} navigation={navigation} />
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
});

export default AppRestrictions;