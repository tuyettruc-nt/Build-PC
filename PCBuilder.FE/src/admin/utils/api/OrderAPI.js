import axiosClient from "./axiosClient";

const END_POINT = {
  ORDER: "Order",
};

export const getOrderAPI = () => {
  return axiosClient.get(`${END_POINT.ORDER}`);
};

export const createOrderAPI = () => {
  return axiosClient.post(`${END_POINT.ORDER}`);
};
export const deleteOrderAPI = (id) => {
  return axiosClient.delete(`${END_POINT.ORDER}/${id}`);
};

export const editOrderAPI = (id) => {
  return axiosClient.put(`${END_POINT.ORDER}/${id}`);
};
