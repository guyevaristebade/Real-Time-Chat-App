// socket.ts
import {Server as SocketIOServer} from 'socket.io';
import http from 'http';

export function initializeSocketIO(server: http.Server): SocketIOServer {
    return new SocketIOServer(server, {
        cors: {
            origin: process.env.FRONT_END_URL,
            methods: ["GET", "POST"],
            credentials: true,
        },
        transports: ['websocket', 'polling'],
    });
}
