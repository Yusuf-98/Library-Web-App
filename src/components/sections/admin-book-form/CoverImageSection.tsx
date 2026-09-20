import type { RefObject } from 'react';
import uploadCloudIcon from '@/assets/icons/upload-cloud-02.svg';
import uploadIcon from '@/assets/icons/upload.svg';
import trashRedIcon from '@/assets/icons/trash-red.svg';

interface CoverImageSectionProps {
  currentCoverSrc: string | null | undefined;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteImage: () => void;
  // Only a newly picked file can be discarded; the API has no way to remove a saved cover.
  canDelete: boolean;
}

export default function CoverImageSection({
  currentCoverSrc,
  fileInputRef,
  onCoverChange,
  onDeleteImage,
  canDelete,
}: CoverImageSectionProps) {
  return (
    <div className='flex flex-col gap-0.5 w-full'>
      <label className='text-sm font-bold text-neutral-950 tracking-t-2 w-full'>
        Cover Image
      </label>
      {currentCoverSrc ? (
        <div className='bg-white border border-dashed border-neutral-300 rounded-xl flex flex-col items-center gap-lg px-3xl py-xl w-full'>
          <img
            src={currentCoverSrc}
            alt=''
            className='h-34.5 object-cover rounded-md'
          />
          <div className='flex gap-lg items-start'>
            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              className='cursor-pointer bg-neutral-25 border border-neutral-300 rounded-lg flex gap-1.5 items-center h-10 px-lg'
            >
              <img src={uploadIcon} alt='' className='size-5' />
              <span className='font-medium text-neutral-950 text-sm tracking-t-3'>
                Change Image
              </span>
            </button>
            {canDelete && (
              <button
                type='button'
                onClick={onDeleteImage}
                className='cursor-pointer bg-neutral-25 border border-neutral-300 rounded-lg flex gap-1.5 items-center h-10 px-lg'
              >
                <img src={trashRedIcon} alt='' className='size-5' />
                <span className='font-medium text-accent-red text-sm tracking-t-3'>
                  Delete Image
                </span>
              </button>
            )}
          </div>
          <span className='font-medium text-neutral-950 text-sm tracking-t-3 text-center'>
            PNG or JPG (max. 5mb)
          </span>
        </div>
      ) : (
        <button
          type='button'
          onClick={() => fileInputRef.current?.click()}
          className='cursor-pointer bg-white border border-dashed border-neutral-300 rounded-xl flex flex-col items-center gap-lg px-3xl py-xl w-full'
        >
          <div className='border border-neutral-300 rounded-md size-10 flex items-center justify-center'>
            <img src={uploadCloudIcon} alt='' className='size-5' />
          </div>
          <div className='flex flex-col gap-xs items-center w-full'>
            <div className='flex gap-xs items-start justify-center w-full'>
              <span className='font-bold text-primary-300 text-sm tracking-t-2'>
                Click to upload
              </span>
              <span className='font-semibold text-neutral-950 text-sm tracking-t-2'>
                or drag and drop
              </span>
            </div>
            <span className='font-semibold text-neutral-950 text-sm tracking-t-2 text-center'>
              PNG or JPG (max. 5mb)
            </span>
          </div>
        </button>
      )}
      <input
        ref={fileInputRef}
        type='file'
        accept='image/png,image/jpeg'
        className='hidden'
        onChange={onCoverChange}
      />
    </div>
  );
}
