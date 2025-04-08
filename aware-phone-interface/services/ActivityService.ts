import { supabase } from "@/lib/supabase";

// Fetch all tracking events (filtered to key event types)
export const fetchTrackingData = async () => {
  const { data, error } = await supabase
    .from("tracking_data")
    .select("*")
    .in("event_type", ["message", "phone_call", "notification_received"]) // Filter by event types
    .order("timestamp", { ascending: false }); // Order by most recent first

  if (error) {
    console.error("Error fetching data:", error);
    throw error; // Throw error to handle it in the calling function
  }

  return data; // Return the fetched data
};

// Format a timestamp into dd/mm/yyyy
export const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, "0"); // Ensure 2-digit day
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Ensure 2-digit month
  const year = date.getFullYear();
  return `${day}/${month}/${year}`; // Return formatted date
};

// Group tracking data by date
export const groupDataByDate = (trackingData: any[]) => {
  const groupedData: Record<string, any[]> = {};
  trackingData.forEach((item) => {
    const date = formatDate(item.timestamp); // Format timestamp into date
    if (!groupedData[date]) groupedData[date] = []; // Initialize array if not present
    groupedData[date].push(item); // Add item to the corresponding date group
  });
  return groupedData; // Return grouped data
};

// Count message, call, notification events for chart
export const getBarChartData = (trackingData: any[]) => {
  const messageCount = trackingData.filter(item => item.event_type === "message").length; // Count messages
  const callCount = trackingData.filter(item => item.event_type === "phone_call").length; // Count phone calls
  const notificationCount = trackingData.filter(item => item.event_type === "notification_received").length; // Count notifications
  return { messageCount, callCount, notificationCount }; // Return counts
};