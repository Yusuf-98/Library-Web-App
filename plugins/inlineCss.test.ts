import { describe, expect, it } from 'vitest';
import { inlineStylesheets } from './inlineCss.ts';

const asset = (source: string | Uint8Array) => ({ type: 'asset', source });

const page = (head: string) => `<!doctype html><html><head>${head}</head><body></body></html>`;

describe('inlineStylesheets', () => {
  it('replaces the stylesheet link with the css itself', () => {
    const bundle = { 'assets/index-abc.css': asset('body{margin:0}') };
    const html = page('<link rel="stylesheet" crossorigin href="/assets/index-abc.css">');

    expect(inlineStylesheets(html, bundle)).toBe(page('<style>body{margin:0}</style>'));
  });

  it('drops the css file from the output once it is inlined', () => {
    const bundle = { 'assets/index-abc.css': asset('a{color:red}'), 'assets/app.js': { type: 'chunk' } };
    inlineStylesheets(page('<link rel="stylesheet" href="/assets/index-abc.css">'), bundle);

    expect(Object.keys(bundle)).toEqual(['assets/app.js']);
  });

  it('reads css that arrives as bytes', () => {
    const bundle = { 'assets/a.css': asset(new TextEncoder().encode('h1{font-size:2rem}')) };

    expect(inlineStylesheets(page('<link rel="stylesheet" href="/assets/a.css">'), bundle)).toContain(
      '<style>h1{font-size:2rem}</style>'
    );
  });

  it('keeps a closing style tag inside the css from ending the block early', () => {
    const bundle = { 'assets/a.css': asset('a::after{content:"</style>"}') };
    const out = inlineStylesheets(page('<link rel="stylesheet" href="/assets/a.css">'), bundle);

    expect(out).toContain(`content:"<${String.fromCharCode(92)}/style>"`);
    expect(out.match(new RegExp('</style>', 'g'))).toHaveLength(1);
  });

  it('leaves a stylesheet it cannot find untouched', () => {
    const html = page('<link rel="stylesheet" href="https://cdn.example.com/site.css">');

    expect(inlineStylesheets(html, {})).toBe(html);
  });

  it('only touches stylesheet links', () => {
    const bundle = { 'assets/a.css': asset('a{}') };
    const html = page('<link rel="icon" href="/favicon.png"><link rel="stylesheet" href="/assets/a.css">');

    expect(inlineStylesheets(html, bundle)).toBe(page('<link rel="icon" href="/favicon.png"><style>a{}</style>'));
  });
});
