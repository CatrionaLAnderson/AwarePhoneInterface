import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Text,
} from "react-native";
import { Card, Title, Paragraph, List, TouchableRipple } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDrunkMode } from "../constants/DrunkModeContext";

const DrunkModeScreen = ({ navigation }) => {
  const { isDrunkMode, toggleDrunkMode } = useDrunkMode(); // Use the global context
  
  const previousRouteName =
    navigation.getState().routes[navigation.getState().index - 1]?.name || "Back";

  const drunkOptions = [
    { label: "App restrictions", icon: "apps" },
    { label: "Contact restrictions", icon: "contacts" },
    { label: "Notifications", icon: "bell" },
    { label: "Alerts", icon: "alert" },
    { label: "Safety", icon: "seatbelt" },
    { label: "Health Recommendations", icon: "heart" },
    { label: "Activity Overview", icon: "align-vertical-bottom" },
  ];

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
          <Ionicons name="beer" size={50} style={styles.icon} />
          <Title style={styles.title}>Drunk Mode</Title>
          <Paragraph style={styles.paragraph}>
            Here there will be a description explaining what drunk mode is for.
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Drunk Mode Toggle */}
      <List.Item
        title="Drunk Mode"
        style={styles.drunkButton}
        right={() => (
          <Switch
            value={isDrunkMode}
            onValueChange={toggleDrunkMode} // Toggle global Drunk Mode
          />
        )}
      />

      {/* Drunk Mode Options */}
      {drunkOptions.map((option, index) => (
        <React.Fragment key={index}>
        <TouchableRipple
          onPress={() => {
            if (option.label === "App restrictions") {
              navigation.navigate("AppRestrictions");
            } else if (option.label === "Contact restrictions") {
              navigation.navigate("ContactRestrictions");
            } else if (option.label === "Alerts") {
              navigation.navigate("Alerts");
            } else if (option.label === "Notifications"){
              navigation.navigate("NotificationRestrictions");
            } else if (option.label === "Health Recommendations"){
              navigation.navigate("HealthRecommendations");
            } else if (option.label === "Safety"){
              navigation.navigate("SafetySettings");
            }
          }}
          style={styles.button}
        >
          <View style={styles.buttonContent}>
            <Icon name={option.icon} size={24} color="#000" style={styles.icon} />
            <Text style={styles.text}>{option.label}</Text>
            <Ionicons name="arrow-forward" size={24} color="lightgrey" style={styles.icon2} />
          </View>
        </TouchableRipple>
        {(index + 1) % 4 === 0 && <View style={styles.gap} />}
      </React.Fragment>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
      },
      card: {
        marginTop: 60,
        marginVertical: 16,
        borderRadius: 10,
        backgroundColor: "#ffffff",
        padding: 16, // Add padding to ensure content is not too close to the edges
      },
      cardContent: {
        justifyContent: "center",
        alignItems: "center",
      },
      icon: {
        marginBottom: 10,
      },
      icon2: {
        position: 'absolute',
        right: 10,
      },
      title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: 'center', // Center the text inside the title
      },
      paragraph: {
        fontSize: 16,
        textAlign: 'center', // Center the text inside the paragraph
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
    button2: {
        width: 362,
        height: 64,
        flexShrink: 0,
        borderRadius: 10,
        backgroundColor: '#FFF',
        marginBottom: 10,
        justifyContent: 'center',
        borderColor: 'lightgrey',
        borderWidth:1,
        marginTop: 30,
    },
    drunkButton: {
        width: 362,
        height: 64,
        flexShrink: 0,
        borderRadius: 10,
        backgroundColor: '#FFF',
        marginBottom: 30,
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
    extrainfo: {
        fontSize: 16,
        color: 'grey',
        paddingLeft: 10,
        paddingBottom: 10,
    },
    gap: {  
        height: 20, // Adjust the height to create the desired gap
    },

});

export default DrunkModeScreen;