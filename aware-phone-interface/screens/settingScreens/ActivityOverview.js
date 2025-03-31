import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Modal } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { supabase } from "@/lib/supabase"; 
import { Card, Title, Paragraph } from "react-native-paper";
import { Svg, Rect } from "react-native-svg"; 
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; 
import { Dimensions } from "react-native";

const ActivityOverview = ({ navigation }) => {
  const [trackingData, setTrackingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateData, setDateData] = useState([]);

  const previousRouteName =
    navigation.getState().routes[navigation.getState().index - 1]?.name || "Back";

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const { data, error } = await supabase
          .from("tracking_data")
          .select("*")
          .in("event_type", ["message", "phone_call", "notification_received"])
          .order("timestamp", { ascending: false }); // Order by most recent data

        if (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
          return;
        }

        setTrackingData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tracking data:", err);
        setLoading(false);
      }
    };

    fetchTrackingData();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const groupDataByDate = () => {
    const groupedData = {};
    trackingData.forEach((item) => {
      const date = formatDate(item.timestamp); 
      if (!groupedData[date]) {
        groupedData[date] = [];
      }
      groupedData[date].push(item);
    });
    return groupedData;
  };

  const handleDateSelection = (date) => {
    setSelectedDate(date);
    setDateData(groupedData[date]);
    setModalVisible(true);
  };

  const groupedData = groupDataByDate();

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

  // Bar Chart Data
  const getBarChartData = () => {
    const messageCount = trackingData.filter(item => item.event_type === "message").length;
    const callCount = trackingData.filter(item => item.event_type === "phone_call").length;
    const notificationCount = trackingData.filter(item => item.event_type === "notification_received").length;

    return { messageCount, callCount, notificationCount };
  };

  const { messageCount, callCount, notificationCount } = getBarChartData();
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
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="blue" />
        <Text style={styles.backButtonText}>{previousRouteName || "Back"}</Text>
      </TouchableOpacity>

      {/* Header Card */}
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Icon name="align-vertical-bottom" size={50} style={styles.icon} />
          <Title style={styles.title}>Drunk Mode Activity</Title>
          <Paragraph style={styles.paragraph}>
            Track your activities while Drunk Mode is enabled, including messages, calls, and more.
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Date Section */}
      {renderDateSection()}

      {/* Bar Chart Card */}
      <Card style={styles.chartCard}>
        <Card.Content style={styles.cardContent}>
          <Text style={styles.chartTitle}>Activity Summary</Text>
          <Svg height={chartHeight} width={chartWidth}>
            {/* Messages Bar */}
            <Rect
              x={0} // Position of the first bar
              y={chartHeight - (messageCount / maxCount) * chartHeight}
              width={barWidth}
              height={(messageCount / maxCount) * chartHeight}
              fill="skyblue"
            />
            {/* Calls Bar */}
            <Rect
              x={barWidth + spacing} // Position of the second bar
              y={chartHeight - (callCount / maxCount) * chartHeight}
              width={barWidth}
              height={(callCount / maxCount) * chartHeight}
              fill="green"
            />
            {/* Notifications Bar */}
            <Rect
              x={(barWidth + spacing) * 2} // Position of the third bar
              y={chartHeight - (notificationCount / maxCount) * chartHeight}
              width={barWidth}
              height={(notificationCount / maxCount) * chartHeight}
              fill="coral"
            />
          </Svg>
          {/* Labels for the Bars */}
          <View style={styles.chartLabels}>
            <Text style={styles.chartLabel}>Messages</Text>
            <Text style={styles.chartLabel}>Calls</Text>
            <Text style={styles.chartLabel}>Notifications</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Modal for detailed activities */}
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
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
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
    marginBottom: 5,
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
    marginVertical: 10,
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
    position: 'absolute',
    top: 20,
    left: 20,
  },
  backButtonText: {
    fontSize: 18,
    marginLeft: 5,
    color: 'blue',
  },
});

export default ActivityOverview;