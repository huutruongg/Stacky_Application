import { IUserDataType } from "./src/interfaces/IUserData";
import CustomSession from "./src/types/session";

declare global {
    namespace Express {
        interface Request {
            userData?: IUserDataType;
        }
    }
}
