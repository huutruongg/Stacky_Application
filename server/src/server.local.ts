import cron from 'node-cron'; // Import node-cron
import { log } from 'console';
import app from './app';
import { connectDB, disconnectDB } from './config/Database';
import { Server } from 'socket.io';
import http from 'http';
let connectedUsers: any = {};
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

// Middleware to inject the Socket.IO server instance into the request object
app.use((req, res, next) => {
    (req as any).io = io;
    (req as any).connectedUsers = connectedUsers;
    next();
});

// Connect to the database
connectDB()
    .then(async () => {
        log('Database connection established.');
        // Listen for incoming socket.io connections
        io.on('connection', (socket) => {
            console.log(`User connected: ${socket.id}`);

            socket.on('register', (userId) => {
                connectedUsers[userId] = socket.id;
                console.log(`User registered: ${userId}`);
            });

            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.id}`);
                for (const userId in connectedUsers) {
                    if (connectedUsers[userId] === socket.id) {
                        delete connectedUsers[userId];
                    }
                }
            });
        });

        // Run a daily task at midnight
        cron.schedule('0 0 * * *', async () => {
            log('Running daily task at midnight...');
            try {
                const db = await connectDB(); // Đảm bảo DB đã kết nối
                const jobPostCollection = db.collection('jobposts');

                const currentDate = new Date();

                // Update all job posts that have passed the application deadline
                const result = await jobPostCollection.updateMany(
                    { invisible: false, applicationDeadline: { $lt: currentDate } }, // The application deadline has passed
                    { $set: { invisible: true } } // Mark the job post as invisible
                );

                log(`${result.modifiedCount} job posts marked as invisible.`);
            } catch (error) {
                console.error('Error running daily task:', error);
            }
        });
        // Start the server
        server.listen(PORT, () => {
            log(`[server]: Server is running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to the database:', error);
    });

// Handle graceful shutdown
process.on('SIGINT', async () => {
    await disconnectDB();
    server.close(() => {
        log('HTTP server closed');
        process.exit(0);
    });
});
