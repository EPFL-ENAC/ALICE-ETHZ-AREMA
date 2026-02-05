<template>
  <q-page>
    <div class="text-h5 q-pa-md">{{ t('profile.current') }}</div>
    <q-separator />
    <div class="q-pa-md">
      <div class="text-help q-mb-lg">{{ t('profile.current_hint') }}</div>
      <div class="row q-mb-lg">
        <div class="col-12 col-md-6">
          <q-form ref="form">
            <q-input
              filled
              v-model="selected.name"
              :label="t('profile.name') + ' *'"
              lazy-rules
              :rules="[(val) => !!val || t('field_required')]"
            />
            <q-input
              filled
              v-model="selected.affiliation"
              :label="t('profile.affiliation')"
              :hint="t('profile.affiliation_hint')"
              class="q-mb-md"
            />
            <q-input
              filled
              v-model="selected.email"
              :label="t('profile.email')"
              :hint="t('profile.email_hint')"
              class="q-mb-md"
            />
            <q-input
              filled
              v-model="selected.web"
              :label="t('profile.web')"
              placeholder="https://example.com"
              class="q-mb-md"
            />
            <text-input
              v-model="selected.description"
              :label="t('profile.description')"
              :hint="t('profile.description_hint')"
              :rows="10"
            />
          </q-form>
        </div>
      </div>
      <div class="row q-gutter-md">
        <q-btn color="primary" :label="t('save')" size="sm" @click="onSave" />
        <q-btn
          flat
          color="secondary"
          :label="t('refresh')"
          icon="refresh"
          size="sm"
          @click="onRefresh"
          class="q-mt-md"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import type { SubjectProfile } from 'src/models';
import TextInput from 'src/components/TextInput.vue';
import { notifyError, notifySuccess } from 'src/utils/notify';

const { t } = useI18n({ useScope: 'global' });
const authStore = useAuthStore();
const services = useServices();
const service = services.make('subject-profile');

const form = ref();
const selected = ref<SubjectProfile>({
  email: '',
} as SubjectProfile);
const username = computed(() => authStore.profile?.username || authStore.profile?.email);

onMounted(() => {
  onRefresh();
});

function onRefresh() {
  if (username.value) {
    void service
      .find({
        $limit: 1,
        filter: {
          identifier: username.value,
        },
      })
      .then((response) => {
        console.log('Profile loaded', response);
        selected.value = response.data[0];
      })
      .catch(notifyError);
  }
}

async function onSave() {
  if (selected.value.id) {
    // validate form
    const valid = await form.value.validate();
    if (!valid) return;
    void service
      .update(selected.value.id, selected.value)
      .then(() => {
        notifySuccess(t('profile.update_success'));
      })
      .catch(notifyError);
  }
}
</script>
