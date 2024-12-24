import express, { Application } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import routes from './routes/index';

const envFile = process.env.NODE_ENV === 'development' ? '.env.local' : '.env';
dotenv.config({ path: path.resolve(__dirname, envFile) });

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddleware();
    this.initializeRoutes();
  }

  private initializeMiddleware(): void {
    this.app.set('trust proxy', 1);
    this.app.use(morgan('dev'));
    this.app.use(cookieParser());
    this.configureHelmet();
    this.configureRateLimit();
    this.configureCors();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.configureSession();
  }

  private configureHelmet(): void {
    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://trusted.cdn.com"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
          },
        },
        dnsPrefetchControl: { allow: false },
        frameguard: { action: 'deny' },
        hidePoweredBy: true,
        hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
        ieNoOpen: true,
        noSniff: true,
        permittedCrossDomainPolicies: { permittedPolicies: 'none' },
        referrerPolicy: { policy: 'no-referrer' },
        xssFilter: true,
      })
    );
  }

  private configureRateLimit(): void {
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 500, // Limit each IP to 500 requests per `window` (15 minutes)
      message: 'Too many requests from this IP, please try again later.',
    });
    this.app.use(limiter);
  }

  private configureCors(): void {
    this.app.use(
      cors({
        origin: [
          process.env.URL_CLIENT || 'http://localhost:3000',
          'https://happily-novel-chamois.ngrok-free.app',
          process.env.URL_SERVER || 'http://localhost:5000',
        ],
        credentials: true,
        optionsSuccessStatus: 200,
      })
    );
  }

  private configureSession(): void {
    this.app.use(
      session({
        secret: process.env.SESSION_SECRET || 'default_secret',
        resave: false,
        saveUninitialized: true,
        cookie: {
          secure: false,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        },
      })
    );
  }

  private initializeRoutes(): void {
    this.app.use('/', routes);
    this.app.use('/home', (req, res) => {
      res.send('Welcome to the home page');
    });
  }

  public getApp(): Application {
    return this.app;
  }
}

export default new App().getApp();
