import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HeroSection from './HeroSection';

describe('HeroSection', () => {
  const banner = () => render(<HeroSection />) && screen.getByAltText('Welcome to Booky');

  it('is loaded eagerly and with high priority, since it is the first thing on the page', () => {
    const img = banner();
    expect(img).toHaveAttribute('fetchpriority', 'high');
    expect(img).not.toHaveAttribute('loading', 'lazy');
  });

  it('offers a small variant for narrow screens and a large one for wide screens', () => {
    const srcset = banner().getAttribute('srcset') ?? '';
    expect(srcset).toMatch(/hero-banner-home-640.*\s640w/);
    expect(srcset).toMatch(/hero-banner-home-800.*\s800w/);
    expect(srcset).toMatch(/hero-banner-home-1200.*\s1200w/);
  });

  it('declares its intrinsic size so the browser can reserve space', () => {
    const img = banner();
    expect(img).toHaveAttribute('width', '1200');
    expect(img).toHaveAttribute('height', '441');
  });
});
