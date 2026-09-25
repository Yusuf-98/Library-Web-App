import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

type Module = typeof import('./StaggeredItems');
let FadeInUp: Module['FadeInUp'];
let FadeIn: Module['FadeIn'];

let reveal: () => void;

class ControlledObserver {
  constructor(callback: IntersectionObserverCallback) {
    reveal = () => callback([{ isIntersecting: true } as IntersectionObserverEntry], this as never);
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(async () => {
  window.matchMedia = ((query: string) => ({ matches: false, media: query })) as typeof window.matchMedia;
  ({ FadeInUp, FadeIn } = await import('./StaggeredItems'));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const item = () => screen.getByText('content');

describe('fade-in items', () => {
  it('start hidden and fade in over 600 ms once they scroll into view', () => {
    vi.stubGlobal('IntersectionObserver', ControlledObserver);
    render(<FadeInUp delay={80}>content</FadeInUp>);

    expect(item()).toHaveClass('opacity-0');
    expect(item().style.transitionProperty).toBe('opacity, translate');

    act(() => reveal());

    expect(item()).toHaveClass('opacity-100');
    expect(item().style.transitionDuration).toBe('600ms');
    expect(item().style.transitionDelay).toBe('80ms');
  });

  it('fade-only items animate opacity alone', () => {
    vi.stubGlobal('IntersectionObserver', ControlledObserver);
    render(<FadeIn>content</FadeIn>);

    expect(item().style.transitionProperty).toBe('opacity');
  });

  it('are plain, always-visible content when marked instant', () => {
    vi.stubGlobal('IntersectionObserver', ControlledObserver);
    render(
      <FadeInUp instant className='w-full'>
        content
      </FadeInUp>
    );

    expect(item()).toHaveClass('w-full');
    expect(item()).not.toHaveClass('opacity-0');
    expect(item().style.transitionProperty).toBe('');
  });
});
