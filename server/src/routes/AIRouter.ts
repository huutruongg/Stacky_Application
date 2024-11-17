import AIController from "../controllers/AIController";
import CandidateModel from "../models/CandidateModel";
import JobPostModel from "../models/JobPostModel";
import { BaseRoutes } from "./BaseRoutes";
import { Request, Response } from "express";
export default class AIRouter extends BaseRoutes {
    private aiController: AIController;
    constructor(aiController: AIController) {
        super();
        this.aiController = aiController;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/get-data-analys', this.aiController.getAI);
    }
    
}