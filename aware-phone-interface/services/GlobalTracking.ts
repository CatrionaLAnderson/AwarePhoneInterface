import { supabase } from "@/lib/supabase";
import "react-native-get-random-values";

type TrackingEvent = {
    event_type: string;
    event_detail: string;
    duration?: string;
    message_preview?: string;
    notification_content?: string;
};


export const logTrackingEvent = async (event: TrackingEvent) => {
    try {
        

        const { error } = await supabase.from("tracking_data").insert([event]);
        if (error) console.error("Error logging event:", error);
    } catch (err) {
        console.error("Unexpected error:", err);
    }
};

export const startDrunkModeSession = async () => {
    const startTime = new Date().toISOString();

    await logTrackingEvent({
        event_type: "drunk_mode",
        event_detail: "activated",
        duration: startTime,
    });
};

export const endDrunkModeSession = async () => {
    const endTime = new Date().toISOString();

    await logTrackingEvent({
        event_type: "drunk_mode",
        event_detail: "deactivated",
        duration: endTime,
    });
};