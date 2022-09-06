import axios from 'axios';
import {getToken} from '../pages/login/Login';

const instance = axios.create();

instance.interceptors.request.use(
    async (config) => {
    const token = await getToken().then(res => res);
    config.headers.authorization = `Bearer ${token}`;
    console.log('req...............');
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  function (response) {
    console.log('res...............');
    return response;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export default instance;
