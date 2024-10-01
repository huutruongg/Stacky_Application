import { Router, Request, Response} from "express";
import path from "path";
import AuthController from "../modules/Auth/auth.controller";

const router = Router();

router.post('/login/admin', AuthController.adminLogin);

router.post('/signup/recruiter', AuthController.signupRecruiter);
router.post('/login/recruiter', AuthController.recruiterLogin);

// Serve the login page
router.get('/login', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

// Google and GitHub OAuth
router.get("/google/callback", AuthController.loginCandidateOAuth('google'));
router.get("/github/callback", AuthController.loginCandidateOAuth('github'));

// Logout
router.post('/logout', AuthController.logout);

export default router;
