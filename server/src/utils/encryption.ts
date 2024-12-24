import { log } from 'console';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// Khóa mã hóa từ biến môi trường (đảm bảo đủ 32 bytes)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string;
if (!ENCRYPTION_KEY || Buffer.from(ENCRYPTION_KEY, 'hex').length !== 32) {
    throw new Error('ENCRYPTION_KEY must be a 32-byte hex string');
}

const IV_LENGTH = 16; // Độ dài vector khởi tạo (Initialization Vector)

// Hàm mã hóa
export const encrypt = (num: number): string => {
    const text = num.toString(); // Chuyển đổi số thành chuỗi trước khi mã hóa
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
};

// Hàm giải mã
export const decrypt = (text: string): string => {
    try {
        const [ivHex, encryptedHex] = text.split(':');
        if (!ivHex || !encryptedHex) {
            throw new Error('Invalid encrypted data format');
        }

        const iv = Buffer.from(ivHex, 'hex');
        const encryptedText = Buffer.from(encryptedHex, 'hex');

        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
        const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);

        return decrypted.toString('utf8'); // Trả về chuỗi đã giải mã
    } catch (error) {
        console.error('Error decrypting data:', error);
        console.error('Input text:', text);
        throw new Error('Failed to decrypt balance');
    }
};

// // Test mã hóa và giải mã
// const testNumber = 0; // Số cần mã hóa
// const encrypted = encrypt(testNumber);
// log('Encrypted:', encrypted);
// 0 = 1d7f4172c5ee1b62c8e13ddc2cd66b86:65e7ab3615158b0e015fc951d2f77575

// const decrypted = decrypt(encrypted);
// log("Decrypted:", decrypted); // Đảm bảo đầu ra là chuỗi, chuyển thành số nếu cần bằng `parseFloat(decrypted)`
