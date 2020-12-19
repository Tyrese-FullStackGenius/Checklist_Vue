<template>
  <div>
    <div v-if="loggedIn()" class="q-pa-md" style="max-width: 500px">
      <span style="font-size:16px">You logged in.</span>
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
          :rules="[ val => val && val.length > 0 || 'Please enter a name']"
        />

        <q-input
          ref="username"
          clearable
          filled
          v-model="account.username"
          label="Username"
          debounce="200"
          :rules="[ usernameRule ]"
        />

        <q-input
          clearable
          filled
          v-model="account.password"
          label="Password"
          type="password"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please enter a password']"
        />

        <q-input
          clearable
          filled
          v-model="verifyPass"
          label="Repeat Password"
          type="password"
          lazy-rules
          :rules="[ (val => val && val.length > 0 || 'Please enter a password'),
          (val => val && val == account.password || 'Passwords do not match')]"
        />

        <div>
          <q-btn label="Create Account" type="submit" color="primary" />
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>

        <div style="max-width: 500px">
          <span style="font-size:16px">Already have an account?</span>&nbsp;
          <a href="#" v-on:click="switchLogin()" style="font-size:16px; color:#1976d2">Login</a>
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
          :rules="[ val => val && val.length > 0 || 'Please enter your username']"
        />

        <q-input
          clearable
          filled
          v-model="account.password"
          label="Password"
          type="password"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please enter your password']"
        />
        <div>
          <q-btn label="Login" type="submit" color="primary" />
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
        <div style="max-width: 500px">
          <div v-if="wrongCreds">
            <q-icon name="warning" class="text-negative" style="font-size: 3rem;" />&nbsp;
            <span style="font-size:16px; color:#C10015">{{wrongCreds}}</span>
          </div>
          <span style="font-size:16px">Don't have an account?</span>&nbsp;
          <a
            href="#"
            v-on:click="switchSignup()"
            style="font-size:16px; color:#1976d2"
          >Sign Up</a>
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
      signUp: true,
      account: {},
      wrongCreds: ""
    };
  },
  methods: {
    logout() {
      sessionStorage.removeItem("token");
      console.log("logged out");
      this.$router.push({ name: "home" });
    },
    loggedIn() {
      let data = sessionStorage.getItem("token");
      return data != null;
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
      let uri = "http://localhost:4000/accounts/login";
      this.$axios
        .post(uri, this.account)
        .then(res => {
          console.log("inside promise");
          console.log(res.data.message);
          if (
            res.data.message == "Wrong passowrd or username" ||
            res.data.message == "No valid account found for provided ID"
          ) {
            console.log("Invalid username or password");
          } else {
            sessionStorage.setItem("token", res.data.token);
            console.log("Stored: " + res.data.token);
          }
          this.$router.push({ name: "home" }); // change later, push to home page of account
        })
        .catch(err => {
          if (
            err.response.data.message ==
            "No valid account found for provided ID"
          ) {
            this.wrongCreds = "Incorrect username or password";
          }
          console.log(this.wrongCreds);
        });
    },
    usernameRule(val) {
      return new Promise(resolve => {
        let uri = "http://localhost:4000/accounts/checkUniqueUsername";
        this.axios.post(uri, { username: val }).then(res => {
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
      let uri = "http://localhost:4000/accounts/";
      this.axios.post(uri, this.account).then(() => {
        this.switchLogin();
      });
    },
    onReset() {
      this.account = {};
    }
  }
};
</script>