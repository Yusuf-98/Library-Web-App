import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import NotFoundState from './NotFoundState';

function LocationProbe() {
  return <div data-testid='pathname'>{useLocation().pathname}</div>;
}

describe('NotFoundState', () => {
  it('shows the message and a way back home', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/books/1']}>
        <NotFoundState message='Book not found.' />
        <LocationProbe />
      </MemoryRouter>
    );

    expect(screen.getByText('Book not found.')).toBeInTheDocument();
    expect(screen.getByTestId('pathname')).toHaveTextContent('/books/1');

    await user.click(screen.getByRole('button', { name: 'Back to Home' }));
    expect(screen.getByTestId('pathname').textContent).toBe('/');
  });
});
