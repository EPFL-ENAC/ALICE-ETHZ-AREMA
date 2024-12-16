import { defineStore } from 'pinia';

export const useHome = defineStore('home', () => {
  const scrollPosition = ref(0);
  const screenHeight = ref(0);

  const toolbarRatio = computed(() => {
    if (screenHeight.value === 0) return 0;
    const ratio = scrollPosition.value / screenHeight.value;
    if (ratio < 0.6) return 0;
    const newRatio = (5 * ratio - 3) / 2;
    return newRatio > 1 ? 1 : newRatio;
  });

  function reset() {
    scrollPosition.value = 0;
    screenHeight.value = 0;
  }

  function update(topPosition: number, totalHeight: number) {
    scrollPosition.value = topPosition;
    screenHeight.value = totalHeight;
  }

  return {
    scrollPosition,
    reset,
    update,
    toolbarRatio,
  };
});
