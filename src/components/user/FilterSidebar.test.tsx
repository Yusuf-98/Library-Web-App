import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import FilterSidebar from './FilterSidebar';

const categories = [
  { id: 4, name: 'Fiction' },
  { id: 9, name: 'Finance' },
];

function setup(props: { selectedCategoryId?: number; selectedRating?: number } = {}) {
  const onCategoryChange = vi.fn();
  const onRatingChange = vi.fn();
  render(
    <FilterSidebar
      categories={categories}
      onCategoryChange={onCategoryChange}
      onRatingChange={onRatingChange}
      {...props}
    />
  );
  return { onCategoryChange, onRatingChange, user: userEvent.setup() };
}

describe('FilterSidebar', () => {
  it('exposes each option as a checkbox whose checked state matches the selection', () => {
    setup({ selectedCategoryId: 4, selectedRating: 3 });
    expect(screen.getByRole('checkbox', { name: 'Fiction' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Finance' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: '3' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: '5' })).not.toBeChecked();
    expect(screen.getAllByRole('checkbox')).toHaveLength(2 + 5);
  });

  it('selects a category', async () => {
    const first = setup();
    await first.user.click(screen.getByRole('checkbox', { name: 'Finance' }));
    expect(first.onCategoryChange).toHaveBeenCalledExactlyOnceWith(9);
  });

  it('clicking the selected category clears the filter', async () => {
    const { onCategoryChange, user } = setup({ selectedCategoryId: 4 });
    await user.click(screen.getByRole('checkbox', { name: 'Fiction' }));
    expect(onCategoryChange).toHaveBeenCalledExactlyOnceWith(undefined);
  });

  it('picks a minimum rating', async () => {
    const picked = setup();
    await picked.user.click(screen.getByRole('checkbox', { name: '4' }));
    expect(picked.onRatingChange).toHaveBeenCalledExactlyOnceWith(4);
  });

  it('clicking the selected rating clears the filter', async () => {
    const { onRatingChange, user } = setup({ selectedRating: 4 });
    await user.click(screen.getByRole('checkbox', { name: '4' }));
    expect(onRatingChange).toHaveBeenCalledExactlyOnceWith(undefined);
  });
});
