import cron from 'node-cron';
import { log } from 'console';
import app from './app';
import { connectDB, disconnectDB } from './config/Database';
import { Server } from 'socket.io';
import http from 'http';
import { connectedUsers } from './utils/connectedSocket';

const PORT = process.env.PORT || 5050;

// Initialize the HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
export const io = new Server(server, {
    cors: {
        origin: [
            process.env.URL_CLIENT as string,
            'https://happily-novel-chamois.ngrok-free.app',
            process.env.URL_SERVER as string,
        ],
        credentials: true,
        methods: ['GET', 'POST'],
    },
});

// Function to handle the daily cron job
const runDailyTask = async () => {
    log('Running daily task at midnight...');
    try {
        const db = await connectDB();
        const jobPostCollection = db.collection('jobposts');
        const currentDate = new Date();

        // Update all job posts that have passed the application deadline
        const result = await jobPostCollection.updateMany(
            { invisible: false, applicationDeadline: { $lt: currentDate } },
            { $set: { invisible: true } }
        );

        log(`${result.modifiedCount} job posts marked as invisible.`);
    } catch (error) {
        console.error('Error running daily task:', error);
    }
};

// Connect to the database and start the server
const startServer = async () => {
    try {
        await connectDB();
        log('Database connection established.');

        // Listen for incoming socket.io connections
        io.on('connection', (socket) => {
            log(`User connected: ${socket.id}`);

            socket.on('register', (userId) => {
                connectedUsers[userId] = socket.id;
                log(`User registered: ${userId}`);
            });

            socket.on('disconnect', () => {
                log(`User disconnected: ${socket.id}`);
                for (const userId in connectedUsers) {
                    if (connectedUsers[userId] === socket.id) {
                        delete connectedUsers[userId];
                    }
                }
            });
        });

        // Schedule the daily task
        cron.schedule('0 0 * * *', runDailyTask);

        // Start the server
        server.listen(PORT, () => {
            log(`[server]: Server is running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to the database:', error);
    }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
    await disconnectDB();
    server.close(() => {
        log('HTTP server closed');
        process.exit(0);
    });
});

// Start the server
startServer();
