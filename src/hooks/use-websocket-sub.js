import { useEffect } from "react";
import Ably from "ably";

const API_KEY = import.meta.env.VITE_API_ABLY_KEY;

const useWebSocketSub = (onAccountUpdate, user) => {
  useEffect(() => {
    const setupWebSocket = async () => {
      const realtime = new Ably.Realtime({ key: API_KEY });
      const channel = realtime.channels.get("gocashChannel");

      channel.subscribe("update_balance", (message) => {
        if (String(message.data.user_id) !== String(user.user_id)) {
          onAccountUpdate(message.data);
        } else {
          console.log("User IDs match, no update");
        }
      });

      return () => {
        console.log("Unsubscribing from WebSocket...");
        channel.unsubscribe();
        realtime.close();
      };
    };

    setupWebSocket();
  }, [onAccountUpdate, user]);
};

export default useWebSocketSub;
