// markdown-it plugin to support :term[label]{content|urn} syntax

import type MarkdownIt from 'markdown-it';
import type StateCore from 'markdown-it/lib/rules_core/state_core.mjs';
import type Token from 'markdown-it/lib/token.mjs';

// Matches :term[label]{content|urn} where:
// * label is the text to show in the document
// * content is simple text to show in title
// * urn is a reference to a taxonomy node (e.g., 'urn:taxonomy:123')
const TOOLTIP_REGEX = /:term\[([^\]]+)\]\{([^}]+)\}/g;

/**
 * Markdown-it plugin to render :term[label]{content|urn} syntax as spans with tooltips.
 * The content inside the curly braces can be either a simple text (shown in the tooltip) or a pipe-separated pair of title and urn.
 * The label inside the square brackets is what will be shown in the document.
 */
function termPlugin(md: MarkdownIt): void {
  const handler = (state: StateCore) => {
    state.tokens.forEach((blockToken: Token) => {
      if (blockToken.type !== 'inline' || !blockToken.children) return;

      const newChildren: Token[] = [];

      blockToken.children.forEach((token: Token) => {
        if (token.type !== 'text') {
          newChildren.push(token);
          return;
        }

        const text = token.content;
        let lastIndex = 0;
        let match: RegExpExecArray | null;

        TOOLTIP_REGEX.lastIndex = 0;

        while ((match = TOOLTIP_REGEX.exec(text)) !== null) {
          const [fullMatch, label, termContent] = match;
          if (!label || !termContent) continue;

          // Push preceding plain text
          if (match.index > lastIndex) {
            const textToken = new state.Token('text', '', 0);
            textToken.content = text.slice(lastIndex, match.index);
            newChildren.push(textToken);
          }

          // Render term content as inline HTML
          const termContentParts = termContent.split('|');
          if (!termContentParts || termContentParts.length === 0) continue;
          let title = '';
          let urn = '';
          if (termContentParts.length === 1) {
            if (termContentParts[0]?.startsWith('urn:')) {
              urn = termContentParts[0] || '';
            } else {
              title = termContentParts[0] || '';
            }
          } else {
            title = termContentParts?.[0] || '';
            urn = termContentParts?.[1] || '';
          }

          // Push the term span as html_inline
          const spanToken = new state.Token('html_inline', '', 0);
          spanToken.content = `<span class="md-term" data-title="${escapeAttr(title)}" data-urn="${escapeAttr(urn)}">${escapeHtml(label)}</span>`;
          newChildren.push(spanToken);

          lastIndex = match.index + fullMatch.length;
        }

        // Push remaining plain text
        if (lastIndex < text.length) {
          const textToken = new state.Token('text', '', 0);
          textToken.content = text.slice(lastIndex);
          newChildren.push(textToken);
        }
      });

      blockToken.children = newChildren;
    });
  };

  // Run before 'linkify' so URLs inside {…} are not yet split into link tokens.
  // Fall back to push if linkify is not in the ruler (e.g. linkify disabled).
  try {
    md.core.ruler.before('linkify', 'rich_tooltip', handler);
  } catch {
    md.core.ruler.push('rich_tooltip', handler);
  }
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Hides the term syntax and shows only the label, without any tooltip.
 */
function noTermPlugin(md: MarkdownIt): void {
  const handler = (state: StateCore) => {
    state.tokens.forEach((blockToken: Token) => {
      if (blockToken.type !== 'inline' || !blockToken.children) return;

      blockToken.children.forEach((token: Token) => {
        if (token.type === 'text') {
          token.content = token.content.replace(TOOLTIP_REGEX, '$1');
        }
      });
    });
  };

  try {
    md.core.ruler.before('linkify', 'no_term', handler);
  } catch {
    md.core.ruler.push('no_term', handler);
  }
}

export function termMarkdown(md: MarkdownIt): void {
  md.use(termPlugin);
}

export function noTermMarkdown(md: MarkdownIt): void {
  md.use(noTermPlugin);
}
