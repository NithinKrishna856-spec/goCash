import { useEffect } from "react";
import Ably from "ably";

const API_KEY = import.meta.env.VITE_API_ABLY_KEY;

const useWebSocketSub = (onAccountUpdate) => {
  useEffect(() => {
    const setupWebSocket = async () => {
      const realtime = new Ably.Realtime({ key: API_KEY });
      const channel = realtime.channels.get("gocashChannel");

      channel.subscribe("update_balance", (message) => {
        const { account_id, balance } = message.data;
        onAccountUpdate({ account_id, balance });
      });
      return () => {
        console.log("Unsubscribing from WebSocket...");
        channel.unsubscribe();
        realtime.close();
      };
    };

    setupWebSocket();
  }, [onAccountUpdate]);
};

export default useWebSocketSub;
