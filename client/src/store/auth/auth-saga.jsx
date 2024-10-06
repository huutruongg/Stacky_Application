import { takeLatest } from "redux-saga/effects";
import handleAuthRegister, {
  handleAuthLogin,
  handleAuthLogOut,
  handleAuthRefreshToken,
  // handleAuthUpdatePassword,
} from "./auth-handlers";
import {
  authLogin,
  authLogOut,
  authRefreshToken,
  authRegister,
  // authUpdatePassword,
} from "./auth-slice";
export default function* authSaga() {
  yield takeLatest(authRegister.type, handleAuthRegister);
  yield takeLatest(authLogin.type, handleAuthLogin);
  yield takeLatest(authRefreshToken.type, handleAuthRefreshToken);
  yield takeLatest(authLogOut.type, handleAuthLogOut);
  // yield takeLatest(authUpdatePassword.type, handleAuthUpdatePassword);
}
