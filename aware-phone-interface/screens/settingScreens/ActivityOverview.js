import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Modal } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Card, Title, Paragraph } from "react-native-paper";
import { Svg, Rect } from "react-native-svg"; 
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; 
import { Dimensions } from "react-native";
import {
  fetchTrackingData,
  formatDate,
  groupDataByDate,
  getBarChartData,
} from "@/services/ActivityService";

const ActivityOverview = ({ navigation }) => {
  const [trackingData, setTrackingData] = useState([]); // Stores the fetched tracking data
  const [loading, setLoading] = useState(true); // Indicates if data is loading
  const [modalVisible, setModalVisible] = useState(false); // Controls the modal visibility
  const [selectedDate, setSelectedDate] = useState(null); // Selected date for viewing detailed activity
  const [dateData, setDateData] = useState([]); // Stores the activity data for the selected date

  const previousRouteName =
    navigation.getState().routes[navigation.getState().index - 1]?.name || "Back"; // Get previous route name for back button

  // Fetch tracking data on initial load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTrackingData();
        setTrackingData(data); // Set the fetched data
      } catch (error) {
        console.error("Error fetching tracking data:", error);
      } finally {
        setLoading(false); // Data fetching complete
      }
    };

    fetchData(); // Call fetch data function
  }, []);

  // Handle the selection of a specific date
  const handleDateSelection = (date) => {
    setSelectedDate(date); // Set the selected date
    setDateData(groupedData[date]); // Set the data for the selected date
    setModalVisible(true); // Show the modal with detailed activities
  };

  const groupedData = groupDataByDate(trackingData); // Group tracking data by date

  // Render each activity item inside the modal
  const renderItem = ({ item }) => {
    if (!item) return null; // Prevent rendering if the item is empty
  
    return (
      <View style={styles.modalItemCard}>
        {/* Event Type with Icon */}
        <View style={styles.modalItemHeader}>
          <Ionicons
            name={
              item.event_type === "message"
                ? "chatbubble-outline"
                : item.event_type === "phone_call"
                ? "call-outline"
                : "notifications-outline"
            }
            size={20}
            color="#007bff"
            style={styles.modalItemIcon}
          />
          <Text style={styles.modalItemTitle}>
            {item.event_type === "message" && "Message"}
            {item.event_type === "phone_call" && "Phone Call"}
            {item.event_type === "notification_received" && "Notification"}
          </Text>
        </View>
  
        {/* Timestamp */}
        <Text style={styles.modalItemTimestamp}>
          {formatDate(item.timestamp)} {/* Format and display the timestamp */}
        </Text>
  
        {/* Event Details */}
        {item.event_type === "message" && item.message_preview && (
          <Text style={styles.modalItemContent}>
           {item.message_preview || "No preview available"} {/* Show message preview */}
          </Text>
        )}
  
        {item.event_type === "phone_call" && (
          <Text style={styles.modalItemContent}>
            {item.contact_name || "Unknown"} {/* Display the contact name for phone calls */}
          </Text>
        )}
  
        {item.event_type === "notification_received" && item.notification_content && (
          <Text style={styles.modalItemContent}>
            {item.notification_content || "No content"} {/* Display notification content */}
          </Text>
        )}
      </View>
    );
  };

  // Render the list of dates for which activity data is available
  // const renderDateSection = () => (
  //   <FlatList
  //     data={Object.keys(groupedData)} // Get the keys (dates) from groupedData
  //     keyExtractor={(item) => item}
  //     renderItem={({ item }) => (
  //       <TouchableOpacity
  //         style={styles.dateSection}
  //         onPress={() => handleDateSelection(item)} // Open modal for selected date
  //       >
  //         <Text style={styles.dateText}>{item} Activity</Text>
  //         <Ionicons name="chevron-down" size={20} color="#007bff" />
  //       </TouchableOpacity>
  //     )}
  //   />
  // );

  // Render content inside the modal for the selected date
  const renderModalContent = () => (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Activities on {selectedDate}</Text>
      <Text style={styles.dateText}>Total Activity: {dateData.length}</Text> {/* Display total activities */}
      <FlatList
        data={dateData} // Display activities for the selected date
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={renderItem}
      />
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setModalVisible(false)} // Close the modal
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );

  // Get data for the bar chart
  const { messageCount, callCount, notificationCount } = getBarChartData(trackingData);
  const maxCount = Math.max(messageCount, callCount, notificationCount);

  const screenWidth = Dimensions.get("window").width; 

  const barWidth = 60;
  const spacing = 60; 
  const chartHeight = 250; 
  const barCount = 3; 
  const chartWidth = Math.min(screenWidth - 90, barCount * (barWidth + spacing));

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: "#fff" }}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="blue" />
        <Text style={styles.backButtonText}>{previousRouteName || "Back"}</Text>
      </TouchableOpacity>

      <FlatList
        contentContainerStyle={styles.container}
        data={Object.keys(groupedData)}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.dateSection}
            onPress={() => handleDateSelection(item)}
          >
            <Text style={styles.dateText}>{item} Activity</Text>
            <Ionicons name="chevron-down" size={20} color="#007bff" />
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <>
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <Icon name="align-vertical-bottom" size={50} style={styles.icon} />
                <Title style={styles.title}>Drunk Mode Activity</Title>
                <Paragraph style={styles.paragraph}>
                  Track your activities while Drunk Mode is enabled, including messages, calls, and more.
                </Paragraph>
              </Card.Content>
            </Card>

            <Card style={styles.chartCard}>
              <Card.Content style={styles.cardContent}>
                <Text style={styles.chartTitle}>Activity Summary</Text>
                <Svg height={chartHeight} width={chartWidth}>
                  <Rect
                    x={0}
                    y={chartHeight - (messageCount / maxCount) * chartHeight}
                    width={barWidth}
                    height={(messageCount / maxCount) * chartHeight}
                    fill="skyblue"
                  />
                  <Rect
                    x={barWidth + spacing}
                    y={chartHeight - (callCount / maxCount) * chartHeight}
                    width={barWidth}
                    height={(callCount / maxCount) * chartHeight}
                    fill="green"
                  />
                  <Rect
                    x={(barWidth + spacing) * 2}
                    y={chartHeight - (notificationCount / maxCount) * chartHeight}
                    width={barWidth}
                    height={(notificationCount / maxCount) * chartHeight}
                    fill="coral"
                  />
                </Svg>
                <View style={styles.chartLabels}>
                  <Text style={styles.chartLabel}>Messages</Text>
                  <Text style={styles.chartLabel}>Calls</Text>
                  <Text style={styles.chartLabel}>Notifications</Text>
                </View>
              </Card.Content>
            </Card>
          </>
        }
        ListFooterComponent={<View style={{ marginBottom: 60 }} />}
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          {renderModalContent()}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  cardContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  eventText: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "bold",
    marginVertical: 5,
  },
  messagePreview: {
    fontSize: 14,
    color: "#555",
  },
  callPreview: {
    fontSize: 14,
    color: "#555",
  },
  notificationPreview: {
    fontSize: 14,
    color: "#555",
  },
  list: {
    marginBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dateSection: {
    padding: 15,
    marginVertical: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chartCard: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 40,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  chart: {
    marginVertical: 20,
    alignItems: "center",
  },
  chartLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  modalItemCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  
  modalItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  
  modalItemIcon: {
    marginRight: 10,
  },
  
  modalItemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  
  modalItemTimestamp: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  
  modalItemContent: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
    lineHeight: 20,

  },
  
  modalItemLabel: {
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    backgroundColor: "#FF6347", // Red button for closing modal
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
    marginLeft: 10,
  },
  backButtonText: {
    fontSize: 18,
    marginLeft: 5,
    color: 'blue',
  },
});

export default ActivityOverview;