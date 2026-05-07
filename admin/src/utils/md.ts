// markdown-it plugin to support :term[label]{content|urn} syntax

import type MarkdownIt from 'markdown-it';
import type StateCore from 'markdown-it/lib/rules_core/state_core.mjs';
import type Token from 'markdown-it/lib/token.mjs';

// Matches :term[label]{content|urn} where:
// * label is the text to show in the document
// * content is simple text to show in title
// * urn is a reference to a taxonomy node (e.g., 'urn:taxonomy:123')
const TOOLTIP_REGEX = /:term\[([^\]]+)\]\{([^}]+)\}/g;

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
          if (!label) continue;

          // Push preceding plain text
          if (match.index > lastIndex) {
            const textToken = new state.Token('text', '', 0);
            textToken.content = text.slice(lastIndex, match.index);
            newChildren.push(textToken);
          }

          // Render term content as inline HTML
          const termContentParts = termContent?.split('|');
          const urn = termContentParts?.[1];
          if (urn) {
            console.log(`Term with URN: ${urn}`);
          }
          const renderedContent = termContentParts?.[0] ? termContentParts[0] : '';

          // Push the term span as html_inline
          const spanToken = new state.Token('html_inline', '', 0);
          spanToken.content = `<span class="md-term" title="${escapeAttr(renderedContent)}" data-urn="${escapeAttr(urn || '')}">${escapeHtml(label)}</span>`;
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

export function termMarkdown(md: MarkdownIt): void {
  md.use(termPlugin);
}
