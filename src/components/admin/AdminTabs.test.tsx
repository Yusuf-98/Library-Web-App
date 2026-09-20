import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AdminTabs, { AdminTabPanel } from './AdminTabs';

const navigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => navigate,
}));

function renderTabs(active: 'loans' | 'users' | 'books' = 'users') {
  return render(
    <MemoryRouter>
      <AdminTabs active={active} />
      <AdminTabPanel active={active}>panel content</AdminTabPanel>
    </MemoryRouter>
  );
}

const tab = (name: string) => screen.getByRole('tab', { name });

describe('AdminTabs', () => {
  beforeEach(() => {
    navigate.mockClear();
  });

  it('exposes a labelled tablist with the three admin sections', () => {
    renderTabs();
    expect(screen.getByRole('tablist', { name: 'Admin sections' })).toBeInTheDocument();
    expect(screen.getAllByRole('tab').map((t) => t.textContent)).toEqual([
      'Borrowed List',
      'User',
      'Book List',
    ]);
  });

  it('keeps selection, tabindex and tabpanel in sync with the active tab', () => {
    renderTabs('books');
    expect(tab('Book List')).toHaveAttribute('aria-selected', 'true');
    expect(tab('Book List')).toHaveAttribute('tabindex', '0');
    expect(tab('User')).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('tabpanel')).toHaveAccessibleName('Book List');
  });

  it('moves focus with arrow keys and only navigates on Enter', async () => {
    const user = userEvent.setup();
    renderTabs('users');
    tab('User').focus();

    await user.keyboard('{ArrowRight}');
    expect(tab('Book List')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(tab('Borrowed List')).toHaveFocus();
    expect(navigate).not.toHaveBeenCalled();

    await user.keyboard('{Enter}');
    expect(navigate).toHaveBeenCalledExactlyOnceWith('/admin/loans');
  });
});
