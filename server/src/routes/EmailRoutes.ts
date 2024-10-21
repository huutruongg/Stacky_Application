import EmailController from "../controllers/EmailController";
import { BaseRoutes } from "./BaseRoutes";

export default class EmailRoutes extends BaseRoutes {
    private emailController: EmailController;

    constructor(emailController: EmailController) {
        super();
        this.emailController = emailController;
        this.autoBindControllerMethods(this.emailController);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/send-email', this.emailController.sendEmail);
    }
}