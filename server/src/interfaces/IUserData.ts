import { UserRole } from "../enums/EUserRole";
import { IUser } from "./IUser";

export interface IUserDataType {
    userId: string;
    role: UserRole;
}