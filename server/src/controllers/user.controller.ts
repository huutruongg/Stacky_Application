import UserService from "../services/user.service"
import { Request, Response } from "express";

const UserController = {
    getAllUser: async (req: Request, res: Response): Promise<void> => {
        const data = await UserService.getAllCandidates();
        res.status(200).json({success: true, data});
    }
}

export default UserController;
