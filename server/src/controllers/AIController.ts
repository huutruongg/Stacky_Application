import axios from "axios";
import { ICertification } from "../interfaces/ICertification";
import { IEducation } from "../interfaces/IEducation";
import { ILanguage } from "../interfaces/ILanguage";
import CandidateModel from "../models/CandidateModel";
import JobPostModel from "../models/JobPostModel";
import { transformCV } from "../utils/CVHandler";
import { BaseController } from "./BaseController";
import { Request, Response } from "express";
export default class AIController extends BaseController {
    constructor() {
        super();
    }

    public async getAI(req: Request, res: Response): Promise<void> {
        try {
            const userId = "670fbcbda4cdb849c025d715";
            const jobPostId = "77609b225afc2e223b2c954b";

            async function getCV(userId: string) {
                return await CandidateModel.findOne({ userId: userId }).lean().exec();
            }

            async function getJobPost(jobPostId: string) {
                return await JobPostModel.findById(jobPostId).lean().exec();
            }

            const cv = await getCV(userId);
            const jd = await getJobPost(jobPostId);

            if (!cv || !jd) {
                return this.sendError(res, 404, "CV or Job Post not found");
            }

            const cvData = {
                educations: cv.educations,
                languages: cv.languages,
                certifications: cv.certifications,
            } as { educations: IEducation[], languages: ILanguage[], certifications: ICertification[] };
            const jdData = {
                languages: jd.languagesRequired,
            } as { languages: ILanguage[] };

            const transformedCV = transformCV(cvData);
            const transformedJD = transformCV(jdData);

            const input = {
                professionalSkillsCV: cv.professionalSkills,
                educationsCV: JSON.stringify(transformedCV.educations),
                languagesCV: JSON.stringify(transformedCV.languages),
                certificationsCV: JSON.stringify(transformedCV.certifications),
                professionalSkillsJob: jd.professionalSkills,
                educationsJob: jd.educationRequired,
                languagesJob: JSON.stringify(transformedJD.languages),
                certificationsJob: jd.certificateRequired,
            };

            const result = await axios.post(`http://localhost:8000/get_percents`, input, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            res.status(200).json(result.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            return this.sendError(res, 500, "Internal server error");
        }
    }

}