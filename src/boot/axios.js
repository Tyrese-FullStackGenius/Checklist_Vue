import axios from 'axios';
import Vue from 'vue';

//Vue.prototype.$axios = axios;
const axiosInstance = axios.create({
  baseURL: 'https://api.example.com'
});

export default ({ Vue }) => {
  Vue.prototype.$axios = axiosInstance;
};

export { axiosInstance };
