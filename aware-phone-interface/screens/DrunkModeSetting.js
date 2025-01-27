import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Searchbar, TouchableRipple } from 'react-native-paper';


const DrunkModeSetting = ({ navigation }) => {


    return  (
        <View style={styles.container}>
            <Text style={styles.title}>Drunk Mode</Text>
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
        paddingTop: 80,
        paddingBottom: 10,
    },

});

export default DrunkModeSetting;