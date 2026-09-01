import { Notify } from 'quasar';
import { t } from '@/boot/i18n';

export function notifySuccess(message: string) {
  Notify.create({
    type: 'positive',
    message: t(message),
  });
}

export function notifyInfo(message: string) {
  Notify.create({
    type: 'info',
    message: t(message),
  });
}

export function notifyWarning(message: string) {
  Notify.create({
    type: 'warning',
    message: t(message),
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function notifyError(error: any) {
  let message: string;
  if (typeof error === 'string') {
    message = t(error);
  } else {
    console.error(error);
    message = error?.message ?? t('error.unknown');
    if (error?.response?.data && error.response.data?.status) {
      message = t(`error.${error.response?.data.status}`, error.response?.data.arguments);
    }
  }
  Notify.create({
    type: 'negative',
    message,
  });
}
