import axios from "axios";
import { loginSuccess, logoutSuccess } from "./authSlice";
import {
  updateStart,
  updateSuccess,
  updateFailed,
  getDataSuccess,
  getAllListPcStart,
  getAllListPcSuccess,
  getAllListPcFailed,
} from "./userSlice";

import jwt from "jwt-decode"; // import dependency
import { toast } from "react-toastify";

export const loginUser = async (user, dispatch, navigate) => {
  axios
    .post(`https://fpc-shop.azurewebsites.net/api/Authenticate/login`, user)
    .then(function (response) {
      localStorage.setItem("idUser", response.data.token.userDTO.id);
      localStorage.setItem("tokenUser", response.data.token.token);
      localStorage.setItem("refreshToken", response.data.token.refreshToken);
      localStorage.setItem("expiresIn", response.data.token.expiresIn);
      localStorage.setItem(
        "currentUser",
        JSON.stringify(response.data.token.userDTO)
      );
      const decodedUser = jwt(response.data.token.token); // Decode the token

      dispatch(loginSuccess(decodedUser));
      toast.success(response.data.message);

      if (decodedUser.role === "Admin") {
        navigate("/pc");
      } else if (decodedUser.role === "Customer") {
        navigate("/");
      }
    })
    .catch(function (error) {
      toast.error(error.response.data.message);
    });
};
export const loginGoogle = async (idToken, dispatch, navigate) => {
  await axios
    .post("https://fpc-shop.azurewebsites.net/api/Authenticate/google-login", {
      idToken,
    })
    .then(function (response) {
      dispatch(loginSuccess(response.data.token.token));
      localStorage.setItem(
        "currentUser",
        JSON.stringify(response.data.token.userDTO)
      );
      localStorage.setItem("idUser", response.data.token.userDTO.id);
      localStorage.setItem("tokenUser", response.data.token.token);
      localStorage.setItem("refreshToken", response.data.token.refreshToken);
      localStorage.setItem("expiresIn", response.data.token.expiresIn);
      toast.success("Login Successfully ~");
      navigate("/");
    })
    .catch(function (error) {
      toast.error("Login Error!");
      console.log(error);
    });
};
export const logoutUser = async (dispatch, navigate) => {
  try {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("tokenUser");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("expriresIn");
    localStorage.removeItem("idUser");

    dispatch(logoutSuccess());
    navigate("/home");

    toast.success("Logged out successfully.");
  } catch (error) {
    console.error("Logout failed due to unexpected error:", error);
    toast.error("Logout failed. Please try again.");
  }
};

export const getAllListPc = async (dispatch) => {
  dispatch(getAllListPcStart());
  const token = localStorage.getItem("tokenUser");
  axios
    .get(`https://fpc-shop.azurewebsites.net/api/PC/GetListByCustomer`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(function (response) {
      dispatch(getAllListPcSuccess(response.data));
      console.log(response.data);
    })
    .catch(function (error) {
      dispatch(getAllListPcFailed());
    });
};

export const updateProfileUsers = async (id, dispatch, updateInfo) => {
  dispatch(updateStart());
  dispatch(loginSuccess(updateInfo));
  axios
    .put(`https://fpc-shop.azurewebsites.net/api/User/${id}`, updateInfo)
    .then(function (response) {
      dispatch(updateSuccess(response.data));
      toast.success(response.data.message);
    })
    .catch(function (error) {
      dispatch(updateFailed());
      toast.error(error.response.data.message);
    });
};
