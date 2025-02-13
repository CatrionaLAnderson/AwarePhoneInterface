import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card, Title, Paragraph, List } from 'react-native-paper';
import { supabase } from '../../lib/supabase';

const HealthRecommendations = ({ navigation }) => {
    const previousRouteName =
    navigation.getState().routes[navigation.getState().index - 1]?.name || "Back";


return (

    <ScrollView style={styles.container}>



    {/* Back Button & Title */}
        <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
        >
            <Ionicons name="arrow-back" size={24} color="blue" />
            <Text style={styles.backButtonText}>{`${previousRouteName}`}</Text>
        </TouchableOpacity>

        {/* Header Card */}
        <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
                <Ionicons name="heart" size={50} style={styles.icon} />
                <Title style={styles.title}>Health Recommendations</Title>
                <Paragraph style={styles.paragraph}>
                    Below are Health Recommendations related to your alcohol intake
                </Paragraph>
            </Card.Content>
        </Card>

        <Text>BMI calc</Text>
        <Text>Aclhol unit recommendations</Text>





    </ScrollView>


    )
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
      },
      card: {
        marginTop: 60,
        marginVertical: 16,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        padding: 16,
      },
      cardContent: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      icon: {
        marginBottom: 10,
      },
      title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      paragraph: {
        fontSize: 16,
        textAlign: 'center',
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
      loadingText: {
        textAlign: 'center',
        marginVertical: 10,
      },
      noDataText: {
        textAlign: 'center',
        marginVertical: 10,
        fontSize: 16,
        color: 'gray',
      },
});




export default HealthRecommendations



