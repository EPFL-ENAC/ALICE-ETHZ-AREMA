import { diffWords } from 'diff';

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function markdownDiff(
  oldText: string | undefined | null,
  newText: string | undefined | null,
): string {
  const parts = diffWords(oldText || '', newText || '');

  return parts
    .map((part) => {
      const text = escapeHtml(part.value);

      if (part.added) {
        return `<span class="diff-added">${text}</span>`;
      }

      if (part.removed) {
        return `<span class="diff-removed">${text}</span>`;
      }

      return text;
    })
    .join('');
}

export function countDiffs(
  oldText: string | undefined | null,
  newText: string | undefined | null,
): number {
  const parts = diffWords(oldText || '', newText || '');
  return parts.filter((part) => part.added || part.removed).length;
}
