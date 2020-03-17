<template>
  <div id="app">
    <nav class="navbar navbar-dark bg-primary">
      <router-link class="navbar-brand" to="/">Auth Sample</router-link>
        <div class="ml-auto">
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
