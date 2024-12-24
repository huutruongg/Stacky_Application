import { Request, Response } from "express";
import { BaseRoutes } from "./BaseRoutes";
import AuthController from "../controllers/AuthController";
import path from "path";

export default class AuthRoutes extends BaseRoutes {
    private authController: AuthController;

    constructor(authController: AuthController) {
        super();
        this.authController = authController;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/f-login', this.serveLoginPage);
        this.router.get('/logout', this.serveLogoutPage);

        // Cập nhật các route OAuth cho GitHub
        this.router.get('/github/login', this.authController.githubLoginRedirect);
        this.router.get('/github/callback', this.authController.handleGitHubCallback);
        this.router.get('/github-info', this.authController.githubInfo);

        // Các route OAuth cho Google
        this.router.get('/google/login', this.authController.googleLoginRedirect);
        this.router.get('/google/callback', this.authController.handleGoogleCallback);
        
        // Các route đăng ký và đăng nhập thông thường
        this.router.post('/register', this.authController.register);
        this.router.post('/login', this.authController.login);
        this.router.post('/logout', this.authController.logout);
        this.router.get('/get-access-token', this.authController.getAccessToken);
    }

    private serveLoginPage(req: Request, res: Response): void {
        res.sendFile(path.join(__dirname, '../views/index.html'));
    }

    private serveLogoutPage(req: Request, res: Response): void {
        res.sendFile(path.join(__dirname, '../views/logout.html'));
    }
}
