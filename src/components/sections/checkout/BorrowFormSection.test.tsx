import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CartItem } from '@/types';
import BorrowFormSection from './BorrowFormSection';

const mutate = vi.fn();
vi.mock('@/features/checkout/useBorrowMutation', () => ({
  useBorrowMutation: () => ({ mutate, isPending: false }),
}));

const items = [{ id: 11 }] as CartItem[];

beforeEach(() => {
  mutate.mockClear();
  vi.stubEnv('TZ', 'America/Toronto');
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-09-21T01:00:00Z'));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('BorrowFormSection', () => {
  it("defaults to today's local date and a 3-day return date", () => {
    render(<BorrowFormSection items={items} />);
    expect(screen.getByText('20 Sep 2026')).toBeInTheDocument();
    expect(screen.getByText('23 September 2026')).toBeInTheDocument();
  });

  it('recalculates the return date when the duration changes', async () => {
    const user = userEvent.setup();
    render(<BorrowFormSection items={items} />);

    await user.click(screen.getByRole('button', { name: '10 Days' }));
    expect(screen.getByText('30 September 2026')).toBeInTheDocument();
  });

  it('does not allow picking a day before today', async () => {
    const user = userEvent.setup();
    render(<BorrowFormSection items={items} />);

    await user.click(screen.getByText('20 Sep 2026'));
    expect(screen.getByRole('button', { name: '19' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '20' })).toBeEnabled();
  });

  it('stays disabled until both agreements are accepted', async () => {
    const user = userEvent.setup();
    render(<BorrowFormSection items={items} />);
    const confirm = screen.getByRole('button', { name: 'Confirm & Borrow' });
    expect(confirm).toBeDisabled();

    await user.click(screen.getByRole('checkbox', { name: /agree to return/ }));
    expect(confirm).toBeDisabled();

    await user.click(screen.getByRole('checkbox', { name: /accept the library borrowing policy/ }));
    expect(confirm).toBeEnabled();
  });

  it('submits the chosen duration and the local borrow date', async () => {
    const user = userEvent.setup();
    render(<BorrowFormSection items={items} />);

    await user.click(screen.getByRole('button', { name: '5 Days' }));
    await user.click(screen.getByRole('checkbox', { name: /agree to return/ }));
    await user.click(screen.getByRole('checkbox', { name: /accept the library borrowing policy/ }));
    await user.click(screen.getByRole('button', { name: 'Confirm & Borrow' }));

    expect(mutate).toHaveBeenCalledExactlyOnceWith({ days: 5, borrowDate: '2026-09-20' });
  });
});
