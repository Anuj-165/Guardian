import axios, { InternalAxiosRequestConfig } from 'axios';


const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});


API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');

    // Check if token exists and config.headers is defined
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;