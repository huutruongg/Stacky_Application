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
export function encrypt(num: number): string {
    const text = num.toString(); // Chuyển đổi số thành chuỗi trước khi mã hóa
    // log('Input number:', num);
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

// Hàm giải mã
export function decrypt(text: string): string {
    // log('Input text:', text);
    try {
        const textParts = text.split(':');
        if (textParts.length !== 2) {
            throw new Error('Invalid encrypted data format');
        }

        const iv = Buffer.from(textParts[0], 'hex');
        const encryptedText = Buffer.from(textParts[1], 'hex');

        // Log thêm thông tin để kiểm tra
        // console.log('IV:', iv.toString('hex'));
        // console.log('Encrypted Text:', encryptedText.toString('hex'));
        // console.log('ENCRYPTION_KEY length:', Buffer.from(ENCRYPTION_KEY, 'hex').length);

        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
        let decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);

        return decrypted.toString('utf8'); // Trả về chuỗi đã giải mã
    } catch (error) {
        console.error('Error decrypting data:', error);
        console.error('Input text:', text);
        throw new Error('Failed to decrypt balance');
    }
}

// // Test mã hóa và giải mã
// const testNumber = 0; // Số cần mã hóa
// const encrypted = encrypt(testNumber);
// log('Encrypted:', encrypted);

// const decrypted = decrypt(encrypted);
// log("Decrypted:", decrypted); // Đảm bảo đầu ra là chuỗi, chuyển thành số nếu cần bằng `parseFloat(decrypted)`
