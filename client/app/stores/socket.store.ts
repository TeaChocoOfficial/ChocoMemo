//-Path: "vite-extra-react-ssr-ts/src/stores/socketStore.ts"
import env from '~/secure/env';
import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface SocketState {
    socket: Socket | null;
    isConnected: boolean;
    playerCount: number;
    connect: () => void;
    disconnect: () => void;
}

export const useSocketStore = create<SocketState>()((set, get) => ({
    socket: null,
    isConnected: false,
    playerCount: 0,
    connect: () => {
        const existingSocket = get().socket;
        if (existingSocket?.connected) return;
        const socket = io(env.API_URL, {
            auth: {
                tokenKey: `Bearer ${env.API_TOKEN_KEY}`,
            },
            transports: ['websocket'],
            autoConnect: true,
        });

        socket.on('connect', () => {
            console.log('🌐 Socket connected:', socket.id);
            set({ isConnected: true });
        });

        socket.on('disconnect', () => {
            console.log('🔌 Socket disconnected');
            set({ isConnected: false });
        });

        socket.on('playersSync', (data: { count: number }) => {
            set({ playerCount: data.count });
        });

        set({ socket });
    },

    disconnect: () => {
        const { socket } = get();
        if (socket) {
            socket.disconnect();
            set({ socket: null, isConnected: false });
        }
    },
}));
