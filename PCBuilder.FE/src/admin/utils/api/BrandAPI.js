import axiosClient from "./axiosClient";

const END_POINT = {
  BRAND: "Brand",
};

export const getBrandAPI = () => {
  return axiosClient.get(`${END_POINT.BRAND}`);
};

export const createBrandAPI = () => {
  return axiosClient.post(`${END_POINT.BRAND}`);
};
export const deleteBrandAPI = (id) => {
  return axiosClient.delete(`${END_POINT.BRAND}/${id}`);
};

export const editBrandAPI = (id) => {
  return axiosClient.put(`${END_POINT.BRAND}/${id}`);
};
