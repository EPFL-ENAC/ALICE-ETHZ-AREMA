import { useQuasar } from 'quasar';

/**
 * Ask for confirmation before closing a form whose state changed since the last markClean().
 */
export function useDirtyGuard(state: () => unknown) {
  const $q = useQuasar();
  const { t } = useI18n();
  let snapshot = '';

  // inputs normalize undefined to null, '' or [] on mount: not a user change
  const serialize = () =>
    JSON.stringify(state(), (_k, v) =>
      v === null || v === '' || (Array.isArray(v) && v.length === 0) ? undefined : v,
    );

  function markClean() {
    snapshot = serialize();
  }

  function confirmClose(close: () => void) {
    if (serialize() === snapshot) return close();
    $q.dialog({
      title: t('unsaved_changes'),
      message: t('unsaved_changes_confirm'),
      ok: { label: t('discard'), color: 'negative', flat: true },
      cancel: { label: t('cancel'), color: 'secondary', flat: true },
      persistent: true,
    }).onOk(close);
  }

  return { markClean, confirmClose };
}
