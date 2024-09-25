"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const google_auth_library_1 = require("google-auth-library");
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const AuthService = {
    checkPassword: (pwdRequest, hashedPwd) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield bcrypt_1.default.compare(pwdRequest, hashedPwd);
        }
        catch (error) {
            console.error('Password comparison failed:', error);
            return false;
        }
    }),
    generateToken: (userId, email, role) => {
        const payload = { userId, email, role };
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    },
    verifyOAuthToken: (provider, token) => __awaiter(void 0, void 0, void 0, function* () {
        if (provider !== 'google') {
            throw new Error('Unsupported provider');
        }
        try {
            const ticket = yield client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!payload) {
                throw new Error('Invalid Google token');
            }
            return {
                email: payload.email,
                name: payload.name,
                provider,
                token,
            };
        }
        catch (error) {
            console.error('OAuth token verification failed:', error);
            throw new Error('Token verification failed');
        }
    }),
};
exports.default = AuthService;
