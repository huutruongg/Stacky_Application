import { Router, Request, Response, NextFunction } from "express"
import AuthController from "../controllers/auth.controller";
import path from "path";

const router = Router();
router.post('/login/admin', (req: Request, res: Response, next: NextFunction) => { AuthController.login(req, res, next); })

router.post('/signup/recruiter', (req: Request, res: Response, next: NextFunction) => { AuthController.signupRecruiter(req, res, next); })
router.post('/login/recruiter', (req: Request, res: Response, next: NextFunction) => { AuthController.login(req, res, next); })

router.get('/login', (req: Request, res: Response, next: NextFunction) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

// Google OAuth
router.get("/google/callback", (req: Request, res: Response, next: NextFunction) => { AuthController.loginCandidateOAuthGoogle(req, res, next) });


// router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', (req: Request, res: Response, next: NextFunction) => { AuthController.loginCandidateOAuthGithub(req, res, next) });



router.post('/logout', (req: Request, res: Response, next: NextFunction) => { AuthController.logout(req, res, next) })



export default router;