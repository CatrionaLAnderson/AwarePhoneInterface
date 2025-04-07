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
  const [trackingData, setTrackingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateData, setDateData] = useState([]);

  const previousRouteName =
    navigation.getState().routes[navigation.getState().index - 1]?.name || "Back";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTrackingData();
        setTrackingData(data);
      } catch (error) {
        console.error("Error fetching tracking data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDateSelection = (date) => {
    setSelectedDate(date);
    setDateData(groupedData[date]);
    setModalVisible(true);
  };

  const groupedData = groupDataByDate(trackingData);

  const renderItem = ({ item }) => {
    if (!item) return null;
  
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
          {formatDate(item.timestamp)}
        </Text>
  
        {/* Event Details */}
        {item.event_type === "message" && item.message_preview && (
          <Text style={styles.modalItemContent}>
           {item.message_preview || "No preview available"}
          </Text>
        )}
  
        {item.event_type === "phone_call" && (
          <Text style={styles.modalItemContent}>
            {item.contact_name || "Unknown"}
          </Text>
        )}
  
        {item.event_type === "notification_received" && item.notification_content && (
          <Text style={styles.modalItemContent}>
            {item.notification_content || "No content"}
          </Text>
        )}
      </View>
    );
  };

  const renderDateSection = () => (
    <FlatList
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
    />
  );

  const renderModalContent = () => (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Activities on {selectedDate}</Text>
      <Text style={styles.dateText}>Total Activity: {dateData.length}</Text>
      <FlatList
        data={dateData}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={renderItem}
      />
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setModalVisible(false)}
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );

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