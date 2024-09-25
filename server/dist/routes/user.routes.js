"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_m_1 = __importDefault(require("../middlewares/authenticate.m"));
const authorize_m_1 = __importDefault(require("../middlewares/authorize.m"));
const IUserRole_1 = __importDefault(require("../types/IUserRole"));
const router = (0, express_1.Router)();
router.get('/a', authenticate_m_1.default, (0, authorize_m_1.default)(IUserRole_1.default.ADMIN, IUserRole_1.default.CANDIDATE), (req, res) => { res.send("Hi, I'm A."); });
router.get('/b', authenticate_m_1.default, (0, authorize_m_1.default)(IUserRole_1.default.ADMIN, IUserRole_1.default.RECRUITER), (req, res) => { res.send("Hi, I'm B."); });
router.get('/c', authenticate_m_1.default, (0, authorize_m_1.default)(IUserRole_1.default.ADMIN), (req, res) => { res.send("Hi, I'm C."); });
router.get('/d', authenticate_m_1.default, (0, authorize_m_1.default)(IUserRole_1.default.ADMIN, IUserRole_1.default.RECRUITER), (req, res) => { res.send("Hi, I'm D."); });
router.get('/e', authenticate_m_1.default, (0, authorize_m_1.default)(IUserRole_1.default.ADMIN, IUserRole_1.default.CANDIDATE), (req, res) => { res.send("Hi, I'm E."); });
exports.default = router;
