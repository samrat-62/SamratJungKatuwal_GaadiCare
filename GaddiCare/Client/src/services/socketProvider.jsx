import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { pushAlert } from "@/store/slice/getNotifications";

const SocketContext = createContext(undefined);

export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const {data} = useSelector((state) => state.userData);
  const [socketInstance, setSocketInstance] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!data?._id) return;
    if (socketInstance) return;

    const client = io(import.meta.env.VITE_SERVER_URL, {
      query: {
        user: data._id,
        model: data.userType === "workshop" ? "Workshop" : "User",
      },
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1200,
    });

    setSocketInstance(client);

    const onConnect = () => {
      console.log("Socket connected successfully:", client.id);
    };

    const onNotification = async (payload) => {
      await dispatch(pushAlert(payload));
    };

    const onDisconnect = () => {
      console.log("Socket connection closed");
    };

    const onError = (error) => {
      console.error("Socket connection failed:", error);
    };

    client.on("connect", onConnect);
    client.on("newAlert", onNotification);
    client.on("disconnect", onDisconnect);
    client.on("connect_error", onError);

    return () => {
      client.off("connect", onConnect);
      client.off("newAlert", onNotification);
      client.off("disconnect", onDisconnect);
      client.off("connect_error", onError);

      client.disconnect();
      setSocketInstance(undefined);
    };
  }, [data?._id]);

  return (
    <SocketContext.Provider value={{ socket: socketInstance }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
