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
    this.storage =  multer.memoryStorage();
    this.upload = multer({ storage: this.storage });
    this.autoBindControllerMethods(this.uploadController);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/recruiter-images', this.upload.array('files'), this.uploadController.uploadRecruiterImages); // Done
    this.router.post('/candidate-image', this.upload.array('files'), this.uploadController.uploadCandidateImages); // Done
    this.router.delete('/recruiter-images/delete', this.uploadController.deleteRecruiterImages); // Done
    this.router.delete('/candidate-images/delete', this.uploadController.deleteCandidateImages); // Done
  }
}