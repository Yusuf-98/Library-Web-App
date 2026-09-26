import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import indexHtml from '../../../../index.html?raw';
import homePageSource from '../../../pages/user/HomePage.tsx?raw';
import HeroSection from './HeroSection';

const shell = new DOMParser().parseFromString(indexHtml, 'text/html');
const shellHero = () => shell.querySelector('#shell-hero img') as HTMLImageElement;

describe('static hero in index.html', () => {
  it.each(['src', 'srcset', 'sizes', 'width', 'height', 'fetchpriority', 'alt', 'class'])(
    'matches HeroSection on %s',
    (name) => {
      render(<HeroSection />);
      expect(screen.getByAltText('Welcome to Booky').getAttribute(name)).toBe(shellHero().getAttribute(name));
    }
  );

  it('sits in the same page container as the home page content', () => {
    const container = shell.querySelector('#shell-hero')?.getAttribute('class');
    expect(container).toBeTruthy();
    expect(homePageSource).toContain(`className='${container}'`);
  });

  it('is wrapped like the hero, in a section and a plain div', () => {
    expect(shellHero().parentElement?.tagName).toBe('DIV');
    expect(shellHero().parentElement?.getAttribute('class')).toBeNull();
    expect(shellHero().parentElement?.parentElement?.tagName).toBe('SECTION');
  });

  it('is removed on every page except the home page', () => {
    expect(indexHtml).toContain("location.pathname !== '/'");
    expect(indexHtml).toContain("document.getElementById('shell-hero').remove()");
  });
});
