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

    // Cấu hình GitHub OAuth
    this.githubAuth = new ClientOAuth2({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      accessTokenUri: 'https://github.com/login/oauth/access_token',
      authorizationUri: 'https://github.com/login/oauth/authorize',
      redirectUri: process.env.GITHUB_REDIRECT_URI!,
      scopes: ['read:user', 'user:email', 'repo'],
    });

    // Cấu hình Google OAuth
    this.googleAuth = new ClientOAuth2({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      accessTokenUri: 'https://oauth2.googleapis.com/token',
      authorizationUri: 'https://accounts.google.com/o/oauth2/auth',
      redirectUri: process.env.GOOGLE_REDIRECT_URI!,
      scopes: ['profile', 'email'],
    });
  }

  // Đường dẫn này để chuyển hướng đến GitHub OAuth login
  public githubLoginRedirect = (req: Request, res: Response): void => {
    // Chuyển hướng người dùng tới GitHub để đăng nhập
    const authUri = this.githubAuth.code.getUri();
    res.redirect(authUri);
  };

  public googleLoginRedirect = (req: Request, res: Response): void => {
    const authUri = this.googleAuth.code.getUri();
    res.redirect(authUri); // Chuyển hướng người dùng đến Google OAuth
  };


  // GitHub OAuth callback handler
  public handleGitHubCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.githubAuth.code.getToken(req.originalUrl);
      log("req.originalUrl:", req.originalUrl);
      const accessToken = user.accessToken;
      // Get jobPostId from request body (set by githubInfo route)
      const jobPostId = (req as any).session.jobPostId;  // Retrieve from session
      // Clear the jobPostId from the session after it has been used
      delete (req as any).session.jobPostId;
      if (jobPostId) {
        // If jobPostId is provided, return the token with the jobPostId appended to the URL
        return res.redirect(`${process.env.URL_CLIENT}/github-info?token=${accessToken}&jobPostId=${jobPostId}`);
      }

      // Lấy thông tin người dùng từ GitHub
      const userInfo = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      // Lấy email của người dùng
      const emails = await axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      const displayName = userInfo.data.name || userInfo.data.login;
      const email = emails.data.find((e: any) => e.primary && e.verified)?.email || 'No email found';

      // Lưu thông tin người dùng vào database qua AuthService
      const userEntity = await this.authService.handleUserOAuth(Provider.GITHUB, email, displayName, accessToken);

      if (!userEntity) {
        return this.sendError(res, 401, "Failed to create or find user.");
      }

      // Set authentication cookies
      await setAuthCookies(req, res, userEntity);
      const data = await (req as any).userData;
      let isSuccessful = data?.userId ? true : false;
      log("data oauth:", data);
      res.redirect(`${process.env.URL_CLIENT}/account.stacky.vn?token=${isSuccessful}`);
    } catch (error) {
      next(error);
    }
  };

  public handleGoogleCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.googleAuth.code.getToken(req.originalUrl);
      log("req.originalUrl:", req.originalUrl);
      const accessToken = user.accessToken;

      const userInfo = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      const { name: displayName, email } = userInfo.data;

      // Lưu thông tin người dùng vào database qua AuthService
      const userEntity = await this.authService.handleUserOAuth(Provider.GOOGLE, email, displayName, accessToken);

      if (!userEntity) {
        return this.sendError(res, 401, "Failed to create or find user.");
      }

      // Set authentication cookies
      await setAuthCookies(req, res, userEntity);
      const data = await (req as any).userData;
      let isSuccessful = data?.userId ? true : false;
      log("data oauth:", data);
      res.redirect(`${process.env.URL_CLIENT}/account.stacky.vn?token=${isSuccessful}`);
    } catch (error) {
      next(error);
    }
  };

  public githubInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    log("req.originalUrl:", req.originalUrl);  // Logs the incoming request URL
    try {
      const { jobPostId } = req.query;
      if (!jobPostId) {
        return this.sendError(res, 400, "JobPostId is required.");
      }

      // Store jobPostId in session
      (req as any).session.jobPostId = jobPostId; // Store jobPostId in the session

      // Get the base OAuth URL from githubAuth
      let redirectUrl = this.githubAuth.code.getUri();

      // Manually append jobPostId to the OAuth URL
      const url = new URL(redirectUrl); // Convert redirectUrl to URL object
      url.searchParams.set('jobPostId', jobPostId as string); // Append jobPostId as query param

      log("Redirecting to GitHub OAuth URL:", url.toString());  // Log the full URL with jobPostId

      // Redirect the user to GitHub OAuth
      return res.redirect(url.toString());  // Use toString() to convert URL object to string
    } catch (error) {
      next(error);
    }
  };


  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = RecruiterSignUpSchema.validate(req.body, { abortEarly: false });
      if (error) return this.sendError(res, 400, error.message);
      const user = await this.authService.recruiterSignUp(req.body);
      if (!user) return this.sendError(res, 401, new Error("Failed to register").message);

      await setAuthCookies(req, res, user);
      const userInfo = await (req as any).userData;
      if (!userInfo) return this.sendError(res, 401, new Error("Failed to register").message);

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
  }

  public logout = async (req: Request, res: Response) => {
    req.session.destroy(async (err: any) => {
      if (err) {
        return this.sendError(res, 500, "Logout failed");
      }

      const token = req.cookies["accessToken"];
      log("token: ", token);

      // Kiểm tra xem có token không
      if (!token) {
        res.clearCookie("refreshToken");
        res.clearCookie("connect.sid", { path: "/" });
        this.sendResponse(res, 200, {
          success: true,
          message: "Logged out successfully",
        });
      }

      try {
        // Xác thực token, bỏ qua expiration
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET as string, {
          ignoreExpiration: true,
        }) as jwt.JwtPayload;

        // Nếu token hợp lệ hoặc đã hết hạn, thêm vào blacklist
        const jti = decoded.jti;
        const exp = decoded.exp;

        if (jti && exp) {
          log("Adding token to blacklist:", jti);
          await addToBlacklist(jti, exp);
        }
      } catch (err) {
        // Nếu lỗi là token hết hạn, vẫn tiếp tục thêm vào blacklist
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

      // Xóa cookie bất kể token hợp lệ hay không
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      res.clearCookie("connect.sid", { path: "/" });

      log("Logged out successfully");
      this.sendResponse(res, 200, {
        success: true,
        message: "Logged out successfully",
      });
    });
  };

  public async getAccessToken(req: Request, res: Response) {
    try {
      const accessToken =
        req.cookies["accessToken"] ||
        req.headers["authorization"]?.split(" ")[1];

      if (!accessToken)
        return this.sendError(res, 401, new Error("Authentication required").message);

      return this.sendResponse(res, 200, {
        success: true,
        accessToken,
      });
    } catch (error) {
      return this.sendError(res, 500, new Error("Failed to retrieve access token").message);
    }
  }
}
