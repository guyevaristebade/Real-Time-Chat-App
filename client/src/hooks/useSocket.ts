import { io } from 'socket.io-client';

export const useSocket = () => {
    const apiUrl = import.meta.env.VITE_APP_SOCKET_SERVER_URL as string;
    const socket = io(apiUrl);
    
    const connected = () =>{
        socket.on('connect', () => {
            console.log('Connected to server');
        });
    }

    const disconnected = () =>{
        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });
    }

    return {socket, connected, disconnected};
};