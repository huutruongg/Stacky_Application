
import 'express-session';
declare module 'express-session' {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
  }
}
