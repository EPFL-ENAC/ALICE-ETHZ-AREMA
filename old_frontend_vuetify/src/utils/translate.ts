import { useI18n } from 'vue-i18n'

export function useTranslate() {
  const { te, t } = useI18n()

  function to(key: string) {
    return te(key) ? t(key) : undefined
  }

  return { to }
}
