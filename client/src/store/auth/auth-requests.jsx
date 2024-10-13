import axios from "@/api/axios";

export const requestAuthRegisterRecruiter = (data) => {
  return axios.post("/auth/signup/recruiter", {
    ...data,
  });
};

export const requestAuthLoginRecruiter = (data) => {
  return axios.post("/auth/login/recruiter", {
    ...data,
  });
};

export const requestAuthFetchMe = (token) => {
  if (!token) return;
  return axios.get("/me", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const requestAuthRefreshToken = (token) => {
  if (!token) return;
  return axios.post("/token", {
    "Content-Type": "Application/json",
    refreshToken: token,
  });
};

// export const requestAuthUpdatePassword = (data, token) => {
//   return axios.put("/user/update-password", data, {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// };
