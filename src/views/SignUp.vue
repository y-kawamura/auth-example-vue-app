<template>
  <div class="p-4">
    <div v-if="error" class="alert alert-dismissible alert-danger">
      <strong>内部エラーが発生しています</strong>
      <span> : {{ error }}</span>
    </div>
    <h1>Sign Up</h1>
    <div v-if="isLoading">
      <img src="@/assets/pacman_loading.svg">
    </div>
    <form v-if="!isLoading" class="mt-4" @submit.prevent="signup">
      <div class="form-group">
        <label for="username">User Name</label>
        <input
          v-model="user.username"
          type="text"
          name="username"
          id="username"
          class="form-control"
          :class="{
            'is-valid': isValidated.username ? !isError(errors.username) : false,
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
            'is-valid': isValidated.password ? !isError(errors.password) : false,
            'is-invalid': isValidated.password ? isError(errors.password) : false
          }"
        />
        <div class="invalid-feedback">
          {{ errors.password }}
        </div>
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
          v-model="user.confirmPassword"
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          class="form-control"
          :class="{
            'is-valid': (isValidated.confirmPassword && !isError(errors.password))
              ? !isError(errors.confirmPassword)
              : false,
            'is-invalid': (isValidated.confirmPassword && !isError(errors.password))
              ? isError(errors.confirmPassword)
              : false,
          }"
        />
        <div class="invalid-feedback">
          {{ errors.confirmPassword }}
        </div>
      </div>
      <button type="submit" class="btn btn-primary">Sign Up</button>
    </form>
  </div>
</template>

<script>
// import PacmanLoading from '@/assets/pacman_loading.svg';
import validate from '@/validate';

const USERNAME_LIMIT_MIN = 2;
const USERNAME_LIMIT_MAX = 30;

const PASSWORD_LIMIT_MIN = 3;
const PASSWORD_LIMIT_MAX = 30;
const PASSWORD_VALID_PATTERN = /^[a-zA-Z0-9_-]+$/;

export default {
  name: 'SignUp',
  data() {
    return {
      error: '',
      isLoading: false,
      isValidated: {
        username: false,
        password: false,
        confirmPassword: false,
      },
      errors: {
        username: '',
        password: '',
        confirmPassword: '',
      },
      user: {
        username: '',
        password: '',
        confirmPassword: '',
      },
    };
  },
  computed: {
    isError() {
      return (error) => error.length !== 0;
    },
    isValid() {
      return (!this.errors.username
        && !this.errors.password
        && !this.errors.confirmPassword);
    },

  },
  methods: {
    validateUsername() {
      this.isValidated.username = true;
      if (!validate.emptyRule(this.user.username)) {
        this.errors.username = 'ユーザ名が入力されていません';
      } else if (!validate.limitRule(this.user.username, USERNAME_LIMIT_MIN, USERNAME_LIMIT_MAX)) {
        this.errors.username = 'ユーザ名は２〜３０文字で入力してください';
      } else {
        this.errors.username = '';
      }
    },
    validatePassword() {
      this.isValidated.password = true;
      if (!validate.emptyRule(this.user.password)) {
        this.errors.password = 'パスワードが入力されていません';
      } else if (!validate.limitRule(this.user.password, PASSWORD_LIMIT_MIN, PASSWORD_LIMIT_MAX)) {
        this.errors.password = 'パスワードは２〜３０文字で入力してください';
      } else if (!validate.matchRule(this.user.password, PASSWORD_VALID_PATTERN)) {
        this.errors.password = 'パスワードはアルファベット小文字、大文字、数字、アンダーバー、ハイフンのみで入力してください';
      } else {
        this.errors.password = '';
      }
    },
    validateConfirmPassword() {
      this.isValidated.confirmPassword = true;
      this.errors.confirmPassword = this.user.password === this.user.confirmPassword
        ? ''
        : 'パスワードが一致していません';
    },
    async signup() {
      // validate
      this.validateUsername();
      this.validatePassword();
      this.validateConfirmPassword();

      if (this.isValid) {
        this.isLoading = true;
        // submit data
        const newUser = {
          username: this.user.username,
          password: this.user.password,
        };
        try {
          const result = await fetch('http://localhost:1337/auth/signup', {
            method: 'POST',
            body: JSON.stringify(newUser),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (result.ok) {
            setTimeout(() => {
              this.isLoading = false;
              this.$router.push('/login');
            }, 500);
          } else {
            const error = await result.json();
            if (error.message.includes('username')) {
              // user name is duplicated
              setTimeout(() => {
                this.isLoading = false;
                this.errors.username = 'このユーザ名はすでに使用されています';
              }, 300);
            } else {
              this.isLoading = false;
              this.error = error.message;
            }
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
    // eslint-disable-next-line func-names
    'user.confirmPassword': function () {
      this.validateConfirmPassword();
    },
  },
};
</script>
