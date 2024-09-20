import { Request, Response, Router } from "express";

const route = Router();

route.get('/', (req: Request, res: Response) => {
    res.send("Hello World!");
})

export default route;