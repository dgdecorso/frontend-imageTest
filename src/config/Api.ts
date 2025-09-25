import axios, { AxiosInstance } from "axios";

const isDev = (): boolean =>
  !process.env.NODE_ENV || process.env.NODE_ENV === "development";

const createAPI = (): AxiosInstance => {
  return axios.create({ baseURL: process.env.REACT_APP_BASEURL });
};

const api: AxiosInstance = createAPI();

api.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem("token");
    if (token) {
      request.headers.Authorization = token;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.request.use((request) => {
  if (isDev() && request.method) {
    const info = `REQUEST ${request.method.toLocaleUpperCase()} ${request.url}`;
    if (request.method.toLocaleLowerCase() === "get") {
      console.debug(info);
    } else {
      console.debug(info, request.data);
    }
  }
  return request;
}, Promise.reject);

api.interceptors.response.use(
  (response) => {
    if (isDev() && response.config && response.config.method) {
      console.debug(
        `RESPONSE ${response.config.method.toLocaleUpperCase()} ${
          response.config.url
        }`,
        response.data
      );
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export default api;
