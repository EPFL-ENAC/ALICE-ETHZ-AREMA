import { defineBoot } from '#q-app/wrappers';
import type { Instance, Props } from 'tippy.js';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';

// Extend HTMLElement to carry _tippy instances
declare global {
  interface HTMLElement {
    _tippyInstances?: Instance<Props>[];
  }
}

function attachTippy(el: HTMLElement): void {
  // Destroy existing instances first to avoid duplicates on update
  el._tippyInstances?.forEach((instance) => instance.destroy());
  el._tippyInstances = [];

  el.querySelectorAll<HTMLElement>('.md-tooltip').forEach((span) => {
    const content = span.dataset.tip;
    if (!content) return;

    const instance = tippy(span, {
      content,
      allowHTML: true,
      theme: 'light',
      placement: 'top',
      arrow: true,
      interactive: true,
      maxWidth: 300,
    });

    // tippy() can return Instance or Instance[] depending on input type
    if (Array.isArray(instance)) {
      el._tippyInstances!.push(...instance);
    } else {
      el._tippyInstances!.push(instance);
    }
  });
}

export default defineBoot(({ app }) => {
  app.directive<HTMLElement>('tippy', {
    mounted(el) {
      attachTippy(el);
    },
    updated(el) {
      attachTippy(el);
    },
    unmounted(el) {
      el._tippyInstances?.forEach((instance) => instance.destroy());
      delete el._tippyInstances;
    },
  });
});
