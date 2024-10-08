"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const auth_controller_1 = __importDefault(require("../modules/Auth/auth.controller"));
const router = (0, express_1.Router)();
router.post('/login/admin', auth_controller_1.default.adminLogin);
router.post('/signup/recruiter', auth_controller_1.default.signupRecruiter);
router.post('/login/recruiter', auth_controller_1.default.recruiterLogin);
// Serve the login page
router.get('/login', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../views/'));
});
// Google and GitHub OAuth
router.get("/google/callback", auth_controller_1.default.loginCandidateOAuth('google'));
router.get("/github/callback", auth_controller_1.default.loginCandidateOAuth('github'));
router.get('/get-tokens', auth_controller_1.default.getTokens);
// Logout
router.post('/logout', auth_controller_1.default.logout);
exports.default = router;
