<template>
  <div v-if="addresses.length">
    <div class="content">
      <div class="text-primary text-uppercase q-mb-sm">
        {{ t('address') }}
      </div>
      <div class="cards">
        <template v-for="addr in addresses" :key="addr">
          <q-card flat class="q-mb-md" style="min-width: 200px">
            <q-card-section>
              <template v-for="(tk, idx) in addr.split(',')" :key="idx">
                <div :class="idx === 0 ? 'text-primary' : ''">{{ tk }}</div>
              </template>
            </q-card-section>
          </q-card>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Document } from 'src/models';

const { t } = useI18n();

interface Props {
  document: Document;
}

const props = defineProps<Props>();

const addresses = computed(() => {
  const addrList = [];
  if (props.document.address) {
    addrList.push(props.document.address);
  }
  if (props.document.addresses) {
    addrList.push(...props.document.addresses);
  }
  return addrList;
});
</script>

<style scoped>
.content {
  grid-column: 2 / 3;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .content {
    grid-column: 1 / -1;
  }
}
</style>
