import axios from 'axios';
import Vue from 'vue';

//Vue.prototype.$axios = axios;
const axiosInstance = axios.create({
  baseURL: "http://localhost:4000"
});

export default ({ Vue }) => {
  console.log("Axios boot");
  Vue.prototype.$axios = axiosInstance;
};

export { axiosInstance };
