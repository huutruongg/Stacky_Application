import { Request, Response, NextFunction } from "express";
import { BaseController } from "./BaseController";
import AuthService from "../services/AuthService";
import ClientOAuth2 from "client-oauth2";
import axios from "axios";
import dotenv from "dotenv";
import { Provider } from "../enums/EProvider";
import { RecruiterLoginSchema, RecruiterSignUpSchema } from "../utils/validations/AuthValidation";
import { setAuthCookies } from "../middlewares/authenticate";
import { log } from "console";
import { addToBlacklist } from "../utils/blackListToken";
import jwt from "jsonwebtoken";
dotenv.config();

export default class AuthController extends BaseController {
  private authService: AuthService;
  private githubAuth: ClientOAuth2;
  private googleAuth: ClientOAuth2;

  constructor(authService: AuthService) {
    super();
    this.authService = authService;

    this.githubAuth = new ClientOAuth2({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      accessTokenUri: 'https://github.com/login/oauth/access_token',
      authorizationUri: 'https://github.com/login/oauth/authorize',
      redirectUri: process.env.GITHUB_REDIRECT_URI!,
      scopes: ['read:user', 'user:email', 'repo'],
    });

    this.googleAuth = new ClientOAuth2({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      accessTokenUri: 'https://oauth2.googleapis.com/token',
      authorizationUri: 'https://accounts.google.com/o/oauth2/auth',
      redirectUri: process.env.GOOGLE_REDIRECT_URI!,
      scopes: ['profile', 'email'],
    });
  }

  public githubLoginRedirect = (req: Request, res: Response): void => {
    res.redirect(this.githubAuth.code.getUri());
  };

  public googleLoginRedirect = (req: Request, res: Response): void => {
    res.redirect(this.googleAuth.code.getUri());
  };

  public handleGitHubCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.githubAuth.code.getToken(req.originalUrl);
      const accessToken = user.accessToken;
      const jobPostId = (req as any).session.jobPostId;
      delete (req as any).session.jobPostId;

      if (jobPostId) {
        return res.redirect(`${process.env.URL_CLIENT}/github-info?token=${accessToken}&jobPostId=${jobPostId}`);
      }

      const userInfo = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      const emails = await axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      const displayName = userInfo.data.name || userInfo.data.login;
      const email = emails.data.find((e: any) => e.primary && e.verified)?.email || 'No email found';

      const userEntity = await this.authService.handleUserOAuth(Provider.GITHUB, email, displayName, accessToken);

      if (!userEntity) {
        return this.sendError(res, 401, "Failed to create or find user.");
      }

      await setAuthCookies(req, res, userEntity);
      const data = await (req as any).userData;
      const isSuccessful = data?.userId ? true : false;
      res.redirect(`${process.env.URL_CLIENT}/account.stacky.vn?token=${isSuccessful}`);
    } catch (error) {
      next(error);
    }
  };

  public handleGoogleCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.googleAuth.code.getToken(req.originalUrl);
      const accessToken = user.accessToken;

      const userInfo = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      const { name: displayName, email } = userInfo.data;

      const userEntity = await this.authService.handleUserOAuth(Provider.GOOGLE, email, displayName, accessToken);

      if (!userEntity) {
        return this.sendError(res, 401, "Failed to create or find user.");
      }

      await setAuthCookies(req, res, userEntity);
      const data = await (req as any).userData;
      const isSuccessful = data?.userId ? true : false;
      res.redirect(`${process.env.URL_CLIENT}/account.stacky.vn?token=${isSuccessful}`);
    } catch (error) {
      next(error);
    }
  };

  public githubInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { jobPostId } = req.query;
      if (!jobPostId) {
        return this.sendError(res, 400, "JobPostId is required.");
      }

      (req as any).session.jobPostId = jobPostId;

      const url = new URL(this.githubAuth.code.getUri());
      url.searchParams.set('jobPostId', jobPostId as string);

      res.redirect(url.toString());
    } catch (error) {
      next(error);
    }
  };

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = RecruiterSignUpSchema.validate(req.body, { abortEarly: false });
      if (error) return this.sendError(res, 400, error.message);
      const user = await this.authService.recruiterSignUp(req.body);
      if (!user) return this.sendError(res, 401, "Failed to register");

      await setAuthCookies(req, res, user);
      const userInfo = await (req as any).userData;
      if (!userInfo) return this.sendError(res, 401, "Failed to register");

      return this.sendResponse(res, 200, {
        success: true,
        message: "Registered successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = RecruiterLoginSchema.validate(req.body, { abortEarly: false });
      if (error) return this.sendError(res, 400, error.message);
      const { privateEmail, password } = req.body;
      const user = await this.authService.login(privateEmail, password);
      if (!user) return this.sendError(res, 401, "Invalid credentials");

      await setAuthCookies(req, res, user);
      const userInfo = await (req as any).userData;
      if (!userInfo) return this.sendError(res, 401, "Invalid credentials");

      return this.sendResponse(res, 200, {
        success: true,
        message: "Logged in successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  public logout = async (req: Request, res: Response) => {
    req.session.destroy(async (err: any) => {
      if (err) {
        return this.sendError(res, 500, "Logout failed");
      }

      const token = req.cookies["accessToken"];

      if (!token) {
        res.clearCookie("refreshToken");
        res.clearCookie("connect.sid", { path: "/" });
        return this.sendResponse(res, 200, {
          success: true,
          message: "Logged out successfully",
        });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET as string, {
          ignoreExpiration: true,
        }) as jwt.JwtPayload;

        const jti = decoded.jti;
        const exp = decoded.exp;

        if (jti && exp) {
          await addToBlacklist(jti, exp);
        }
      } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
          try {
            const decoded = jwt.decode(token) as jwt.JwtPayload;

            const jti = decoded?.jti;
            const exp = decoded?.exp;

            if (jti && exp) {
              await addToBlacklist(jti, exp);
            }
          } catch (decodeError) {
            log("Failed to decode expired token:", decodeError);
          }
        } else {
          log("Failed to verify token:", err);
        }
      }

      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      res.clearCookie("connect.sid", { path: "/" });

      this.sendResponse(res, 200, {
        success: true,
        message: "Logged out successfully",
      });
    });
  };

  public getAccessToken = async (req: Request, res: Response) => {
    try {
      const accessToken =
        req.cookies["accessToken"] ||
        req.headers["authorization"]?.split(" ")[1];

      if (!accessToken)
        return this.sendError(res, 401, "Authentication required");

      return this.sendResponse(res, 200, {
        success: true,
        accessToken,
      });
    } catch (error) {
      return this.sendError(res, 500, "Failed to retrieve access token");
    }
  };
}
