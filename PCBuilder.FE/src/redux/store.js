import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import adminReducer from "./adminSlice";
export default configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    users: userReducer,
  },
});
