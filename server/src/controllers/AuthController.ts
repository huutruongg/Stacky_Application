import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github";
import { githubOAuthConfig, googleOAuthConfig } from "../config/Passport";
import { Provider } from "../enums/EProvider";
import AuthService from "../services/AuthService";
import { IUser } from "../interfaces/IUser";
import { log } from "console";
import axios from "axios";
import { BaseController } from "./BaseController";
import dotenv from "dotenv";
import { setAuthCookies } from "../middlewares/AuthenticateMiddleware";
dotenv.config();

export default class AuthController extends BaseController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    super();
    this.authService = authService;
    this.initializeStrategies();
  }

  private initializeStrategies() {
    passport.use("google", this.createGoogleStrategy());
    passport.use("github", this.createGitHubStrategy());

    passport.serializeUser((user: any, done) => done(null, user._id));
    passport.deserializeUser(async (id: string, done) => {
      try {
        const user = await this.authService.findById(id);
        done(null, user);
      } catch (error) {
        done(error);
      }
    });
  }

  private createGoogleStrategy() {
    return new GoogleStrategy(
      googleOAuthConfig,
      async (accessToken, _, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value || "";
          const user = await this.authService.handleUserOAuth(
            Provider.GOOGLE,
            profile.id,
            email,
            profile.displayName,
            accessToken
          );
          done(null, user || false);
        } catch (error: any) {
          // Handle the error and pass it to the next stage
          done(null, false, { message: error.message });
        }
      }
    );
  }

  private createGitHubStrategy() {
    return new GitHubStrategy(
      githubOAuthConfig,
      async (accessToken, _, profile, done) => {
        try {
          const email = await this.getGitHubEmail(profile, accessToken);
          const user = await this.authService.handleUserOAuth(
            Provider.GITHUB,
            profile.id,
            email,
            profile.displayName,
            accessToken
          );
          done(null, user || false);
        } catch (error: any) {
          // Handle the error and pass it to the next stage
          done(null, false, { message: error.message });
        }
      }
    );
  }

  private async getGitHubEmail(
    profile: any,
    accessToken: string
  ): Promise<string> {
    try {
      const response = await axios.get("https://api.github.com/user/emails", {
        headers: { Authorization: `token ${accessToken}` },
      });
      const primaryEmail = response.data.find((e: any) => e.primary)?.email;
      if (!primaryEmail)
        throw new Error("Cannot retrieve email from GitHub account");
      return primaryEmail;
    } catch (error) {
      log(error);
      return "";
    }
  }

  public loginWithOAuth(provider: "google" | "github") {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        passport.authenticate(
          provider,
          { session: false },
          async (err: any, user: IUser, info: any) => {
            if (err || !user) {
              log(err || info.message);
              res
                .status(401)
                .json({
                  success: false,
                  message: info?.message || "Authentication failed",
                });
              return;
            }
            const candidate = await this.authService.findById(String(user._id));
            // log("candidate", candidate);
            if (!candidate) {
              res
                .status(401)
                .json({ success: false, message: "Authentication failed" });
              return;
            }
            // Set the authentication cookies for the user
            await setAuthCookies(req, res, user);
            const userInfo = await (req as any).userData;
            let isSuccessful = userInfo?.userId ? true : false;
            log("success: ", isSuccessful);
            log("userInfo oauth: ", userInfo);
            res.redirect(
              `${process.env.URL_CLIENT}/account.stacky.vn?token=${isSuccessful}`
            );
          }
        )(req, res, next);
      } catch (error) {
        return next(error);
      }
    };
  }

  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.authService.recruiterSignUp(req.body);
      if (!user)
        return this.sendError(
          res,
          401,
          new Error("Failed to register").message
        );

      await setAuthCookies(req, res, user);
      const userInfo = await (req as any).userData;
      log(userInfo);
      if (!userInfo)
        return this.sendError(
          res,
          401,
          new Error("Failed to register").message
        );
      return this.sendResponse(res, 200, {
        success: true,
        message: "Registered successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { privateEmail, password } = req.body;
      const user = await this.authService.login(privateEmail, password);
      log("user", user);
      if (!user) return this.sendError(res, 401, "Invalid credentials");
      await setAuthCookies(req, res, user);
      const userInfo = await (req as any).userData;
      log(userInfo);
      log("userInfo", userInfo);
      if (!userInfo) return this.sendError(res, 401, "Invalid credentials");
      return this.sendResponse(res, 200, {
        success: true,
        message: "Logged in successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  public async logout(req: Request, res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return this.sendError(res, 500, "Logout failed");
      }
      // Clear cookies
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      // Clear the session cookie (connect.sid)
      res.clearCookie("connect.sid", { path: '/' }); // Chú ý: bạn có thể cần truyền path phù hợp
      log("Logged out successfully");
      this.sendResponse(res, 200, {
        success: true,
        message: "Logged out successfully",
      });
    });
  }


  public async getAccessToken(req: Request, res: Response) {
    try {
      // const userInfo = (req as any).userData;
      const accessToken =
        req.cookies["accessToken"] ||
        req.headers["authorization"]?.split(" ")[1];

      if (!accessToken)
        return this.sendError(
          res,
          401,
          new Error("Authentication required").message
        );
      return this.sendResponse(res, 200, {
        success: true,
        accessToken: accessToken,
      });
    } catch (error) {
      return this.sendError(
        res,
        500,
        new Error("Failed to get access token").message
      );
    }
  }
}
