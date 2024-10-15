import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import passport from "passport";
import { log } from "console";
import AuthService from "./auth.service";
import RecruiterService from "../Recruiter/recruiter.service";
import UserRole from "../../types/EnumUserRole";
import { IRecruiter } from "../../types/IRecruiter";
import { IUser } from "../../types/IUser";
import { AuthValidation } from "../../utils/validations/auth.validation";
import {
  handleServiceError,
  handleValidationError,
} from "../../utils/errors/handle.error";
import { CustomSessionRequest } from "../../types/Custom";
dotenv.config();

const AuthController = {
  signupRecruiter: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { error } = AuthValidation.signupRecruiterSchema.validate(req.body);

      if (error) {
        res
          .status(400)
          .json({ success: false, message: error.details[0].message });
        return;
      }

      const {
        privateEmail,
        password,
        phoneNumber,
        orgTaxNumber,
        orgName,
        orgField,
        orgScale,
        orgAddress,
      } = req.body;

      const existingUser = await AuthService.getUserByEmail(privateEmail);
      if (existingUser) {
        res
          .status(409)
          .json({
            success: false,
            message: "This email already exists! Please enter another email.",
          });
        return;
      }

      const recruiter: IRecruiter | null =
        await RecruiterService.createRecruiter(
          privateEmail,
          password,
          phoneNumber,
          orgTaxNumber,
          orgName,
          orgField,
          orgScale,
          orgAddress
        );

      if (!recruiter) {
        res
          .status(500)
          .json({ success: false, message: "Failed to create recruiter." });
        return;
      }
      req.session.userId = String(recruiter.userId);
      const accessToken = AuthService.generateAccessToken(
        recruiter.userId as string,
        privateEmail,
        UserRole.RECRUITER
      );
      const refreshToken = AuthService.generateRefreshToken(
        recruiter.userId as string,
        privateEmail,
        UserRole.RECRUITER
      );

      await AuthService.saveRefreshToken(String(recruiter.userId), refreshToken);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });


      res.status(200).json({
        success: true,
        accessToken,
        userId: recruiter.userId,
        role: UserRole.RECRUITER,
      });
    } catch (err) {
      return handleServiceError(err, res, next);
    }
  },

  recruiterLogin: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { error } = AuthValidation.loginSchema.validate(req.body);
      if (handleValidationError(error, res)) return;

      const { email, password } = req.body;

      const existingUser: IUser | null = await AuthService.getUserByEmail(
        email
      );
      if (!existingUser) {
        res.status(401).json({ success: false, message: "User not found!" });
        return;
      }
      req.session.userId = String(existingUser._id);


      const isValidPassword = await AuthService.checkPassword(
        password,
        String(existingUser.password)
      );
      if (!isValidPassword) {
        res
          .status(401)
          .json({ success: false, message: "Invalid credentials!" });
        return;
      }

      const accessToken = AuthService.generateAccessToken(
        String(existingUser._id),
        existingUser.privateEmail,
        existingUser.role
      );
      const refreshToken = AuthService.generateRefreshToken(
        existingUser._id as string,
        existingUser.privateEmail,
        existingUser.role
      );

      await AuthService.saveRefreshToken(String(existingUser._id), refreshToken);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        accessToken,
        userId: existingUser._id,
        role: existingUser.role,
      });
    } catch (err) {
      return handleServiceError(err, res, next);
    }
  },

  loginCandidateOAuth:
    (provider: "google" | "github") =>
      async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
          passport.authenticate(
            provider,
            { session: false },
            async (err: any, user: any) => {
              if (err || !user) {
                log(err);
                res
                  .status(401)
                  .json({ success: false, message: "Authentication failed" });
                return res.redirect(`${process.env.CLIENT_URL}/account.stacky.vn?token=false`);
              }

              const candidate: IUser | null = await AuthService.getUserById(
                String(user._id)
              );
              if (!candidate) {
                res
                  .status(401)
                  .json({ success: false, message: "Authentication failed" });
                return res.redirect(`${process.env.CLIENT_URL}/account.stacky.vn?token=false`);;
              }
              req.session.userId = String(candidate._id);
              const accessToken = AuthService.generateAccessToken(
                String(candidate._id),
                candidate.privateEmail,
                candidate.role
              );
              const refreshToken = AuthService.generateRefreshToken(
                String(candidate._id),
                candidate.privateEmail,
                candidate.role
              );
              await AuthService.saveRefreshToken(String(candidate._id), refreshToken);
              res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
              });

              req.session.accessToken = accessToken;
              res.redirect("http://localhost:5173/account.stacky.vn?token=true");
            }
          )(req, res, next);
        } catch (error) {
          return handleServiceError(error, res, next);
        }
      },

  adminLogin: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { error } = AuthValidation.loginSchema.validate(req.body);
      if (handleValidationError(error, res)) return;

      const { email, password } = req.body;
      const existingUser = await AuthService.getUserByEmail(email);
      if (!existingUser) {
        res.status(401).json({ message: "User not found!" });
        return;
      }

      const isValidPassword = await AuthService.checkPassword(
        password,
        String(existingUser.password)
      );
      if (!isValidPassword) {
        res.status(401).json({ message: "Invalid credentials!" });
        return;
      }
      req.session.userId = String(existingUser._id);
      const accessToken = AuthService.generateAccessToken(
        String(existingUser._id),
        existingUser.privateEmail,
        existingUser.role
      );
      const refreshToken = AuthService.generateRefreshToken(
        String(existingUser._id),
        existingUser.privateEmail,
        existingUser.role
      );

      await AuthService.saveRefreshToken(String(existingUser._id), refreshToken);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });


      res.status(200).json({
        success: true,
        accessToken,
        userId: existingUser._id,
        role: existingUser.role,
      });
    } catch (err) {
      return handleServiceError(err, res, next);
    }
  },

  logout: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        res.status(400).json({ success: false, message: "User not logged in!" });
        return;
      }

      // Hủy refresh token trong cơ sở dữ liệu
      const isRefreshTokenDeleted = await AuthService.deleteRefreshTokenByUserId(userId);
      if (!isRefreshTokenDeleted) {
        res.status(500).json({ success: false, message: "Failed to delete refresh token!" });
        return;
      }

      // Hủy session
      req.session.destroy((err) => {
        if (err) {
          res
            .status(500)
            .json({ success: false, message: "Something went wrong with session!" });
          return;
        }

        res.clearCookie('refreshToken');
        res.clearCookie('connect.sid');

        res.status(200).json({ success: true, message: "Logout successful!" });
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error!" });
    }
  },

  regenerateAccessToken: async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.sendStatus(401);
      return
    }

    try {
      const user: IUser | null = await AuthService.getUserByRefreshToken(refreshToken);

      if (!user) {
        res.sendStatus(403);
        return;
      }

      const accessToken = AuthService.generateAccessToken(String(user._id), user.privateEmail, user.role);
      res.status(200).json({ accessToken });
    } catch (error) {
      res.sendStatus(403);
    }
  },

  getAccessToken: (req: CustomSessionRequest, res: Response) => {
    const accessToken = req.session?.accessToken;

    if (!accessToken) {
      return res
        .status(401)
        .json({ success: false, message: "No tokens found" });
    }

    res.status(200).json({
      accessToken,
    });
  },
};

export default AuthController;
