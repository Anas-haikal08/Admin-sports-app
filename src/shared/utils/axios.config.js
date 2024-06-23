import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000/api/',
});

axiosInstance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response && error.response.data) {
      let errorMessage = '';
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      alert(errorMessage);
    } else {
      alert('Network Error');
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
