import cron from 'node-cron'; // Import node-cron
import { log } from 'console';
import app from './app';
import { connectDB, disconnectDB } from './config/Database';
import { Server } from 'socket.io';
import http from 'http';

const PORT = process.env.PORT || 5050;

// Khởi tạo HTTP server từ Express app
const server = http.createServer(app);

// Khởi tạo Socket.IO server với HTTP server
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

// Middleware để đưa `io` vào request
app.use((req, res, next) => {
    (req as any).io = io;
    next();
});

// Kết nối với cơ sở dữ liệu và khởi động server
connectDB()
    .then(async () => {
        log('Database connection established.');

        // Cấu hình Socket.IO
        io.on('connection', (socket) => {
            log(`Client connected: ${socket.id}`);

            socket.on('new-notification', (data) => {
                log('New notification received:', data);
                io.emit('new-notification', data);
            });

            socket.on('disconnect', () => {
                log(`Client disconnected: ${socket.id}`);
            });
        });

        // Thiết lập node-cron để chạy lúc 12h đêm mỗi ngày
        cron.schedule('0 0 * * *', async () => {
            log('Running daily task at midnight...');
            try {
                const db = await connectDB(); // Đảm bảo DB đã kết nối
                const jobPostCollection = db.collection('jobposts');

                const currentDate = new Date();

                // Cập nhật trạng thái bài viết
                const result = await jobPostCollection.updateMany(
                    { invisible: false, applicationDeadline: { $lt: currentDate } }, // Bài viết hết hạn
                    { $set: { invisible: true } } // Chuyển trạng thái thành invisible
                );

                log(`${result.modifiedCount} job posts marked as invisible.`);
            } catch (error) {
                console.error('Error running daily task:', error);
            }
        });

        // Lắng nghe cổng
        server.listen(PORT, () => {
            log(`[server]: Server is running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to the database:', error);
    });

// Xử lý SIGINT để đóng kết nối DB và server an toàn
process.on('SIGINT', async () => {
    await disconnectDB();
    server.close(() => {
        log('HTTP server closed');
        process.exit(0);
    });
});
