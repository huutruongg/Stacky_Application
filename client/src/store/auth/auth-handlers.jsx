import { toast } from "react-toastify";
import { call, put } from "redux-saga/effects";
import { logOut, saveToken } from "@/utils/auth";
import {
  requestAuthFetchMe,
  requestAuthLoginRecruiter,
  requestAuthRefreshToken,
  requestAuthRegisterRecruiter,
  // requestAuthUpdatePassword,
} from "./auth-requests";
import { authUpdateUser } from "./auth-slice";

export default function* handleAuthRegister(action) {
  const { payload } = action;
  try {
    const response = yield call(requestAuthRegisterRecruiter, payload);
    if (response.status === 201) {
      toast.success("Tạo tài khoản thành công");
    }
  } catch (error) {
    toast.error("Tạo tài khoản thất bại");
  }
}
function* handleAuthLogin({ payload }) {
  try {
    console.log(response.data.data);
    const response = yield call(requestAuthLoginRecruiter, payload);
    if (response.data.accessToken && response.data.refreshToken) {
      saveToken(response.data.accessToken, response.data.refreshToken);
      yield call(handleAuthFetchMe, { payload: response.data.accessToken });
    }
  } catch (error) {
    const response = error.response.data;
    if (response.statusCode === 401 || response.statusCode === 403) {
      toast.error(response.error.message);
      return;
    } else {
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
    }
  }
}

function* handleAuthFetchMe({ payload }) {
  try {
    const response = yield call(requestAuthFetchMe, payload);
    if (response.status === 200) {
      yield put(
        authUpdateUser({
          user: response.data,
          accessToken: payload,
        })
      );
    }
    // response.data -> userInfo
  } catch (error) {}
}

function* handleAuthRefreshToken({ payload }) {
  try {
    const response = yield call(requestAuthRefreshToken, payload);
    // console.log(response);
    if (response.data) {
      saveToken(response.data.accessToken, response.data.refreshToken);
      yield call(handleAuthFetchMe, {
        payload: response.data.accessToken,
      });
    } else {
      yield handleAuthLogOut();
    }
  } catch (error) {}
}

function* handleAuthLogOut() {
  yield put(
    authUpdateUser({
      user: undefined,
      accessToken: null,
    })
  );
  logOut();
}

// function* handleAuthUpdatePassword({ payload }) {
//   try {
//     const { currentPassword, newPassword, token } = payload;
//     yield call(
//       requestAuthUpdatePassword,
//       { currentPassword, newPassword },
//       token
//     );
//     toast.success("Mật khẩu đã được cập nhật thành công");
//   } catch (error) {
//     toast.error("Đã có lỗi xảy ra khi cập nhật mật khẩu");
//   }
// }

export {
  handleAuthLogin,
  handleAuthFetchMe,
  handleAuthRefreshToken,
  handleAuthLogOut,
  // handleAuthUpdatePassword,
};
