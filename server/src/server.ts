import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import emailRouter from "./routes/email.routes"
import userRouter from "./routes/user.routes"
import authRouter from "./routes/auth.routes"
import githubRouter from "./routes/github.routes"
import uploadRouter from "./routes/uploadFile.routes"
import passport from 'passport';
import session from 'express-session';
import cors from "cors"
import { log } from "console";
import { v4 as uuidv4 } from 'uuid';
import './config/passport-setup';
dotenv.config();


const corsOptions = {
  origin: process.env.URL_CLIENT,
  optionsSuccessStatus: 200
}

const app: Application = express()
const port: number = Number(process.env.PORT) | 4080;

app.use(cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

// Routing flow configuration

app.use('/auth/', authRouter)
app.use('/api/', emailRouter)
app.use('/api/', userRouter)
app.use('/api', githubRouter)
app.use('/api', uploadRouter)
app.get('/home', (req: Request, res: Response) => {
  res.send("Welcome to Stacky application!")
})
app.listen(port, () => {
  log(`[server]: Server is running at http://localhost:${port}`);
  log(uuidv4())
});