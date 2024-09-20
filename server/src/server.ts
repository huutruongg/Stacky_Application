import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import emailRouter from "./routes/email.routes"
import { log } from "console";
dotenv.config();
import cors from "cors"

const corsOptions = {
  origin: 'http://localhost:5170',
  optionsSuccessStatus: 200
}

const app: Application = express()
const port: number = Number(process.env.PORT) | 4080;

app.use(cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// Routing flow configuration
app.get('/', (req: Request, res: Response) => {
  res.send("Welcome to stacky API!")
})
app.use('/api/', emailRouter)

app.listen(port, () => {
  log(`[server]: Server is running at http://localhost:${port}`);
});