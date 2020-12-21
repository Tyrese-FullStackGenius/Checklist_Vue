import axios from 'axios';
import Vue from 'vue';

//Vue.prototype.$axios = axios;
const axiosInstance = axios.create();

export default ({ Vue }) => {
  Vue.prototype.$axios = axiosInstance;
};

export { axiosInstance };
