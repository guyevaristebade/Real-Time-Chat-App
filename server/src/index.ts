import { app } from './app'
import dotenv from "dotenv";
import {connectDB, initializeSocketIO} from './utils';
import http from "http";

dotenv.config();

const PORT = process.env.PORT ;

const server = http.createServer(app);
export const io = initializeSocketIO(server);


connectDB().then(() => {
    io.on('connection', (socket) => {
        console.log('New client connected');
        
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });

        socket.on('chat message', (msg) => {
            console.log('message: ' + msg);
            io.emit('chat message', msg);
        });
    });

    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
    
})
