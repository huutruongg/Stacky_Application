import { UserRole } from "../enums/EUserRole";

export interface IUserDataType {
    userId: string;
    role: UserRole;
}