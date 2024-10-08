"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recruiter_controller_1 = __importDefault(require("../modules/Recruiter/recruiter.controller"));
const router = (0, express_1.Router)();
router.post('/forgot-password', recruiter_controller_1.default.forgotPassword);
router.post('/reset-password/:id', recruiter_controller_1.default.resetPassword);
router.post('/change-password/:id', recruiter_controller_1.default.resetPassword);
// router.post('/update-company-profile', RecruiterController.updateComapanyProfile);
// router.post('/update-company-contact', RecruiterController.updateComapanyContact);
router.get('/get-company-info/:recruiterId', recruiter_controller_1.default.getCompanyInfo);
exports.default = router;
