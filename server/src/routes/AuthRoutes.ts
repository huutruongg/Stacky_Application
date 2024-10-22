import { Router, Request, Response, NextFunction } from "express";
import AuthController from "../controllers/AuthController";
import path from "path";
import passport from "passport";
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
        this.router.get('/login', this.serveLoginPage);
        this.router.post('/register', this.authController.register);
        this.router.post('/login', this.authController.login);
        this.router.post('/logout', this.authController.logout);
        this.router.get('/google/callback', this.authController.loginWithOAuth('google'));
        this.router.get('/github/callback', this.authController.loginWithOAuth('github'));
        this.router.get('/get-access-token', this.authController.getAccessToken);
        this.router.post('/regenerate-access-token', this.authController.regenerateAccessToken);
    }

    private serveLoginPage(req: Request, res: Response): void {
        res.sendFile(path.join(__dirname, '../views/index.html'));
    }
}

