import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "auth",
  initialState: {
    pcs: {
      pc: null,
      isFetching: false,
      error: false,
    },
    components: {
      component: null,
      isFetching: false,
      error: false,
    },
    categories: {
      category: null,
      isFetching: false,
      error: false,
    },
    users: {
      user: null,
      isFetching: false,
      error: false,
    },
    brands: {
      brand: null,
      isFetching: false,
      error: false,
    },
    orders: {
      order: null,
      isFetching: false,
      error: false,
    },
  },

  reducers: {
    getAllPcStart: (state) => {
      state.pcs.isFetching = true;
    },
    getAllPcSuccess: (state, action) => {
      state.pcs.isFetching = false;
      state.pcs.pc = action.payload;
      state.pcs.error = false;
    },
    getAllPcFailed: (state) => {
      state.pcs.isFetching = false;
      state.pcs.error = true;
    },
    getAllComponentsStart: (state) => {
      state.components.isFetching = true;
    },
    getAllComponentsSuccess: (state, action) => {
      state.components.isFetching = false;
      state.components.component = action.payload;
      state.components.error = false;
    },
    getAllComponentsFailed: (state) => {
      state.components.isFetching = false;
      state.components.error = true;
    },
    getAllCategoryStart: (state) => {
      state.categories.isFetching = true;
    },
    getAllCategorySuccess: (state, action) => {
      state.categories.isFetching = false;
      state.categories.catergory = action.payload;
      state.categories.error = false;
    },
    getAllCategoryFailed: (state) => {
      state.categories.isFetching = false;
      state.categories.error = true;
    },
    getAllUsersStart: (state) => {
      state.users.isFetching = true;
    },
    getAllUsersSuccess: (state, action) => {
      state.users.isFetching = false;
      state.users.user = action.payload;
      state.users.error = false;
    },
    getAllUsersFailed: (state) => {
      state.users.isFetching = false;
      state.users.error = true;
    },
    getAllBrandStart: (state) => {
      state.brands.isFetching = true;
    },
    getAllBrandSuccess: (state, action) => {
      state.brands.isFetching = false;
      state.brands.brand = action.payload;
      state.brands.error = false;
    },
    getAllBrandFailed: (state) => {
      state.brands.isFetching = false;
      state.brands.error = true;
    },
    getAllOrderStart: (state) => {
      state.orders.isFetching = true;
    },
    getAllOrderSuccess: (state, action) => {
      state.orders.isFetching = false;
      state.orders.order = action.payload;
      state.orders.error = false;
    },
    getAllOrderFailed: (state) => {
      state.orders.isFetching = false;
      state.orders.error = true;
    },
  },
});

export const {
  getAllPcStart,
  getAllPcSuccess,
  getAllPcFailed,
  getAllComponentsStart,
  getAllComponentsSuccess,
  getAllComponentsFailed,
  getAllCategoryStart,
  getAllCategorySuccess,
  getAllCategoryFailed,
  getAllUsersStart,
  getAllUsersSuccess,
  getAllUsersFailed,
  getAllBrandStart,
  getAllBrandSuccess,
  getAllBrandFailed,
  getAllOrderStart,
  getAllOrderSuccess,
  getAllOrderFailed,
} = adminSlice.actions;
export default adminSlice.reducer;
