import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    pcs: {
      pc: null,
      isFetching: false,
      error: false,
    },
    users: {
      user: null,
      isFetching: false,
      error: false,
    },
    profiles: {
      profile: null,
      loading: false,
      error: false,
    },
  },
  reducers: {
    // getUsersStart: (state) => {
    //     state.users.isFetching = true;
    // },
    getDataSuccess: (state, action) => {
      state.profiles.profile = action.payload;
      state.profiles.loading = false;
      state.profiles.error = false;

      // Store the profile data in localStorage (or any other storage)
      localStorage.setItem("userProfile", JSON.stringify(action.payload));
    },
    // getUsersSuccess: (state, action) => {
    //     state.users.isFetching = false;
    //     state.users.user = action.payload;
    // },
    // getUsersFailed: (state) => {
    //     state.users.isFetching = false;
    //     state.users.error = true;
    // },
    updateStart: (state) => {
      state.profiles.loading = true;
    },
    updateSuccess: (state, action) => {
      state.profiles.loading = false;
      state.profiles.profile = action.payload;
    },
    updateFailed: (state) => {
      state.profiles.loading = false;
      state.profiles.error = true;
    },
    getDataSuccess: (state, action) => {
      state.profiles.profile = action.payload;
      state.profiles.loading = false;
      state.profiles.error = false;
    },
    getAllListPcStart: (state) => {
      state.pcs.isFetching = true;
    },
    getAllListPcSuccess: (state, action) => {
      state.pcs.isFetching = false;
      state.pcs.pc = action.payload;
      state.pcs.error = false;
    },
    getAllListPcFailed: (state) => {
      state.pcs.isFetching = false;
      state.pcs.error = true;
    },
  },
});

export const {
  // getUsersStart,
  // getUsersSuccess,
  // getUsersFailed,
  updateStart,
  updateSuccess,
  updateFailed,
  getDataSuccess,
  getAllListPcStart,
  getAllListPcSuccess,
  getAllListPcFailed,
} = userSlice.actions;
export default userSlice.reducer;
