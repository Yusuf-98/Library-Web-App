import { useRef, type KeyboardEvent } from 'react';

// Arrow/Home/End focus movement for a tablist. Activation stays manual
// (Enter/Space clicks the focused tab) because each tab is a route change.
export function useRovingTabs(count: number) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    if (e.key === 'ArrowRight') next = (index + 1) % count;
    else if (e.key === 'ArrowLeft') next = (index - 1 + count) % count;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = count - 1;
    else return;

    e.preventDefault();
    tabRefs.current[next]?.focus();
  };

  return { tabRefs, onKeyDown };
}
