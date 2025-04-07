import { supabase } from "@/lib/supabase";

// Fetch all tracking events (filtered to key event types)
export const fetchTrackingData = async () => {
  const { data, error } = await supabase
    .from("tracking_data")
    .select("*")
    .in("event_type", ["message", "phone_call", "notification_received"])
    .order("timestamp", { ascending: false });

  if (error) {
    console.error("Error fetching data:", error);
    throw error;
  }

  return data;
};

// Format a timestamp into dd/mm/yyyy
export const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Group tracking data by date
export const groupDataByDate = (trackingData: any[]) => {
  const groupedData: Record<string, any[]> = {};
  trackingData.forEach((item) => {
    const date = formatDate(item.timestamp);
    if (!groupedData[date]) groupedData[date] = [];
    groupedData[date].push(item);
  });
  return groupedData;
};

// Count message, call, notification events for chart
export const getBarChartData = (trackingData: any[]) => {
  const messageCount = trackingData.filter(item => item.event_type === "message").length;
  const callCount = trackingData.filter(item => item.event_type === "phone_call").length;
  const notificationCount = trackingData.filter(item => item.event_type === "notification_received").length;
  return { messageCount, callCount, notificationCount };
};