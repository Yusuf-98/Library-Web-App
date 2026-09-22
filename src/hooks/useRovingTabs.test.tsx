import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { useRovingTabs } from './useRovingTabs';

function TestTabs({ count }: { count: number }) {
  const { tabRefs, onKeyDown } = useRovingTabs(count);
  return (
    <div role='tablist'>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          ref={(el) => {
            tabRefs.current[i] = el;
          }}
          role='tab'
          tabIndex={i === 0 ? 0 : -1}
          onKeyDown={(e) => onKeyDown(e, i)}
        >
          Tab {i}
        </button>
      ))}
    </div>
  );
}

function setup(count = 3) {
  render(<TestTabs count={count} />);
  return { user: userEvent.setup(), tabs: () => screen.getAllByRole('tab') };
}

describe('useRovingTabs', () => {
  it('moves focus to the next tab on ArrowRight', async () => {
    const { user, tabs } = setup();
    tabs()[0].focus();

    await user.keyboard('{ArrowRight}');

    expect(tabs()[1]).toHaveFocus();
  });

  it('wraps from the last tab to the first on ArrowRight', async () => {
    const { user, tabs } = setup();
    tabs()[2].focus();

    await user.keyboard('{ArrowRight}');

    expect(tabs()[0]).toHaveFocus();
  });

  it('moves focus to the previous tab on ArrowLeft', async () => {
    const { user, tabs } = setup();
    tabs()[1].focus();

    await user.keyboard('{ArrowLeft}');

    expect(tabs()[0]).toHaveFocus();
  });

  it('wraps from the first tab to the last on ArrowLeft', async () => {
    const { user, tabs } = setup();
    tabs()[0].focus();

    await user.keyboard('{ArrowLeft}');

    expect(tabs()[2]).toHaveFocus();
  });

  it('jumps to the first tab on Home', async () => {
    const { user, tabs } = setup();
    tabs()[2].focus();

    await user.keyboard('{Home}');

    expect(tabs()[0]).toHaveFocus();
  });

  it('jumps to the last tab on End', async () => {
    const { user, tabs } = setup();
    tabs()[0].focus();

    await user.keyboard('{End}');

    expect(tabs()[2]).toHaveFocus();
  });

  it('ignores keys other than arrows, Home and End', async () => {
    const { user, tabs } = setup();
    tabs()[0].focus();

    await user.keyboard('{Enter}');

    expect(tabs()[0]).toHaveFocus();
  });
});
