import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import CardCategory from './CardCategory';

describe('CardCategory', () => {
  it('shows the category name and its icon', () => {
    render(<CardCategory name='Fiction' icon='/fiction.png' />);
    expect(screen.getByText('Fiction')).toBeInTheDocument();
    expect(screen.getByAltText('Fiction')).toHaveAttribute('src', '/fiction.png');
  });

  it('declares the icon size so the browser can reserve space before it loads', () => {
    render(<CardCategory name='Fiction' icon='/fiction.png' />);
    const icon = screen.getByAltText('Fiction');
    expect(icon).toHaveAttribute('width', '52');
    expect(icon).toHaveAttribute('height', '52');
  });

  it('calls onClick when the card is pressed', async () => {
    const onClick = vi.fn();
    render(<CardCategory name='Fiction' icon='/fiction.png' onClick={onClick} />);
    await userEvent.setup().click(screen.getByRole('button', { name: /Fiction/ }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
