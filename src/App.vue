<template>
  <div id="app">
    <nav class="navbar navbar-dark bg-primary">
      <router-link class="navbar-brand" to="/">Auth Sample</router-link>

      <!-- logged in -->
      <div v-if="user" class="ml-auto">
        <span class="text-white">{{ user.username }}</span>
        <button
          class="btn btn-outline-secondary ml-3"
          @click="logout"
        >
          logout
        </button>
      </div>

      <!-- no logged in -->
      <div v-else class="ml-auto">
        <router-link
          tag="button"
          to="/login"
          class="btn btn-outline-secondary"
        >
          Login
        </router-link>
        <router-link
          tag="button"
          to="/signup"
          class="btn btn-secondary ml-2"
        >
          Sign Up
        </router-link>
      </div>
    </nav>
    <router-view class="container" />
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/login');
    },
  },
};
</script>
