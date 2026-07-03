import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';

// 1. Export the context as SocketContext (matches standard conventions)
export const SocketContext = createContext(null);

// 2. Rename the wrapper component to SocketProvider
const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    const connect = useCallback(() => {
        if (socketRef.current?.connected) return;

        const token = localStorage.getItem('token');

        // Safety check: If VITE_BASE_URL has '/api' at the end, strip it out.
        // Socket.io MUST connect to the root URL (http://localhost:4000)
        const rawBaseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:4000';
        const socketUrl = rawBaseUrl.replace('/api', ''); 

        const socket = io(socketUrl, {
            auth: { token },
            // REMOVED: transports: ['websocket'] so it can fall back to polling if the handshake fails!
            reconnection: true,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            setIsConnected(true);
            console.log('🟢 Socket connected:', socket.id);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
            console.log('🔴 Socket disconnected');
        });

        socket.on('connect_error', (error) => {
            console.error('❌ Socket connection error:', error.message);
        });
    }, []);

    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setIsConnected(false);
        }
    }, []);

    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    const sendMessage = useCallback((eventName, payload) => {
        if (!socketRef.current) {
            console.warn('Socket is not initialized yet.');
            return false;
        }

        socketRef.current.emit(eventName, payload);
        return true;
    }, []);

    const receiveMessage = useCallback((eventName, callback) => {
        if (!socketRef.current) return () => {};

        socketRef.current.on(eventName, callback);

        return () => {
            socketRef.current?.off(eventName, callback);
        };
    }, []);

    const value = useMemo(() => ({
        socket: socketRef.current,
        isConnected,
        connect,
        disconnect,
        sendMessage,
        receiveMessage,
    }), [isConnected, connect, disconnect, sendMessage, receiveMessage]);

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider; // Exporting as Provider!