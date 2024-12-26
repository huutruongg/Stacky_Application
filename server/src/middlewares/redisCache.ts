// import { redisClient } from '../config/Redis';
// import { Request, Response, NextFunction } from 'express';

// export const redisCache = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     console.log("Cache middleware");

//     const cacheKey = Object.keys(req.params).length > 0 
//         ? `${req.originalUrl}:${JSON.stringify(req.params)}` 
//         : Object.keys(req.query).length > 0 
//         ? `${req.originalUrl}:${JSON.stringify(req.query)}` 
//         : req.originalUrl;

//     try {
//         const cachedData = await redisClient.get(cacheKey);

//         if (cachedData) {
//             console.log("Get data from cache");
//             res.status(200).json(JSON.parse(cachedData));
//             return;
//         }

//         const originalJson = res.json;
//         res.json = (body: any): Response => {
//             res.locals.data = body;

//             if (body) {
//                 const ttl = 120; // 2 minutes
//                 redisClient.setEx(cacheKey, ttl, JSON.stringify(body));
//             } else {
//                 console.warn('Warning: responseData is undefined');
//             }

//             return originalJson.call(res, body);
//         };

//         next();
//     } catch (error) {
//         console.error('Redis error:', error);
//         next();
//     }
// };
