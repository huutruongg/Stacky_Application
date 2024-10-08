"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const candidate_controller_1 = __importDefault(require("../modules/Candidate/candidate.controller"));
const router = (0, express_1.Router)();
router.put('/submit-profile', candidate_controller_1.default.submitProfessionalDetails);
router.get('/get-candidate-details/:candidateId', candidate_controller_1.default.getCandidateById);
router.delete('/remove-object', candidate_controller_1.default.removeObjectFromArray);
exports.default = router;
