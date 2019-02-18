<template>
  <header>
    <div class="container header_cont">
      <div class="logo">
        Aw-App
      </div>
      <nav>
        <ul>
          <li>
            <router-link to="/">Home</router-link>
          </li>
          <template v-if="!isAuth">
            <li>
              <router-link to="/signin">Sign in</router-link>
            </li>
            <li>
              <router-link to="/signup">Sign up</router-link>
            </li>
          </template>
          <template v-else>
            <li>
              <router-link to="/dashboard">Dashboard</router-link>
            </li>
            <li>
              <div
                @click="signout"
                :style="{display: 'inline'}"
              >Sign Out</div>
            </li>
          </template>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  computed: {
    isAuth() {
      return this.$store.getters.isAuth;
    }
  },
  methods: {
    signout() {
      // при signout нам не нужно обращаться на сервер(тоесть сдесь нет никакой асинхронности), поэтому экшен излишен, нам нужно просто очистить state и localStorage, для этого можно обойтись просто мутацией
      this.$store.commit("logout");
    }
  }
};
</script>
