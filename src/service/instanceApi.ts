import axios from "axios";

export const createApiInstance = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    withCredentials: true,
  });

  instance.defaults.headers.common["x-app-origin"] = "app-web";

  return instance;
};
