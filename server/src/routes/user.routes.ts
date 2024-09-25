import { Recruiter } from '@prisma/client';
import { Router, Request, Response } from "express";
import authenticateJWT from "../middlewares/authenticate.m";
import authorize from "../middlewares/authorize.m";
import UserRole from '../types/IUserRole';


const router = Router();

router.get('/a', authenticateJWT, authorize(UserRole.ADMIN, UserRole.CANDIDATE), (req: Request, res: Response) => { res.send("Hi, I'm A.") });
router.get('/b', authenticateJWT, authorize(UserRole.ADMIN, UserRole.RECRUITER), (req: Request, res: Response) => { res.send("Hi, I'm B.") });
router.get('/c', authenticateJWT, authorize(UserRole.ADMIN), (req: Request, res: Response) => { res.send("Hi, I'm C.") });
router.get('/d', authenticateJWT, authorize(UserRole.ADMIN, UserRole.RECRUITER), (req: Request, res: Response) => { res.send("Hi, I'm D.") });
router.get('/e', authenticateJWT, authorize(UserRole.ADMIN, UserRole.CANDIDATE), (req: Request, res: Response) => { res.send("Hi, I'm E.") });

export default router;