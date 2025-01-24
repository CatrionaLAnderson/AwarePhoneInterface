import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const SettingScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            {/* Add your settings components here */}
            <Button 
                title="Go Back" 
                onPress={() => navigation.goBack()} 
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default SettingScreen;