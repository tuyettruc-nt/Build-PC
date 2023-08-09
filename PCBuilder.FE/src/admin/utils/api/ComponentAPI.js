import axiosClient from "./axiosClient";

const END_POINT = {
  COMPONENT: "Component",
};

export const getComponentAPI = () => {
  return axiosClient.get(`${END_POINT.COMPONENT}`);
};

export const createComponentAPI = () => {
  return axiosClient.post(`${END_POINT.COMPONENT}`);
};
export const deleteComponentAPI = (id) => {
  return axiosClient.delete(`${END_POINT.COMPONENT}/${id}`);
};

export const editComponentAPI = (id) => {
  return axiosClient.put(`${END_POINT.COMPONENT}/${id}`);
};
