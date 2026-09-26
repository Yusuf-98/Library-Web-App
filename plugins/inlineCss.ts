import type { Plugin } from 'vite';

type Bundle = Record<string, { type: string; source?: string | Uint8Array }>;

// --- Helpers ---
const STYLESHEET_LINK = /<link\s+rel="stylesheet"[^>]*\shref="([^"]+\.css)"[^>]*>/g;
const STYLE_END = new RegExp('</style', 'gi');
const BACKSLASH = String.fromCharCode(92);
const ESCAPED_STYLE_END = `<${BACKSLASH}/style`;

function readSource(source: string | Uint8Array) {
  return typeof source === 'string' ? source : new TextDecoder().decode(source);
}

export function inlineStylesheets(html: string, bundle: Bundle) {
  return html.replace(STYLESHEET_LINK, (tag, href: string) => {
    const fileName = href.replace(/^\//, '');
    const asset = bundle[fileName];
    if (!asset || asset.type !== 'asset' || asset.source === undefined) return tag;

    delete bundle[fileName];
    return `<style>${readSource(asset.source).replace(STYLE_END, ESCAPED_STYLE_END)}</style>`;
  });
}

// --- Plugin ---
export function inlineCss(): Plugin {
  return {
    name: 'inline-css',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        return ctx.bundle ? inlineStylesheets(html, ctx.bundle) : html;
      },
    },
  };
}
