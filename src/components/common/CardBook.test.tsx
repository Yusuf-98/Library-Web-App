import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import CardBook, { CardBookSkeleton } from './CardBook';

const props = {
  title: 'Clean Code',
  author: 'Robert C. Martin',
  cover: 'https://res.cloudinary.com/demo/image/upload/v1/covers/clean.png',
  rating: 4.8,
};

describe('CardBook', () => {
  it('shows the title, author and rating', () => {
    render(<CardBook {...props} />);
    expect(screen.getByText('Clean Code')).toBeInTheDocument();
    expect(screen.getByText('Robert C. Martin')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
  });

  it('requests a small WebP-capable copy of a Cloudinary cover and lazy-loads it', () => {
    render(<CardBook {...props} />);
    const img = screen.getByAltText('Clean Code');
    expect(img).toHaveAttribute('src', expect.stringContaining('/upload/f_auto,q_auto,c_limit,w_400/v1/'));
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('keeps covers from other hosts as they are', () => {
    render(<CardBook {...props} cover='https://covers.openlibrary.org/b/id/1-L.jpg' />);
    expect(screen.getByAltText('Clean Code')).toHaveAttribute('src', 'https://covers.openlibrary.org/b/id/1-L.jpg');
  });

  it('calls onClick when the card is pressed', async () => {
    const onClick = vi.fn();
    render(<CardBook {...props} onClick={onClick} />);
    await userEvent.setup().click(screen.getByRole('button', { name: /Clean Code/ }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('CardBookSkeleton', () => {
  it('is hidden from assistive technology and not interactive', () => {
    const { container } = render(<CardBookSkeleton />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
