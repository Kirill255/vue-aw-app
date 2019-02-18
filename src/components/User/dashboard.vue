<template>
  <div class="container dashboard">
    <h1>Dashboard</h1>
    <div class="dash_content">
      <h3>Hello <span>USER</span> {{userEmail}} !!</h3>
      <p>Here you can use you dashboard because you are authenticated</p>
    </div>
  </div>
</template>


<script>
export default {
  computed: {
    userEmail() {
      // проверка нужна т.к. запрос мог ещё не прийти с сервера и userInfo равен null
      if (this.$store.state.userInfo) {
        return this.$store.state.userInfo.email;
      }
      return "";
    }
  },
  created() {
    this.$store.dispatch("getUserInfo");
  }
};
</script>
