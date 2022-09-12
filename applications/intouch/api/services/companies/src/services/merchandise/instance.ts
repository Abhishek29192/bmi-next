import axios from "axios";
import { encrypt, decrypt } from "./crypto";

const { MERCHANDISE_CLIENT_SECRET, MERCHANDISE_API } = process.env;

export const setInstance = (merchandisingUrl) => {
  const instance = axios.create({
    baseURL: `${merchandisingUrl}${MERCHANDISE_API}`,
    timeout: 50000,
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${MERCHANDISE_CLIENT_SECRET}`,
      "Content-Type": "application/json"
    }
  });

  instance.interceptors.request.use(
    function (request) {
      const encryptedData = encrypt(JSON.stringify(request.data.data));
      request.data.data = encryptedData;
      return request;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    function (response) {
      const data = JSON.parse(decrypt(response.data));
      const res = Object.assign({}, response, { data });
      return res;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  return instance;
};
