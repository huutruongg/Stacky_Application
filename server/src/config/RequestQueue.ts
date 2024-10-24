import Queue from 'bull';
import { createClient } from 'redis';

export const redisClient = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
    }
});


export const requestQueue = new Queue('requestQueue', {
    redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD
    },
    limiter: {
        max: 100,
        duration: 1000,
    },
});
