import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import testRouter from "./routes/test.routes"
import { log } from "console";

dotenv.config();

const app: Application = express()
const port: number = Number(process.env.PORT) | 4080;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// Routing flow configuration
app.use('/api/', testRouter)


app.listen(port, () => {
  log(`[server]: Server is running at http://localhost:${port}`);
});