import { Router } from "express";
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
    this.storage = multer.diskStorage({});
    this.upload = multer({ storage: this.storage });
    this.autoBindControllerMethods(this.uploadController);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/recruiter-images', this.upload.array('files'), this.uploadController.uploadRecruiterImages);
    this.router.post('/candidate-image', this.upload.array('files'), this.uploadController.uploadCandidateImages);
    this.router.delete('/recruiter-images/delete', this.uploadController.deleteRecruiterImages);
    this.router.delete('/candidate-images/delete', this.uploadController.deleteCandidateImages);
  }
}