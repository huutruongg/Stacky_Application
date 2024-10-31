import { Request, Response } from "express";
import path from "path";
import UploadController from "../controllers/UploadController";
import multer from 'multer'
import { BaseRoutes } from "./BaseRoutes";

export default class UploadRouter extends BaseRoutes {
  private uploadController: UploadController;
  private storage;
  private upload;
  constructor(uploadController: UploadController) {
    super();
    this.uploadController = uploadController;
    this.storage =  multer.memoryStorage();
    this.upload = multer({ storage: this.storage });
    this.autoBindControllerMethods(this.uploadController);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/upload', this.serveUploadPage);
    this.router.post('/recruiter-images', this.upload.array('files'), this.uploadController.uploadRecruiterImages); // Done
    this.router.post('/candidate-image', this.upload.array('files'), this.uploadController.uploadCandidateImages); // Done
    this.router.delete('/recruiter-images/delete', this.uploadController.deleteRecruiterImages); // Done
    this.router.delete('/candidate-images/delete', this.uploadController.deleteCandidateImages); // Done
  }

  private serveUploadPage(req: Request, res: Response): void {
    res.sendFile(path.join(__dirname, '../views/upload.html'));
}
}