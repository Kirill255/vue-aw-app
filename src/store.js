import Vue from "vue";
import Vuex from "vuex";

import router from "./routes";

Vue.use(Vuex);

// https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=[API_KEY]
// https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=[API_KEY]
// https://securetoken.googleapis.com/v1/token?key=[API_KEY]
// https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=[API_KEY]

const FbAuth = "https://www.googleapis.com/identitytoolkit/v3/relyingparty";

const FbApiKey = "AIzaSyDMsWeWK07hkBp6pwg2PlHZUjrilS7oAls";

export default new Vuex.Store({
  state: {
    email: "",
    token: "",
    refreshToken: "",
    userInfo: null
  },
  getters: {
    isAuth(state) {
      return state.token ? true : false;
    }
  },
  mutations: {
    auth(state, authData) {
      state.email = authData.email;
      state.token = authData.idToken;
      state.refreshToken = authData.refreshToken;
    },
    logout(state) {
      state.email = "";
      state.token = "";
      state.refreshToken = "";

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");

      router.push("/");
    },
    addUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    }
  },
  actions: {
    signin({ commit }, payload) {
      Vue.http
        .post(`${FbAuth}/verifyPassword?key=${FbApiKey}`, {
          ...payload,
          returnSecureToken: true
        })
        .then((response) => response.json())
        .then((authData) => {
          // console.log(authData);
          commit("auth", authData);
          localStorage.setItem("token", authData.idToken);
          localStorage.setItem("refreshToken", authData.refreshToken);
        })
        .catch((err) => console.log(err));
    },
    signup({ commit }, payload) {
      Vue.http
        .post(`${FbAuth}/signupNewUser?key=${FbApiKey}`, {
          ...payload,
          returnSecureToken: true
        })
        .then((response) => response.json())
        .then((authData) => {
          // console.log(authData);
          commit("auth", authData);
          localStorage.setItem("token", authData.idToken);
          localStorage.setItem("refreshToken", authData.refreshToken);
        })
        .catch((err) => console.log(err));
    },
    refreshToken({ commit }) {
      const refreshToken = localStorage.getItem("refreshToken");
      // по хорошему в localStorage нужно сохранять ещё expiresIn и потом проверять, если token протух, то редирект на signin, если ещё нормальный, то делать запрос
      if (refreshToken) {
        Vue.http
          .post(`https://securetoken.googleapis.com/v1/token?key=${FbApiKey}`, {
            grant_type: "refresh_token",
            refresh_token: refreshToken
          })
          .then((response) => response.json())
          .then((authData) => {
            // console.log(authData);
            // возвращает не совсем тот объект как другие запросы, поэтому мы не можем просто передать commit("auth", authData); нужные нам данные лежат по другим ключам, Тут есть одна проблема что у нас сдесь нет поля email, это мы исправим позже
            commit("auth", {
              idToken: authData.id_token,
              refreshToken: authData.refresh_token
            });
            localStorage.setItem("token", authData.id_token);
            localStorage.setItem("refreshToken", authData.refresh_token);
          })
          .catch((err) => console.log(err));
      }
    },
    getUserInfo({ commit, state }) {
      const token = state.token;
      if (token) {
        Vue.http
          .post(`${FbAuth}/getAccountInfo?key=${FbApiKey}`, {
            idToken: token
          })
          .then((response) => response.json())
          .then((userInfo) => {
            // console.log(userInfo);
            // см.доку, инфа лежит в userInfo.users[0]
            commit("addUserInfo", userInfo.users[0]);
          })
          .catch((err) => console.log(err));
      }
    }
  }
});
