import axiosClient from "./axiosClient";

const END_POINT = {
  USER: "User",
};

export const getUserAPI = () => {
  return axiosClient.get(`${END_POINT.USER}`);
};

export const createUserAPI = () => {
  return axiosClient.post(`${END_POINT.USER}`);
};
export const deleteUserAPI = (id) => {
  return axiosClient.delete(`${END_POINT.USER}/${id}`);
};

export const editUserAPI = (id) => {
  return axiosClient.put(`${END_POINT.USER}/${id}`);
};
