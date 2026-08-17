import DOMPurify from 'isomorphic-dompurify';

const TIPTAP_TAGS = [
  'p',
  'br',
  'hr',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'del',
  'code',
  'pre',
  'blockquote',
  'ul',
  'ol',
  'li',
  'a',
  'img',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'colgroup',
  'col',
  'span',
  'mark',
  'div',
  'sub',
  'sup',
  'iframe',
  'input',
  'label',
];

const TIPTAP_ATTR = [
  'href',
  'target',
  'rel',
  'class',
  'id',
  'src',
  'alt',
  'title',
  'width',
  'height',
  'colspan',
  'rowspan',
  'style',
  'spellcheck',
  'type',
  'checked',
  'disabled',
  'allow',
  'allowfullscreen',
  'frameborder',
  'loading',
  'referrerpolicy',
  'data-type',
  'data-checked',
  'data-language',
  'data-mode',
  'data-youtube-video',
];

const ALLOWED_URI_REGEXP = /^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$)|data:image\/)/i;

const YOUTUBE_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com']);

let hooksRegistered = false;

const registerHooks = () => {
  if (hooksRegistered) return;
  hooksRegistered = true;

  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      node.setAttribute('rel', 'noopener noreferrer nofollow');
      const href = node.getAttribute('href');
      if (href?.toLowerCase().startsWith('javascript:')) {
        node.removeAttribute('href');
      }
    }

    if (node.tagName === 'IFRAME') {
      const src = node.getAttribute('src');
      if (!src) {
        node.parentNode?.removeChild(node);
        return;
      }
      try {
        const url = new URL(src, 'https://invalid.local');
        if (!YOUTUBE_HOSTS.has(url.hostname)) {
          node.parentNode?.removeChild(node);
        }
      } catch {
        node.parentNode?.removeChild(node);
      }
    }
  });
};

/**
 * Tiptap/Novel 본문에 필요한 태그만 남기고 event handler·위험 scheme을 제거한다.
 */
export const sanitizePostHtml = (html: string) => {
  if (!html) return '';

  registerHooks();

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: TIPTAP_TAGS,
    ALLOWED_ATTR: TIPTAP_ATTR,
    ALLOW_DATA_ATTR: true,
    ALLOWED_URI_REGEXP,
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'style'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
  });
};

/** Mermaid 등 SVG 조각을 렌더하기 전에 script를 제거한다. */
export const sanitizeSvgHtml = (html: string) => {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { svg: true, svgFilters: true, html: true },
    FORBID_TAGS: ['script', 'foreignObject'],
  });
};
