import { log } from 'console';
import app from './app';
import { connectDB, disconnectDB } from './config/Database';
import { Server } from 'socket.io';
import http from 'http';

const PORT = process.env.PORT || 5050; // Sử dụng 5000 nếu không có PORT trong env

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

// Middleware để đưa `io` vào request, có thể dùng trong các controller nếu cần
app.use((req, res, next) => {
    (req as any).io = io;
    next();
});

// Kết nối với cơ sở dữ liệu và khởi động server
connectDB()
    .then(() => {
        log('Database connection established.');

        // Cấu hình Socket.IO để lắng nghe các sự kiện kết nối từ client
        io.on('connection', (socket) => {
            log(`Client connected: ${socket.id}`);

            // Lắng nghe sự kiện tùy chỉnh từ client
            socket.on('new-notification', (data) => {
                log('New notification received:', data);
                // Phát thông báo tới tất cả các client kết nối
                io.emit('new-notification', data);
            });

            // Xử lý sự kiện ngắt kết nối
            socket.on('disconnect', () => {
                log(`Client disconnected: ${socket.id}`);
            });
        });

        // Lắng nghe cổng
        server.listen(PORT, () => {
            log(`[server]: Server is running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to the database:', error);
    });

// Xử lý tín hiệu `SIGINT` để ngắt kết nối cơ sở dữ liệu và dừng server an toàn
process.on('SIGINT', async () => {
    await disconnectDB();
    server.close(() => {
        log('HTTP server closed');
        process.exit(0);
    });
});
