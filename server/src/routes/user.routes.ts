import { Recruiter } from '@prisma/client';
import { Router, Request, Response } from "express";
import UserController from "../controllers/user.controllers";
import authenticate from "../middlewares/authenticate.m";
import authorize from "../middlewares/authorize.m";
import UserRole from "../utils/types/IUserRole";


const router = Router();

router.get('/a', authenticate, authorize(UserRole.ADMIN, UserRole.CANDIDATE), (req: Request, res: Response) => { res.send("Hi, I'm A.") });
router.get('/b', authenticate, authorize(UserRole.ADMIN, UserRole.RECRUITER), (req: Request, res: Response) => { res.send("Hi, I'm B.") });
router.get('/c', authenticate, authorize(UserRole.ADMIN), (req: Request, res: Response) => { res.send("Hi, I'm C.") });
router.get('/d', authenticate, authorize(UserRole.ADMIN, UserRole.RECRUITER), (req: Request, res: Response) => { res.send("Hi, I'm D.") });
router.get('/e', authenticate, authorize(UserRole.ADMIN, UserRole.CANDIDATE), (req: Request, res: Response) => { res.send("Hi, I'm E.") });

export default router;