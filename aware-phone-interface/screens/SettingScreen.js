import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Searchbar } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SettingScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = React.useState('');


    return (
        <View style={styles.container}>
            {/* Back Button & Title*/}
             <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.title}>Settings</Text>
            <Searchbar
            placeholder="Search"
            onChangeText={setSearchQuery}
            value={searchQuery}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 40, 
        paddingHorizontal:20, 
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 20,
    },
});

export default SettingScreen;