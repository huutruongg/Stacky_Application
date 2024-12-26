// import { redisClient } from './../config/Redis';
// import { log } from "console";

// // Thêm token vào danh sách đen
// export const addToBlacklist = async (jti: string, exp: number): Promise<void> => {
//     const ttl = exp - Math.floor(Date.now() / 1000); // Thời gian sống còn lại
//     if (ttl > 0) {
//         await redisClient.set(jti, "revoked", { EX: ttl });
//     }
// };

// // Kiểm tra xem token có bị thu hồi không
// export const isTokenRevoked = async (jti: string): Promise<boolean> => {
//     try {
//         log("Checking Redis for token: ", jti);
//         const result = await redisClient.get(jti);
//         log("Result from Redis: ", result);
//         return result === "revoked";
//     } catch (error) {
//         log("Error fetching from Redis: ", error);
//         return false;
//     }
// };
