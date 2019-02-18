import Vue from "vue";
import VueRouter from "vue-router";

import Home from "./components/Pages/home.vue";
import SignUp from "./components/User/signup.vue";
import SignIn from "./components/User/signin.vue";
import Dashboard from "./components/User/dashboard.vue";

import store from "./store";

Vue.use(VueRouter);

// вынесли защиту роутов в объект, чтобы испльзовать его везде где потребуется, не дублируя код
const preventRoutes = {
  beforeEnter: (to, from, next) => {
    store.state.token ? next() : next("/");
  }
};

const routes = [
  { path: "/", component: Home },
  { path: "/signin", component: SignIn },
  { path: "/signup", component: SignUp },
  // {
  //   path: "/dashboard",
  //   component: Dashboard,
  //   beforeEnter: (to, from, next) => {
  //     store.state.token ? next() : next("/");
  //   }
  // },
  // {
  //   path: "/example",
  //   component: Example,
  //   beforeEnter: (to, from, next) => {
  //     store.state.token ? next() : next("/");
  //   }
  // },
  { path: "/dashboard", component: Dashboard, ...preventRoutes }
  // { path: "/example", component: Example, ...preventRoutes }
];

export default new VueRouter({ mode: "history", routes });
