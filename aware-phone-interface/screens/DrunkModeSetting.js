import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { Card, Title, Paragraph, TouchableRipple } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDrunkMode } from "../constants/DrunkModeContext"; // ✅ Use Context API

const DrunkModeScreen = ({ navigation }) => {
  const { isDrunkMode, toggleDrunkMode } = useDrunkMode(); // ✅ Use context instead of ViewModel

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

      <View style={styles.toggleContainer}>
              <Text style={styles.toggleText}>Drunk Mode</Text>
              <TouchableOpacity onPress={toggleDrunkMode} style={styles.drunkModeButton}>
                <Text style={styles.drunkModeButtonText}>{isDrunkMode ? "ON" : "OFF"}</Text>
              </TouchableOpacity>
            </View>

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
              } else if (option.label === "Notifications") {
                navigation.navigate("NotificationRestrictions");
              } else if (option.label === "Health Recommendations") {
                navigation.navigate("HealthRecommendations");
              } else if (option.label === "Safety") {
                navigation.navigate("SafetySettings");
              } else if (option.label === "Activity Overview")
                navigation.navigate("ActivityOverview");
              }
            }
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
  text: {
    fontSize: 18,
  },
  gap: {  
    height: 20, // Adjust the height to create the desired gap
  },
  toggleContainer: {
    alignItems: "center",
    marginVertical: 20, // Adds space around the button
  },
  toggleText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10, // Adds spacing above the button
  },
  drunkModeButton: {
    backgroundColor: 'blue',
    padding: 8,
    borderRadius: 5,
  },
  drunkModeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default DrunkModeScreen;