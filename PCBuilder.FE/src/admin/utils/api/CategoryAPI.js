import axiosClient from "./axiosClient";

const END_POINT = {
  CATEGORY: "Category",
};

export const getCategoryAPI = () => {
  return axiosClient.get(`${END_POINT.CATEGORY}`);
};

export const createCategoryAPI = () => {
  return axiosClient.post(`${END_POINT.CATEGORY}`);
};
export const deleteCategoryAPI = (id) => {
  return axiosClient.delete(`${END_POINT.CATEGORY}/${id}`);
};

export const editCategoryAPI = (id) => {
  return axiosClient.put(`${END_POINT.CATEGORY}/${id}`);
};
