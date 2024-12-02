import { Request, RequestHandler, Response } from "express";
import AuthController from "../controllers/AuthController";
import path from "path";
import { BaseRoutes } from "./BaseRoutes";

export default class AuthRoutes extends BaseRoutes {
    private authController: AuthController;

    constructor(authController: AuthController) {
        super();
        this.authController = authController;
        this.autoBindControllerMethods(this.authController);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/f-login', this.serveLoginPage);
        this.router.get('/logout', this.serveLogoutPage);
        this.router.post('/register', this.authController.register);
        this.router.post('/login', this.authController.login);
        this.router.post('/logout', this.authController.logout);
        this.router.get('/google/callback', this.authController.loginWithOAuth('google'));
        this.router.get('/github/callback', this.authController.loginWithOAuth('github'));
        this.router.get('/github/callback/github-score', this.authController.authWithGithub('github'));
        this.router.get('/get-access-token', this.authController.getAccessToken);
    }

    private serveLoginPage(req: Request, res: Response): void {
        res.sendFile(path.join(__dirname, '../views/index.html'));
    }

    private serveLogoutPage(req: Request, res: Response): void {
        res.sendFile(path.join(__dirname, '../views/logout.html'));
    }
}

