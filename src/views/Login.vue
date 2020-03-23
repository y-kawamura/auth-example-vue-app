<template>
  <div class="p-4">
    <div v-if="error" class="alert alert-dismissible alert-danger">
      <strong>{{ error }}</strong>
    </div>
    <h1>Login</h1>
    <div v-if="isLoading">
      <img src="@/assets/pacman_loading.svg">
    </div>
    <form v-if="!isLoading" class="mt-4" @submit.prevent="login">
      <div class="form-group">
        <label for="username">User Name</label>
        <input
          v-model="user.username"
          type="text"
          name="username"
          id="username"
          class="form-control"
          :class="{
            'is-invalid': isValidated.username ? isError(errors.username) : false
          }"
        />
        <div class="invalid-feedback">
          {{ errors.username }}
        </div>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          v-model="user.password"
          type="password"
          name="password"
          id="password"
          class="form-control"
          :class="{
            'is-invalid': isValidated.password ? isError(errors.password) : false
          }"
        />
        <div class="invalid-feedback">
          {{ errors.password }}
        </div>
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </div>
</template>

<script>
// import PacmanLoading from '@/assets/pacman_loading.svg';
import validate from '@/validate';

export default {
  name: 'Login',
  data() {
    return {
      error: '',
      isLoading: false,
      isValidated: {
        username: false,
        password: false,
      },
      errors: {
        username: '',
        password: '',
      },
      user: {
        username: '',
        password: '',
      },
    };
  },
  computed: {
    isError() {
      return (error) => error.length !== 0;
    },
    isValid() {
      return (!this.errors.username
        && !this.errors.password);
    },

  },
  methods: {
    validateUsername() {
      this.isValidated.username = true;
      if (!validate.emptyRule(this.user.username)) {
        this.errors.username = 'ユーザ名が入力されていません';
      } else {
        this.errors.username = '';
      }
    },
    validatePassword() {
      this.isValidated.password = true;
      if (!validate.emptyRule(this.user.password)) {
        this.errors.password = 'パスワードが入力されていません';
      } else {
        this.errors.password = '';
      }
    },
    async login() {
      // validate
      this.validateUsername();
      this.validatePassword();

      if (this.isValid) {
        this.error = '';
        this.isLoading = true;
        // submit data
        try {
          const result = await fetch('https://penta-auth-sample.herokuapp.com/auth/login', {
            method: 'POST',
            body: JSON.stringify(this.user),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (result.ok) {
            const { token } = await result.json();
            localStorage.token = token;
            setTimeout(() => {
              this.isLoading = false;
              this.$router.push('/dashboard');
            }, 500);
          } else {
            setTimeout(() => {
              this.isLoading = false;
              this.error = 'ユーザ名、もしくは、パスワードが無効です';
            }, 300);
          }
        } catch (error) {
          this.isLoading = false;
          this.error = error.message;
        }
      }
    },
  },
  watch: {
    // eslint-disable-next-line func-names
    'user.username': function () {
      this.validateUsername();
    },
    // eslint-disable-next-line func-names
    'user.password': function () {
      this.validatePassword();
      if (this.user.confirmPassword) {
        this.validateConfirmPassword();
      }
    },
  },
};
</script>
