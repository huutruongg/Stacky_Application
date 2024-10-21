import CustomSession from "./src/types/session";

// declare global {
//     namespace Express {
//         interface Request {
//             customSession: CustomSession
//         }
//     }
// }

declare global {
    namespace Express {
        interface Request {
            userData?: IUserDataType;
        }
    }
}
