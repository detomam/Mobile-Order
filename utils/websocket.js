import { WS_URL } from '@/constants/Config';

let socket;

export const connectWebSocket = (onMessageCallback) => {
  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("Received from server:", data);
    if (onMessageCallback) onMessageCallback(data);
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket closed");
  };
};

export const sendOrderViaWebSocket = (orderData) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(orderData));
  } else {
    console.warn("WebSocket is not connected.");
  }
};