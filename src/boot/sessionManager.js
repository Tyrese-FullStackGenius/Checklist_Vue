// import something here

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default ({ Vue }) => {
  console.log("session manager boot");

  Vue.prototype.updateAxiosHeader = () => {
    let token = sessionStorage.getItem("token");
    if (!token) {
      Vue.prototype.$axios.defaults.headers.common.authorization = "";
    } else {
      Vue.prototype.$axios.defaults.headers.common.authorization = "Bearer " + token;
    }
    console.log("Updated header from boot");
  };

  Vue.prototype.isLoggedIn = () => {
    return sessionStorage.getItem("token") != null;
  };

  Vue.prototype.updateAxiosHeader();
};
