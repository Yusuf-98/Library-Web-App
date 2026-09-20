import { useRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useOverlayA11y } from './useOverlayA11y';

function Overlay({ active, onClose }: { active: boolean; onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  useOverlayA11y(active, onClose, inputRef);
  return active ? <input aria-label='overlay input' ref={inputRef} /> : null;
}

function Page(props: { active: boolean; onClose: () => void }) {
  return (
    <>
      <button type='button'>trigger</button>
      <Overlay {...props} />
    </>
  );
}

describe('useOverlayA11y', () => {
  it('locks body scroll only while active', () => {
    const onClose = vi.fn();
    const { rerender } = render(<Page active={false} onClose={onClose} />);
    expect(document.body.style.overflow).toBe('');

    rerender(<Page active onClose={onClose} />);
    expect(document.body.style.overflow).toBe('hidden');

    rerender(<Page active={false} onClose={onClose} />);
    expect(document.body.style.overflow).toBe('');
  });

  it('calls onClose on Escape while active, and only then', () => {
    const onClose = vi.fn();
    const { rerender } = render(<Page active={false} onClose={onClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();

    rerender(<Page active onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(<Page active={false} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('focuses the initial element, then returns focus to the trigger on close', () => {
    const onClose = vi.fn();
    const { rerender } = render(<Page active={false} onClose={onClose} />);
    const trigger = screen.getByRole('button', { name: 'trigger' });
    trigger.focus();

    rerender(<Page active onClose={onClose} />);
    expect(screen.getByLabelText('overlay input')).toHaveFocus();

    // The trigger (not the overlay input that is about to unmount) must get focus back.
    rerender(<Page active={false} onClose={onClose} />);
    expect(trigger).toHaveFocus();
  });
});
