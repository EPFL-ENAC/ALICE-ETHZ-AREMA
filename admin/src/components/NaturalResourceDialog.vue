<template>
  <q-dialog v-model="showDialog" @hide="onHide">
      <q-card class="dialog-md">
        <q-card-section>
          <div class="text-h6">{{ $t(editMode ? 'edit' : 'add') }}</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-tabs
            v-model="tab"
            dense
            align="left"
            no-caps
          >
            <q-tab name="general" :label="$t('general')" />
            <q-tab name="structural" :label="$t('structural')" />
            <q-tab name="hygrothermal" :label="$t('hygrothermal')" />
            <q-tab name="acoustic" :label="$t('acoustic')" />
            <q-tab name="fire" :label="$t('fire_resistance')" />
            <q-tab name="others" :label="$t('others')" />
          </q-tabs>
          <q-separator />

          <q-form ref="formRef" class="q-gutter-md" persistent>
            <q-tab-panels v-model="tab">
              <q-tab-panel name="general" class="q-pl-none q-pr-none">
                <q-input
                  filled
                  v-model="selected.name"
                  :label="$t('name')"
                  class="q-mb-md"
                  :rule="[validateRequired]"
                />
                <q-input
                  filled
                  v-model="selected.description"
                  type="textarea"
                  :label="$t('description')"
                  class="q-mb-md"
                  :rule="[validateRequired]"
                />
              </q-tab-panel>
              <q-tab-panel name="structural" class="q-pl-none q-pr-none">
                <div class="row q-col-gutter-lg">
                  <div class="col">
                    <property-form-item
                      v-for="property in ['density', 'compressive_strength', 'tensile_strength']" :key="property"
                      v-model="selected"
                      :property="property" />
                  </div>
                  <div class="col">
                    <property-form-item
                      v-for="property in ['youngs_modulus', 'shrinkage', 'settlement']" :key="property"
                      v-model="selected"
                      :property="property" />
                  </div>
                </div>
              </q-tab-panel>
              <q-tab-panel name="hygrothermal" class="q-pl-none q-pr-none">
                <div class="row q-col-gutter-lg">
                  <div class="col">
                    <property-form-item
                      v-for="property in ['thermal_conductivity', 'thermal_capacity', 'vapor_diffusion_resistance', 'moisture_buffering']" :key="property"
                      v-model="selected"
                      :property="property" />
                  </div>
                  <div class="col">
                    <property-form-item
                      v-for="property in ['u', 'effusivity', 'diffusivity']" :key="property"
                      v-model="selected"
                      :property="property" />
                  </div>
                </div>
              </q-tab-panel>
              <q-tab-panel name="acoustic" class="q-pl-none q-pr-none">
                <div class="row q-col-gutter-lg">
                  <div class="col">
                    <property-form-item
                      v-for="property in ['absorption_coefficient', 'sound_reduction_index']" :key="property"
                      v-model="selected"
                      :property="property" />
                  </div>
                  <div class="col">
                  </div>
                </div>
              </q-tab-panel>
              <q-tab-panel name="fire" class="q-pl-none q-pr-none">
                <div class="row q-col-gutter-lg">
                  <div class="col">
                    <property-form-item
                      v-for="property in ['reaction_to_fire', 'building_material_class']" :key="property"
                      v-model="selected"
                      :property="property" />
                  </div>
                  <div class="col">
                    <property-form-item
                      v-for="property in ['fire_resistance_class']" :key="property"
                      v-model="selected"
                      :property="property" />
                  </div>
                </div>
              </q-tab-panel>
              <q-tab-panel name="others" class="q-pl-none q-pr-none">
                <div class="row q-col-gutter-lg">
                  <div class="col">
                    <property-form-item
                      v-for="property in ['air_tightness']" :key="property"
                      v-model="selected"
                      :property="property" />
                  </div>
                  <div class="col">
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </q-form>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="bg-grey-3">
          <q-btn flat :label="$t('cancel')" color="secondary" v-close-popup />
          <q-btn
            :label="$t('save')"
            color="primary"
            @click="onSave"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script lang="ts">
export default defineComponent({
  components: { PropertyFormItem },
  name: 'NaturalResourceDialog',
});
</script>
<script setup lang="ts">
import { NaturalResource } from '@epfl-enac/arema';
import { notifyError } from '../utils/notify';
import PropertyFormItem from './PropertyFormItem.vue';


interface DialogProps {
  modelValue: boolean;
  item: NaturalResource
}

const props = defineProps<DialogProps>();
const emit = defineEmits(['update:modelValue', 'saved'])

const { t } = useI18n();
const { api } = useFeathers();
const service = api.service('natural-resource');

const showDialog = ref(props.modelValue);
const selected = ref<NaturalResource>({ name: '' } as NaturalResource);
const editMode = ref(false);
const tab = ref('general');
const formRef = ref();

const validateRequired = (val: string) => (val && val.trim().length > 0) || t('validation.required');

watch(() => props.modelValue, (value) => {
  if (value) {
    selected.value = { ...props.item };
    editMode.value = selected.value.id !== undefined;
    tab.value = 'general';
  }
  showDialog.value = value;
});

function onHide() {
  emit('update:modelValue', false);
}

async function onSave() {
  const validated = await formRef.value.validate()
  if (!validated) return;
  if (selected.value === undefined) return;
  if (selected.value.id) {
    service
      .patch(selected.value.id, selected.value)
      .then(() => {
        emit('saved', selected.value);
        showDialog.value = false;
        onHide();
      })
      .catch((err) => {
        notifyError(err.message);
      });
  } else {
    // TODO
    selected.value.images = [];
    service
      .create(selected.value)
      .then(() => {
        emit('saved', selected.value);
        showDialog.value = false;
        onHide();
      })
      .catch((err) => {
        notifyError(err.message);
      });
  }
}
</script>