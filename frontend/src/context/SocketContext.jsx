import React, {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    const connect = useCallback(() => {
        // Prevent multiple socket instances
        if (socketRef.current) return;

        const token = localStorage.getItem("token");

        const rawBaseUrl =
            import.meta.env.VITE_BASE_URL || "http://localhost:4000";

        const socketUrl = rawBaseUrl.replace("/api", "");

        const socket = io(socketUrl, {
            auth: {
                token,
            },
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("🟢 Socket Connected:", socket.id);
            setIsConnected(true);
        });

        socket.on("disconnect", (reason) => {
            console.log("🔴 Socket Disconnected:", reason);
            setIsConnected(false);
        });

        socket.on("connect_error", (err) => {
            console.error("❌ Socket Error:", err.message);
        });
    }, []);

    const disconnect = useCallback(() => {
        if (!socketRef.current) return;

        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;

        setIsConnected(false);
    }, []);

    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    const sendMessage = useCallback((event, payload) => {
        if (!socketRef.current?.connected) {
            console.warn("Socket not connected.");
            return false;
        }

        socketRef.current.emit(event, payload);
        return true;
    }, []);

    const receiveMessage = useCallback((event, callback) => {
        if (!socketRef.current) return () => { };

        socketRef.current.on(event, callback);

        return () => {
            socketRef.current?.off(event, callback);
        };
    }, []);

    const value = useMemo(
        () => ({
            socket: socketRef.current,
            isConnected,
            connect,
            disconnect,
            sendMessage,
            receiveMessage,
        }),
        [isConnected, connect, disconnect, sendMessage, receiveMessage]
    );

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;