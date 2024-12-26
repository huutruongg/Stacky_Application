// import { createClient } from 'redis';
// import dotenv from 'dotenv';
// dotenv.config();

// export const redisClient = createClient({
//        socket: {
//         host: process.env.REDIS_HOST,
//         port: Number(process.env.REDIS_PORT)
//     }
// });

// const connectRedis = async (): Promise<void> => {
//     try {
//         await redisClient.connect();
//         console.log("Redis client connected");
//     } catch (error) {
//         console.error("Error connecting to Redis:", error);
//     }
// };

// connectRedis();