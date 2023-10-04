import { boot } from 'quasar/wrappers';
import { Quasar } from 'quasar';
import { createI18n } from 'vue-i18n';
import { useCookies } from 'vue3-cookies';

const { cookies } = useCookies();

import messages from 'src/i18n';

let detectedLocale = Quasar.lang.getLocale()?.split('-')[0];
const locales = Object.keys(messages);
if (!detectedLocale || !locales.includes(detectedLocale)) {
  detectedLocale = locales[0];
}
if (cookies.get('locale')) {
  detectedLocale = cookies.get('locale');
}

export type MessageLanguages = keyof typeof messages;
// Type-define 'en-US' as the master schema for the resource
export type MessageSchema = (typeof messages)['en'];

// See https://vue-i18n.intlify.dev/guide/advanced/typescript.html#global-resource-schema-type-definition
/* eslint-disable @typescript-eslint/no-empty-interface */
declare module 'vue-i18n' {
  // define the locale messages schema
  export interface DefineLocaleMessage extends MessageSchema {}

  // define the datetime format schema
  export interface DefineDateTimeFormat {}

  // define the number format schema
  export interface DefineNumberFormat {}
}
/* eslint-enable @typescript-eslint/no-empty-interface */

const i18n = createI18n({
  locale: detectedLocale,
  legacy: false,
  messages,
});

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(i18n);
});

const t = i18n.global.t;

export { t };
