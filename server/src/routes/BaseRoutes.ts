import { Router } from 'express';

export abstract class BaseRoutes {
    protected router: Router;

    constructor() {
        this.router = Router();
    }

    // Automatically bind all controller methods to the instance
    protected autoBindControllerMethods(controller: any): void {
        Object.getOwnPropertyNames(Object.getPrototypeOf(controller)).forEach(methodName => {
            const method = controller[methodName];
            if (typeof method === 'function') {
                controller[methodName] = method.bind(controller);
            }
        });
    }

    public getRouter(): Router {
        return this.router;
    }
}
