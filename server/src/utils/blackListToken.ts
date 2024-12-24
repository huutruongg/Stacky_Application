import { redisClient } from './../config/Redis';
import { log } from "console";

// Hàm thêm token vào danh sách đen
async function addToBlacklist(jti: string, exp: number): Promise<void> {
    const ttl = exp - Math.floor(Date.now() / 1000); // Thời gian sống còn lại
    if (ttl > 0) {
        await redisClient.set(jti, "revoked", { "EX": ttl });
    }
}

// Kiểm tra xem token có bị thu hồi không
async function isTokenRevoked(jti: string): Promise<boolean> {
    try {
        log("Checking Redis for token: ", jti);
        const result = await redisClient.get(jti);
        log("Result from Redis: ", result);
        return result === "revoked";
    } catch (error) {
        log("Error fetching from Redis: ", error);
        return false;
    }
}

export { addToBlacklist, isTokenRevoked };
