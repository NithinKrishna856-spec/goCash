import { useEffect } from "react";
import Ably from "ably";

const API_KEY = "C0bJbg.JP6k7Q:j8dZNu94cP2H7_rXCGXXj012RDbOD1LkWQBY1pcl2l0";

const useWebSocketSub = (onAccountUpdate, setLoading) => {
  useEffect(() => {
    const setupWebSocket = async () => {
      const realtime = new Ably.Realtime({ key: API_KEY });
      const channel = realtime.channels.get("gocashChannel");

      channel.subscribe("update_balance", (message) => {
        console.log("Received message from gocashChannel:", message);
        onAccountUpdate(message.data);
      });

      return () => {
        console.log("Unsubscribing from WebSocket...");
        channel.unsubscribe();
        realtime.close();
      };
    };

    setupWebSocket();
  }, [onAccountUpdate, setLoading]);
};

export default useWebSocketSub;
