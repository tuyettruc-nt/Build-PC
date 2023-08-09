import axiosClient from "axios";

const instance = axiosClient.create({
  baseURL: process.env.REACT_APP_URL_API,
});

instance.interceptors.request.use(async (config) => {
  return config;
});

instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.log(error);
  }
);

export default instance;
