<template>
  <div class="login">
    <div class="login__form-container">
      <div class="login__form-header">
        Login
      </div>
      <v-form
        ref="form"
        class="login__form"
        @submit.prevent="submit"
      >
        <v-text-field
          v-model="password"
          outlined
          hide-details
          color="#d2b384"
          type="password"
          class="login__form-input-password"
          maxlength="50"
          :rules="rules"
          :loading="isLoading"
          :disabled="isLoading"
          :error="hasPasswordFailedToAuthenticate"
          @input="onPasswordChange"
        />
        <transition name="slide-x-reverse-transition">
          <v-btn
            v-if="password"
            icon
            class="login__form-submit-btn"
            color="#d2b384"
            :disabled="isSubmitDisabled"
            @click="submit"
          >
            <v-icon>mdi-account-arrow-right</v-icon>
          </v-btn>
        </transition>
      </v-form>
      <transition name="slide-x-reverse-transition">
        <div
          v-if="errorMessage && hasPasswordFailedToAuthenticate"
          class="login__error-message"
        >
          {{ errorMessage }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'LoginPage',

  data: () => ({
    hasPasswordFailedToAuthenticate: false,
    errorMessage: '',
    password: '',
    rules: [
      (v) => !!v || 'Required',
    ],
  }),

  computed: {
    ...mapState([
      'pageState',
    ]),

    isLoading() {
      return this.pageState.state === 'loading';
    },

    isSubmitDisabled() {
      return (
        !this.password
        || this.hasPasswordFailedToAuthenticate
        || this.isLoading
      );
    },
  },

  methods: {
    ...mapMutations([
      'SET_PAGE_STATE',
    ]),

    async submit() {
      if (!this.$refs.form.validate() || this.hasPasswordFailedToAuthenticate) return;

      const { password, SET_PAGE_STATE } = this;

      try {
        SET_PAGE_STATE('loading');

        const { data } = await this.$axios.post('/api/login', { password, username: '_' });

        SET_PAGE_STATE('');

        if (data.success) {
          this.$router.push('/books');
        } else {
          // This shouldn't ever occur as the server should throw a 401
          // along with { succes: false, message: ... }, which will be
          // already caught in the catch block
          throw new Error('Authentication failed - possibly a server error');
        }
      } catch (err) {
        SET_PAGE_STATE('');

        this.errorMessage = err.response?.data?.message || err.toString();
        this.hasPasswordFailedToAuthenticate = true;
      }
    },

    onPasswordChange() {
      this.hasPasswordFailedToAuthenticate = false;
    },
  },
};
</script>

<style scoped lang="scss">
  @import '~/assets/scss/pages/login/index.scss';
</style>
