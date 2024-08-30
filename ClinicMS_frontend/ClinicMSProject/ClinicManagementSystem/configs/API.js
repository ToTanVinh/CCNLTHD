import axios from "axios";

export const endpoints = {
  login: "/o/token/",
  profile: "/users/profile/",
};

export const authApi = (accessToken) =>
  axios.create({
    baseURL: "http://192.168.0.74:8000",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export default axios.create({
  baseURL: "http://192.168.0.74:8000",
});
