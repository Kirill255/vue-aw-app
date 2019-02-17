import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=[API_KEY]

const FbAuth = "https://www.googleapis.com/identitytoolkit/v3/relyingparty";

const FbApiKey = "AIzaSyDMsWeWK07hkBp6pwg2PlHZUjrilS7oAls";

export default new Vuex.Store({
  state: {
    email: "",
    token: "",
    refreshToken: ""
  },
  getters: {},
  mutations: {
    auth(state, authData) {
      state.email = authData.email;
      state.token = authData.idToken;
      state.refreshToken = authData.refreshToken;
    }
  },
  actions: {
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
    }
  }
});
