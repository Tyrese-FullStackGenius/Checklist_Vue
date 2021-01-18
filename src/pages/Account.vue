<template>
  <div align="center">
    <div v-if="loggedIn()" class="q-ma-md" style="max-width: 500px">
      <span style="font-size: 16px">You logged in.</span>
      <q-btn label="Logout" color="primary" @click="logout()" />
    </div>
    <div v-else-if="signUp" class="q-pa-md" style="max-width: 500px">
      <q-form
        @submit="createAccount"
        @reset="onReset"
        class="q-gutter-md"
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
      >
        <q-input
          clearable
          filled
          v-model="account.name"
          label="Full Name"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please enter a name']"
        />

        <q-input
          ref="username"
          clearable
          filled
          v-model="account.username"
          label="Username"
          debounce="200"
          :rules="[usernameRule]"
        />

        <q-input
          clearable
          filled
          v-model="account.password"
          label="Password"
          type="password"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please enter a password']"
        />

        <q-input
          clearable
          filled
          v-model="verifyPass"
          label="Repeat Password"
          type="password"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Please enter a password',
            (val) => (val && val == account.password) || 'Passwords do not match',
          ]"
        />

        <div>
          <q-btn label="Create Account" type="submit" color="primary" />
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>

        <div style="max-width: 500px">
          <span style="font-size: 16px">Already have an account?</span>&nbsp;
          <a href="#" v-on:click="switchLogin()" style="font-size: 16px; color: #1976d2"
            >Login</a
          >
        </div>
      </q-form>
    </div>

    <div v-else class="q-pa-md" style="max-width: 500px">
      <q-form
        @submit="login"
        @reset="onReset"
        class="q-gutter-md"
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
      >
        <q-input
          clearable
          filled
          v-model="account.username"
          label="Username"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please enter your username']"
        />

        <q-input
          clearable
          filled
          v-model="account.password"
          label="Password"
          type="password"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please enter your password']"
        />
        <div>
          <q-btn label="Login" type="submit" color="primary" />
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
        <div style="max-width: 500px">
          <div v-if="wrongCreds">
            <q-icon name="warning" class="text-negative" style="font-size: 3rem" />&nbsp;
            <span style="font-size: 16px; color: #c10015">{{ wrongCreds }}</span>
          </div>
          <span style="font-size: 16px">Don't have an account?</span>&nbsp;
          <a href="#" v-on:click="switchSignup()" style="font-size: 16px; color: #1976d2"
            >Sign Up</a
          >
        </div>
      </q-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      verifyPass: "",
      signUp: false,
      account: {},
      wrongCreds: "",
    };
  },
  methods: {
    logout() {
      sessionStorage.removeItem("token");
      this.updateAxiosHeader();
      console.log("logged out");
      this.$router.push({ name: "home" });
    },

    loggedIn() {
      return sessionStorage.getItem("token") != null;
    },

    switchSignup() {
      console.log("switched to signup");
      this.signUp = true;
    },
    switchLogin() {
      console.log("switched to login");
      this.signUp = false;
      this.wrongCreds = "";
    },
    login() {
      console.log("logging in...");
      let uri = "/accounts/login";
      this.$axios
        .post(uri, this.account)
        .then((res) => {
          console.log("inside promise");
          if (!res.data.token) {
            this.wrongCreds = res.data.message;
            console.log(this.wrongCreds);
          } else {
            sessionStorage.setItem("token", res.data.token);
            this.updateAxiosHeader();
            console.log("Stored: " + res.data.token);
            this.$router.push({ name: "home" }); // change later, push to home page of account
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    usernameRule(val) {
      return new Promise((resolve) => {
        let uri = "/accounts/checkUniqueUsername";
        this.$axios.post(uri, { username: val }).then((res) => {
          console.log("call back on unique check: " + res.data.result);
          if (res.data.result) {
            resolve((val && val.length > 0) || "Please enter a username");
          } else {
            resolve(false || "This username is already taken");
          }
        });
      });
    },
    createAccount() {
      let uri = "/accounts";
      this.$axios.post(uri, this.account).then(() => {
        this.switchLogin();
      });
    },
    onReset() {
      this.account = {};
      this.wrongCreds = "";
    },
    updateAxiosHeader() {
      let token = sessionStorage.getItem("token");
      this.$axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      console.log("updated header");
    },
  },
};
</script>
