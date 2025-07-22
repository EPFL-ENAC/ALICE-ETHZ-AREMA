import { defineBoot } from '#q-app/wrappers';
import { createI18n } from 'vue-i18n';

import messages from 'src/i18n';

export type MessageLanguages = keyof typeof messages;
// Type-define 'en-US' as the master schema for the resource
export type MessageSchema = (typeof messages)['en'];

const i18n = createI18n({
  locale: 'en',
  legacy: false,
  messages,
});

const t = i18n.global.t;

export default defineBoot(({ app }) => {
  // Set i18n instance on app
  app.use(i18n);
});

export { i18n, t };
