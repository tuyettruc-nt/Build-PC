import jwt from "jwt-decode";
import { loginSuccess } from "../redux/authSlice";

export const checkLoggedInUser = (dispatch) => {
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    const decodedUser = jwt(currentUser);
    dispatch(loginSuccess(decodedUser));
  }
};
