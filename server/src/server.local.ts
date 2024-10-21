
import { log } from 'console';
import app from './app';
import { connectDB, disconnectDB } from './config/Database';


const PORT = process.env.PORT;

process.on('SIGINT', async () => {
    await disconnectDB();
    process.exit(0);
});

connectDB()
    .then(() => {
        log('Database connection established.');
        app.listen(PORT, () => {
            log(`[server]: Server is running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        error('Failed to connect to the database:', error);
    });