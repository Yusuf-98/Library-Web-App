import { useEffect, type RefObject } from 'react';

export function useOverlayA11y(
  active: boolean,
  onClose: () => void,
  initialFocusRef?: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (!active) return;

    // --- Focus ---
    const previouslyFocused = document.activeElement as HTMLElement | null;
    initialFocusRef?.current?.focus();

    // --- Scroll lock ---
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // --- Escape ---
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    // --- Cleanup ---
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [active, onClose, initialFocusRef]);
}
