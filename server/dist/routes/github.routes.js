"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_m_1 = __importDefault(require("../middlewares/authenticate.m"));
const github_controller_1 = __importDefault(require("../modules/Github/github.controller"));
const router = (0, express_1.Router)();
router.post('/calculate-score', authenticate_m_1.default, (req, res) => { github_controller_1.default.getGithubScore(req, res); });
exports.default = router;
