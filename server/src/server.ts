import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import emailRouter from './routes/email.routes';
import authRouter from './routes/auth.routes';
import githubRouter from './routes/github.routes';
import uploadRouter from './routes/upload.routes';
import recruiterRouter from './routes/recruiter.routes';
import candidateRouter from './routes/candidate.routes';
import jobPostingRouter from './routes/jobManagement.routes';
import zalopayRouter from './routes/zaloPay.routes';
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { log } from 'console';
import './config/passport-setup';
import './worker/requestProcessor';
import { connectDB, disconnectDB } from './config/database';
import { queueRequestMiddleware } from './middlewares/queueRequest';

dotenv.config();

const corsOptions = {
  origin: process.env.URL_CLIENT,
  credentials: true,
  optionsSuccessStatus: 200,
};

const app: Application = express();
const port: number = Number(process.env.PORT);

// Apply Helmet for setting HTTP headers with advanced configuration
app.use(
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

// Apply rate limiting to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (15 minutes)
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Aplly redis queue to all routes
app.use(queueRequestMiddleware);

// Routing flow configuration
app.use('/auth', authRouter);
app.use('/email', emailRouter);
app.use('/github', githubRouter);
app.use('/upload', uploadRouter);
app.use('/recruiter', recruiterRouter);
app.use('/candidate', candidateRouter);
app.use('/job-posting', jobPostingRouter);
app.use('/zalo-pay', zalopayRouter);
app.get('/home', (req: Request, res: Response) => {
  res.send('Welcome to Stacky application!');
});

process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

connectDB()
  .then((db) => {
    console.log('Database connection established.');
    app.listen(port, () => {
      log(`[server]: Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
  });