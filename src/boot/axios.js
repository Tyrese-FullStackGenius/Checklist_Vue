import axios from 'axios';
import Vue from 'vue';

//Vue.prototype.$axios = axios;
const axiosInstance = axios.create({
  baseURL: "http://localhost:4000"
});

export default ({ Vue }) => {
  Vue.prototype.$axios = axiosInstance;
  let token = sessionStorage.getItem("token");
  Vue.prototype.$axios.defaults.headers.common.authorization = "Bearer " + token;
};

export { axiosInstance };
