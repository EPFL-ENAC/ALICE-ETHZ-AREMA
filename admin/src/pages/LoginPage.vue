<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center bg-blue">
        <div
          class="column"
          :style="
            $q.screen.lt.sm
              ? { width: '80%' }
              : $q.screen.lt.md
              ? { width: '50%' }
              : { width: '30%' }
          "
        >
          <div>
            <div class="colcol text-center text-white q-mb-lg">
              <div class="text-h6">
                {{ $t('main.brand') }}
              </div>
              <div v-if="$t('main.brand_caption')" class="text-subtitle1">
                {{ $t('main.brand_caption') }}
              </div>
            </div>
          </div>
          <div class="col">
            <q-card class="q-pa-md">
              <q-card-section>
                <q-form class="q-gutter-md">
                  <q-input
                    v-model="state.email"
                    :label="$t('login.email')"
                    lazy-rules
                  >
                    <template v-slot:prepend>
                      <q-icon name="fas fa-envelope" size="xs" />
                    </template>
                  </q-input>

                  <q-input
                    type="password"
                    v-model="state.password"
                    :label="$t('login.password')"
                    lazy-rules
                  >
                    <template v-slot:prepend>
                      <q-icon name="fas fa-lock" size="xs" />
                    </template>
                  </q-input>

                  <div>
                    <q-btn
                      :label="$t('login.submit')"
                      type="submit"
                      color="primary"
                      @click.prevent="submit"
                    />
                    <q-btn
                      :label="$t('login.register')"
                      flat
                      @click.prevent="register(state)"
                      class="q-ml-sm"
                    />
                    <q-btn-dropdown
                      flat
                      :label="$t('locales.' + locale)"
                      class="q-ml-sm"
                    >
                      <q-list>
                        <q-item
                          clickable
                          v-close-popup
                          @click="onLocaleSelection(localeOpt)"
                          v-for="localeOpt in localeOptions"
                          :key="localeOpt.value"
                        >
                          <q-item-section>
                            <q-item-label>{{ localeOpt.label }}</q-item-label>
                          </q-item-section>
                          <q-item-section
                            avatar
                            v-if="locale === localeOpt.value"
                          >
                            <q-icon color="primary" name="check" />
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-btn-dropdown>
                  </div>
                </q-form>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { computed, reactive } from 'vue';
import { locales } from '../boot/i18n';

const $q = useQuasar();
const { t, locale } = useI18n({ useScope: 'global' });

const { api } = useFeathers();
const userService = api.service('users');
const router = useRouter();
const authStore = useAuthStore();
const state = reactive({
  email: '',
  password: '',
});

onMounted(() => {
  authStore.reAuthenticate().then(() => {
    if (authStore.isAuthenticated) redirect();
  });
});

const localeOptions = computed(() =>
  locales.map((loc) => {
    return {
      value: loc,
      label: t('locales.' + loc),
    };
  })
);

function onLocaleSelection(opt: { value: string; label: string }) {
  locale.value = opt.value;
}

// login then redirect
const submit = async () => {
  authStore.clearError();
  authStore
    .authenticate({ strategy: 'local', ...state })
    .then(() => {
      redirect();
    })
    .catch((err) => {
      $q.notify({
        message: err.message,
        type: 'negative',
      });
    });
};

const redirect = async () => {
  const redirectTo = (await authStore).loginRedirect || '/';
  authStore.loginRedirect = null;
  router.push(redirectTo);
};

async function register() {
  userService
    .create(state)
    .then(() => {
      $q.notify({
        message: t('login.registerSuccess'),
        type: 'positive',
      });
      authStore.authenticate({ strategy: 'local', ...state }).then(() => {
        redirect();
      });
    })
    .catch((err) => {
      $q.notify({
        message: `${t('login.registerError')}: ${err.message}`,
        type: 'negative',
      });
    });
}
</script>
