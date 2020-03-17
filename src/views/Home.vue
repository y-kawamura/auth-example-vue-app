<template>
  <div class="jumbotron mt-5 text-center bg-white">
    <h1 class="display-4">Auth Sample</h1>
    <p class="lead">
      This is a authentication sample application.
    </p>
    <router-link
      tag="button"
      to="/login"
      class="btn btn-outline-secondary btn-lg"
    >
      Login
    </router-link>
    <router-link
      tag="button"
      to="/signup"
      class="btn btn-secondary btn-lg ml-2"
    >
      Sign Up
    </router-link>
  </div>
</template>

<script>

export default {
  name: 'Home',
};
</script>
