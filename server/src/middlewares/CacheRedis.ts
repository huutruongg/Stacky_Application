import { redisClient } from '../config/Redis';
import { Request, Response, NextFunction } from 'express';



export const cacheMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log("Cache middleware");

    let cacheKey: string;
    if (Object.keys(req.params).length > 0) {
        cacheKey = `${req.originalUrl}:${JSON.stringify(req.params)}`; // Cache key for params
    } else if (Object.keys(req.query).length > 0) {
        cacheKey = `${req.originalUrl}:${JSON.stringify(req.query)}`; // Cache key for query
    } else {
        cacheKey = req.originalUrl;
    }

    try {
        // Kiểm tra cache trước trong Redis
        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
            console.log("Get data from cache");
            res.status(200).json(JSON.parse(cachedData));
            return;
        }

        // Middleware tiếp theo xử lý việc lưu dữ liệu vào cache sau khi response hoàn thành
        const originalJson = res.json;
        res.json = (body: any): Response => {
            // Lưu dữ liệu vào res.locals.data
            res.locals.data = body;

            // Lưu dữ liệu vào Redis sau khi response hoàn tất
            const ttl = 900; // TTL 15 phút
            if (body) {
                redisClient.setEx(cacheKey, ttl, JSON.stringify(body));
            } else {
                console.warn('Warning: responseData is undefined');
            }

            // Gọi lại phương thức .json() của res
            return originalJson.call(res, body);
        };

        next();
    } catch (error) {
        console.error('Redis error:', error);
        next();
    }
};
