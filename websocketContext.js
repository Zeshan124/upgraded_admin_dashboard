
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";


import Cookies from "js-cookie";
// Create a context
const WebSocketContext = createContext(null);

// Export a custom hook for consuming the context
export function useWebSocket() {
  return useContext(WebSocketContext);
}
const baseURL = "https://boms.qistbazaar.pk/";
// Provider component
export function WebSocketProvider({  children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    
      const token = Cookies.get("tokenOMS");
     

      if (!token) {
        console.warn("token cookie not found");
        return;
      }
      
    const newSocket = io(baseURL, {
      autoConnect: true,
      reconnection: true, // Automatically tries to reconnect
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
      extraHeaders: {
        "x-access-token": token,
      },
    });
    newSocket.on("connect", () => {
      //console.log("Connected to server");
    }); 


    newSocket.connect(); 

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
}
