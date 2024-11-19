<template>
  <q-page>
    <div class="text-h5 q-pa-md">{{ $t('dashboard') }}</div>
    <q-separator />
    <div class="q-pa-md">
      <div class="text-h6 q-mb-md">{{ $t('layout') }}</div>
      <div class="row">
        <div class="col-12 col-md-2"></div>
        <div class="col-12 col-md-8">
          <q-card flat bordered class="text-grey-8">
            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-2">
                  <q-skeleton
                    height="100px"
                    class="q-mb-md q-pa-md bg-teal-1"
                    style="margin-top: 650px"
                  >
                    {{ $t('external_links') }}
                  </q-skeleton>
                </div>
                <div class="col-8">
                  <q-skeleton height="50px" class="q-mb-md q-pa-md bg-teal-1">
                    {{ $t('name') }}
                  </q-skeleton>
                  <q-skeleton height="100px" class="q-mb-md q-pa-md bg-teal-1">
                    {{ $t('description') }}
                  </q-skeleton>

                  <q-skeleton height="100px" class="q-mb-md q-pa-md bg-teal-1">
                    {{ $t('physical_characteristics') }}
                  </q-skeleton>

                  <q-skeleton height="150px" class="q-mb-md q-pa-md bg-teal-1">
                    {{ $t('article_top') }}
                  </q-skeleton>

                  <div
                    style="
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      flex-direction: column;
                    "
                  >
                    <q-skeleton
                      width="300px"
                      height="100px"
                      class="q-mb-md q-pa-md bg-teal-1"
                    >
                      {{ $t('multimedia') }}
                    </q-skeleton>

                    <q-skeleton
                      type="rect"
                      width="300px"
                      class="q-mb-md q-pa-xs bg-teal-1"
                    >
                      {{ $t('legend') }}
                    </q-skeleton>
                  </div>

                  <q-skeleton height="150px" class="q-mb-md q-pa-md bg-teal-1">
                    {{ $t('article_bottom') }}
                  </q-skeleton>
                </div>
                <div class="col-2">
                  <q-skeleton
                    height="100px"
                    class="q-mb-md q-pa-md bg-teal-1"
                    style="margin-top: 300px"
                  >
                    {{ $t('side_note') }}
                  </q-skeleton>
                </div>
              </div>

              <div class="row q-col-gutter-md">
                <template v-for="i in 3" :key="i">
                  <div class="col-4">
                    <q-skeleton height="100px" class="q-pa-md bg-teal-1">
                      {{ `${$t('technical_element')} #${i}` }}
                    </q-skeleton>
                  </div>
                </template>
              </div>
            </q-card-section>
            <div></div>
          </q-card>
        </div>
        <div class="col-12 col-md-2"></div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts"></script>
