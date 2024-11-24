import { UserRoles } from "../utils/roles";

export interface IUserDataType {
    userId: string;
    role: UserRoles;
}