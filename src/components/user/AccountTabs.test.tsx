import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AccountTabs, { AccountTabPanel } from './AccountTabs';

const navigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => navigate,
}));

function renderTabs(active: 'profile' | 'loans' | 'reviews' = 'loans') {
  return render(
    <MemoryRouter>
      <AccountTabs active={active} />
      <AccountTabPanel active={active}>panel content</AccountTabPanel>
    </MemoryRouter>
  );
}

const tab = (name: string) => screen.getByRole('tab', { name });

describe('AccountTabs', () => {
  beforeEach(() => {
    navigate.mockClear();
  });

  it('exposes a labelled tablist with all three tabs', () => {
    renderTabs();
    const tablist = screen.getByRole('tablist', { name: 'Account sections' });
    expect(screen.getAllByRole('tab').map((t) => t.textContent)).toEqual([
      'Profile',
      'Borrowed List',
      'Reviews',
    ]);
    expect(tablist).toBeInTheDocument();
  });

  it('marks only the active tab as selected and tabbable (roving tabindex)', () => {
    renderTabs('loans');
    expect(tab('Borrowed List')).toHaveAttribute('aria-selected', 'true');
    expect(tab('Profile')).toHaveAttribute('aria-selected', 'false');
    expect(tab('Borrowed List')).toHaveAttribute('tabindex', '0');
    expect(tab('Profile')).toHaveAttribute('tabindex', '-1');
    expect(tab('Reviews')).toHaveAttribute('tabindex', '-1');
  });

  it('links the tabpanel to the active tab', () => {
    renderTabs('reviews');
    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAccessibleName('Reviews');
    expect(tab('Reviews')).toHaveAttribute('aria-controls', panel.id);
  });

  it('Tab key stops on the active tab only, then leaves the tablist', async () => {
    const user = userEvent.setup();
    renderTabs('loans');
    await user.tab();
    expect(tab('Borrowed List')).toHaveFocus();
    await user.tab();
    expect(screen.getAllByRole('tab').some((t) => t === document.activeElement)).toBe(false);
  });

  it('arrow, Home and End keys move focus and wrap, without navigating', async () => {
    const user = userEvent.setup();
    renderTabs('loans');
    tab('Borrowed List').focus();

    await user.keyboard('{ArrowRight}');
    expect(tab('Reviews')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(tab('Profile')).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(tab('Reviews')).toHaveFocus();
    await user.keyboard('{Home}');
    expect(tab('Profile')).toHaveFocus();
    await user.keyboard('{End}');
    expect(tab('Reviews')).toHaveFocus();

    expect(navigate).not.toHaveBeenCalled();
  });

  it('Enter on a focused tab navigates to its route', async () => {
    const user = userEvent.setup();
    renderTabs('loans');
    tab('Borrowed List').focus();
    await user.keyboard('{ArrowRight}{Enter}');
    expect(navigate).toHaveBeenCalledExactlyOnceWith('/reviews');
  });

  it('clicking a tab navigates to its route', async () => {
    const user = userEvent.setup();
    renderTabs('loans');
    await user.click(tab('Profile'));
    expect(navigate).toHaveBeenCalledExactlyOnceWith('/profile');
  });
});
