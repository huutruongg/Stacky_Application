// import { Request, Response, NextFunction } from "express";
// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import { Strategy as GitHubStrategy } from "passport-github";
// import { githubOAuthConfig, googleOAuthConfig } from "../config/Passport";
// import { Provider } from "../enums/EProvider";
// import AuthService from "../services/AuthService";
// import { IUser } from "../interfaces/IUser";
// import { log } from "console";
// import axios from "axios";
// import { BaseController } from "./BaseController";
// import dotenv from "dotenv";
// import { setAuthCookies } from "../middlewares/Authenticate";
// import { RecruiterLoginSchema, RecruiterSignUpSchema } from "../utils/validations/AuthValidation";
// dotenv.config();

// export default class AuthController extends BaseController {
//   private authService: AuthService;

//   constructor(authService: AuthService) {
//     super();
//     this.authService = authService;
//     this.initializeStrategies();
//   }

//   private initializeStrategies() {
//     passport.use("google", this.createGoogleStrategy());
//     passport.use("github", this.createGitHubStrategy());

//     passport.serializeUser((user: any, done) => done(null, user._id));
//     passport.deserializeUser(async (id: string, done) => {
//       try {
//         const user = await this.authService.findById(id);
//         done(null, user);
//       } catch (error) {
//         done(error);
//       }
//     });
//   }

//   private createGoogleStrategy() {
//     return new GoogleStrategy(
//       googleOAuthConfig,
//       async (accessToken, _, profile, done) => {
//         try {
//           const email = profile.emails?.[0]?.value || "";
//           const user = await this.authService.handleUserOAuth(
//             Provider.GOOGLE,
//             profile.id,
//             email,
//             profile.displayName,
//             accessToken
//           );
//           done(null, user || false);
//         } catch (error: any) {
//           // Handle the error and pass it to the next stage
//           done(null, false, { message: error.message });
//         }
//       }
//     );
//   }

//   private createGitHubStrategy() {
//     return new GitHubStrategy(
//       githubOAuthConfig,
//       async (accessToken, _, profile, done) => {
//         try {
//           const email = await this.getGitHubEmail(profile, accessToken);
// const user = await this.authService.handleUserOAuth(
//             Provider.GITHUB,
//             profile.id,
//             email,
//             profile.displayName,
//             accessToken
//           );
//           done(null, user || false);
//         } catch (error: any) {
//           // Handle the error and pass it to the next stage
//           done(null, false, { message: error.message });
//         }
//       }
//     );
//   }

//   private async getGitHubEmail(
//     profile: any,
//     accessToken: string
//   ): Promise<string> {
//     try {
//       const response = await axios.get("https://api.github.com/user/emails", {
//         headers: { Authorization: `token ${accessToken}` },
//       });
//       const primaryEmail = response.data.find((e: any) => e.primary)?.email;
//       if (!primaryEmail)
//         throw new Error("Cannot retrieve email from GitHub account");
//       return primaryEmail;
//     } catch (error) {
//       log(error);
//       return "";
//     }
//   }

//   public loginWithOAuth(provider: "google" | "github") {
//     return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//       try {
//         const { jobPostId } = req.query;
//         log("jobPostId from query:", jobPostId);

//         // Prepare the state with jobPostId
//         const state = jobPostId ? { jobPostId: String(jobPostId) } : {};

//         passport.authenticate(
//           provider,
//           { session: false, state: JSON.stringify(state) }, // Pass state here
//           async (err: any, user: IUser, info: any) => {
//             if (err || !user) {
//               log(err || info.message);
//               res.status(401).json({
//                 success: false,
//                 message: info?.message || "Authentication failed",
//               });
//               return;
//             }

//             // Check jobPostId only once, process it if exists
//             if (jobPostId) {
//               log("jobPostId found, handling GitHub token...");
//               await this.getGithubToken(req, res, String(jobPostId));
//               return; // Return early if jobPostId exists
//             }

//             // Normal OAuth flow (for non-jobPostId requests)
//             const candidate = await this.authService.findById(String(user._id));
//             if (!candidate) {
//               res
//                 .status(401)
//                 .json({ success: false, message: "Authentication failed" });
//               return;
//             }

//             // Set authentication cookies
//             await setAuthCookies(req, res, user);
//             const userInfo = await (req as any).userData;
//             let isSuccessful = userInfo?.userId ? true : false;
//             log("userInfo oauth:", userInfo);
//             res.redirect(`${process.env.URL_CLIENT}/account.stacky.vn?token=${isSuccessful}`);
//           }
//         )(req, res, next);
//       } catch (error) {
//         return next(error);
//       }
//     };
//   }

//   public getGithubToken = async (req: Request, res: Response, jobPostId: string) => {
//     const clientId = process.env.GITHUB_CLIENT_ID;
//     const clientSecret = process.env.GITHUB_CLIENT_SECRET;
//     const code = req.query.code as string;

//     if (!code) {
//       res.status(400).json({ error: 'Missing authorization code' });
//       return;
//     }

//     try {
//       // Request GitHub to obtain access token
//       const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
//         body: JSON.stringify({
//           client_id: clientId,
//           client_secret: clientSecret,
//           code,
//         }),
//       });
//       const tokenData = await tokenResponse.json();

//       if (tokenData.error) {
//         res.status(400).json({ error: tokenData.error_description });
//         return;
//       }

//       const accessToken = tokenData.access_token;

//       res.status(200).json({ success: true, data: { jobPostId: jobPostId, token: accessToken } });
//     } catch (error: any) {
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   }

//   public async register(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { error } = RecruiterSignUpSchema.validate(req.body, { abortEarly: false });
//       if (error) return this.sendError(res, 400, error.message);
//       const user = await this.authService.recruiterSignUp(req.body);
//       if (!user) return this.sendError(res, 401, new Error("Failed to register").message);

//       await setAuthCookies(req, res, user);
//       const userInfo = await (req as any).userData;
//       if (!userInfo) return this.sendError(res, 401, new Error("Failed to register").message);

//       return this.sendResponse(res, 200, {
//         success: true,
//         message: "Registered successfully",
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   public async login(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { error } = RecruiterLoginSchema.validate(req.body, { abortEarly: false });
//       if (error) return this.sendError(res, 400, error.message);
//       const { privateEmail, password } = req.body;
//       const user = await this.authService.login(privateEmail, password);
//       if (!user) return this.sendError(res, 401, "Invalid credentials");

//       await setAuthCookies(req, res, user);
//       const userInfo = await (req as any).userData;
//       if (!userInfo) return this.sendError(res, 401, "Invalid credentials");

//       return this.sendResponse(res, 200, {
//         success: true,
//         message: "Logged in successfully",
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   public async logout(req: Request, res: Response) {
//     req.session.destroy((err) => {
//       if (err) {
//         return this.sendError(res, 500, "Logout failed");
//       }
//       res.clearCookie("refreshToken");
//       res.clearCookie("accessToken");
//       res.clearCookie("connect.sid", { path: '/' });
//       this.sendResponse(res, 200, {
//         success: true,
//         message: "Logged out successfully",
//       });
//     });
//   }

//   public async getAccessToken(req: Request, res: Response) {
//     try {
//       const accessToken =
//         req.cookies["accessToken"] ||
//         req.headers["authorization"]?.split(" ")[1];

//       if (!accessToken)
//         return this.sendError(res, 401, new Error("Authentication required").message);

//       return this.sendResponse(res, 200, {
//         success: true,
//         accessToken,
//       });
//     } catch (error) {
//       return this.sendError(res, 500, new Error("Failed to retrieve access token").message);
//     }
//   }
// }


import { Request, Response, NextFunction } from "express";
import { BaseController } from "./BaseController";
import AuthService from "../services/AuthService";
import ClientOAuth2 from "client-oauth2";
import axios from "axios";
import dotenv from "dotenv";
import { Provider } from "../enums/EProvider";
import { RecruiterLoginSchema, RecruiterSignUpSchema } from "../utils/validations/AuthValidation";
import { setAuthCookies } from "../middlewares/Authenticate";
import { log } from "console";
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

  public async logout(req: Request, res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return this.sendError(res, 500, "Logout failed");
      }
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      res.clearCookie("connect.sid", { path: '/' });
      this.sendResponse(res, 200, {
        success: true,
        message: "Logged out successfully",
      });
    });
  }

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
