import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Text, Searchbar, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDrunkMode } from '@/constants/DrunkModeContext';

const SettingScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const { isDrunkMode } = useDrunkMode();

    const settingsOptions = [
        { label: 'Wi-Fi', icon: 'wifi' },
        { label: 'Bluetooth', icon: 'bluetooth' },
        { label: 'Mobile Service', icon: 'cellphone' },
        { label: 'Battery', icon: 'battery' },
        { label: 'General', icon: 'cog' },
        { label: 'Drunk Mode', icon: 'beer' },
        { label: 'Appearance', icon: 'palette' },
        { label: 'Control Centre', icon: 'remote' },
        { label: 'StandBy', icon: 'power' },
        {label: 'Contacts', icon: 'contacts'},
        {label: 'Location', icon: 'map-marker'},
        {label: 'Apps', icon: 'apps'},
    ];

    // Get the previous route name
    const previousRouteName = navigation.getState().routes[navigation.getState().index - 1]?.name || 'Back';

    return (
        
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.title}>Settings</Text>

            {/* Back Button & Title */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="blue" />
                <Text style={styles.backButtonText}>{`${previousRouteName}`}</Text>
            </TouchableOpacity>
            
            <Searchbar
                placeholder="Search"
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={{ marginBottom: 10, backgroundColor: 'lightgrey', borderRadius: 10 }}
            />
            {settingsOptions.map((option, index) => (
                    <React.Fragment key={index}>
                        <TouchableRipple
                           onPress={() => {
                            if (option.label === 'Drunk Mode') {
                                if (isDrunkMode) {
                                  Alert.alert("Access Denied", "You can't access Drunk Mode settings while Drunk Mode is active.");
                                  return;
                                }
                                navigation.navigate('DrunkModeSetting');
                            }
                        }}
                            style={styles.button}
                        >
                            <View style={styles.buttonContent}>
                                <Icon name={option.icon} size={24} color="#000" style={styles.icon} />
                                <Text style={styles.text}>{option.label}</Text>
                            </View>
                        </TouchableRipple>
                        {(index + 1) % 4 === 0 && <View style={styles.gap} />}
                    </React.Fragment>
                ))}
            </ScrollView>
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
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    gap: {
        height: 20, // Adjust the height to create the desired gap
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        paddingTop: 80,
        paddingBottom: 10,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: 10,
    },
    backButtonText: {
        fontSize: 18,
        marginLeft: 5,
        color: 'blue',
    },
    button: {
        width: 362,
        height: 44,
        flexShrink: 0,
        borderRadius: 10,
        backgroundColor: '#FFF',
        marginBottom: 10,
        justifyContent: 'center',
        borderColor: 'lightgrey',
        borderWidth:1,
      },
      buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
      },
    icon: {
        marginRight: 10,
    },
    text: {
        fontSize: 18,
    },
});

export default SettingScreen;