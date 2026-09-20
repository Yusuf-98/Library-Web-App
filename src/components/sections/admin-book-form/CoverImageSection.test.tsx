import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import CoverImageSection from './CoverImageSection';

function setup(props: { currentCoverSrc?: string | null; canDelete: boolean }) {
  const onDeleteImage = vi.fn();
  render(
    <CoverImageSection
      currentCoverSrc={props.currentCoverSrc}
      fileInputRef={createRef<HTMLInputElement>()}
      onCoverChange={() => {}}
      onDeleteImage={onDeleteImage}
      canDelete={props.canDelete}
    />
  );
  return { onDeleteImage, user: userEvent.setup() };
}

describe('CoverImageSection', () => {
  it('offers the upload prompt when there is no cover', () => {
    setup({ currentCoverSrc: null, canDelete: false });
    expect(screen.getByText('Click to upload')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Delete Image/ })).not.toBeInTheDocument();
  });

  it('only lets you change (not delete) a cover that is already saved', () => {
    setup({ currentCoverSrc: 'https://example.com/saved.png', canDelete: false });
    expect(screen.getByRole('button', { name: /Change Image/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Delete Image/ })).not.toBeInTheDocument();
  });

  it('lets you discard a newly picked file', async () => {
    const { onDeleteImage, user } = setup({ currentCoverSrc: 'blob:preview', canDelete: true });
    await user.click(screen.getByRole('button', { name: /Delete Image/ }));
    expect(onDeleteImage).toHaveBeenCalledTimes(1);
  });
});
