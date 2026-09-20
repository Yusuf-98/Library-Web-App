import { useEffect, type RefObject } from 'react';

// While active: lock body scroll, close on Escape, and return focus on close.
// Initial focus is set here (not via autoFocus) so the trigger is captured first.
export function useOverlayA11y(
  active: boolean,
  onClose: () => void,
  initialFocusRef?: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (!active) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    initialFocusRef?.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [active, onClose, initialFocusRef]);
}
