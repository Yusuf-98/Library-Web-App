import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import InputField from '@/components/ui/input-field';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/app/hooks';
import { useImageError } from '@/hooks/useImageError';
import { getMyProfile, updateMyProfile } from '@/lib/api/users';
import { updateUser } from '@/features/auth/authSlice';

interface ProfileCardProps {
  idPrefix?: string;
}

export default function ProfileCard({ idPrefix = 'profile' }: ProfileCardProps) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showAvatarTooltip, setShowAvatarTooltip] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['me'],
    queryFn: getMyProfile,
  });

  const profile = data?.profile;
  const loanStats = data?.loanStats;
  const avatarSrc = photoPreview ?? profile?.profilePhoto ?? undefined;
  const {
    isUsable: avatarUsable,
    handleError: handleAvatarError,
    handleLoad: handleAvatarLoad,
  } = useImageError(avatarSrc);

  const startEditing = () => {
    if (!profile) return;
    setName(profile.name);
    setPhone(profile.phone ?? '');
    setPhotoFile(null);
    setPhotoPreview(null);
    setIsEditing(true);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const { mutate: saveProfile, isPending } = useMutation({
    mutationFn: () =>
      updateMyProfile({
        name,
        phone,
        ...(photoFile ? { profilePhoto: photoFile } : {}),
      }),
    onSuccess: (updated) => {
      dispatch(
        updateUser({
          name: updated.name,
          phone: updated.phone,
          profilePhoto: updated.profilePhoto,
        })
      );
      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success('Profile updated successfully.');
      setIsEditing(false);
    },
    onError: () => {
      toast.error('Failed to update profile. Please try again.');
    },
  });

  return (
    <>
      {isLoading && (
        <div className='flex justify-center py-10'>
          <span className='size-8 border-2 border-primary-300/30 border-t-primary-300 rounded-full animate-spin' />
        </div>
      )}

      {isError && (
        <p className='text-sm text-accent-red text-center py-10 tracking-t-2'>
          Failed to load your profile.
        </p>
      )}

      {profile && (
        <div className='bg-white rounded-2xl shadow-card flex flex-col gap-xl md:gap-3xl p-xl md:p-2xl w-full mb-3.75 md:mb-[clamp(15.04px,calc(4.8px+1.333vw),24px)]'>
          <div className='flex flex-col gap-md md:gap-lg w-full'>
            {/* Avatar */}
            <button
              type='button'
              disabled={!isEditing}
              onClick={() => fileInputRef.current?.click()}
              onMouseEnter={() => setShowAvatarTooltip(true)}
              onMouseLeave={() => setShowAvatarTooltip(false)}
              className={`relative size-16 shrink-0 ${isEditing ? 'cursor-pointer' : ''}`}
            >
              <span className='block size-full rounded-full overflow-hidden'>
                {avatarUsable ? (
                  <img
                    src={avatarSrc}
                    alt={profile.name}
                    onError={handleAvatarError}
                    onLoad={handleAvatarLoad}
                    className='size-full object-cover'
                  />
                ) : (
                  <div className='size-full rounded-full border-2 border-neutral-300 bg-primary-150 text-primary-300 font-bold flex items-center justify-center'>
                    {profile.name.trim().slice(0, 2).toUpperCase()}
                  </div>
                )}
              </span>
              {isEditing && showAvatarTooltip && (
                <span className='pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-neutral-900 px-2 py-1 text-xs leading-tight text-white'>
                  {avatarUsable ? 'Click to change' : 'Click to upload'}
                </span>
              )}
            </button>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handlePhotoChange}
            />

            {/* Fields */}
            {isEditing ? (
              <>
                <InputField
                  id={`${idPrefix}-name`}
                  label='Name'
                  value={name}
                  onChange={setName}
                />
                <div className='flex items-center justify-between w-full text-sm md:text-md'>
                  <p className='font-medium text-neutral-950 tracking-t-3'>
                    Email
                  </p>
                  <p className='font-bold text-neutral-950 tracking-t-2'>
                    {profile.email}
                  </p>
                </div>
                <InputField
                  id={`${idPrefix}-phone`}
                  label='Nomor Handphone'
                  value={phone}
                  onChange={setPhone}
                />
              </>
            ) : (
              <>
                <div className='flex items-center justify-between w-full text-sm md:text-md'>
                  <p className='font-medium text-neutral-950 tracking-t-3'>
                    Name
                  </p>
                  <p className='font-bold text-neutral-950 tracking-t-2'>
                    {profile.name}
                  </p>
                </div>
                <div className='flex items-center justify-between w-full text-sm md:text-md'>
                  <p className='font-medium text-neutral-950 tracking-t-3'>
                    Email
                  </p>
                  <p className='font-bold text-neutral-950 tracking-t-2'>
                    {profile.email}
                  </p>
                </div>
                <div className='flex items-center justify-between w-full text-sm md:text-md'>
                  <p className='font-medium text-neutral-950 tracking-t-3'>
                    Nomor Handphone
                  </p>
                  <p className='font-bold text-neutral-950 tracking-t-2'>
                    {profile.phone || '-'}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          {isEditing ? (
            <div className='flex gap-md w-full'>
              <Button
                type='button'
                variant='outline'
                className='flex-1 h-11'
                disabled={isPending}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                type='button'
                variant='primary'
                className='flex-1 h-11'
                disabled={isPending}
                onClick={() => saveProfile()}
              >
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          ) : (
            <Button
              type='button'
              variant='primary'
              className='w-full h-11'
              onClick={startEditing}
            >
              Update Profile
            </Button>
          )}
        </div>
      )}

      {/* Loan stats */}
      {loanStats && (
        <div className='bg-white rounded-2xl shadow-card flex items-center gap-2xl p-xl md:p-2xl w-full'>
          <div className='flex flex-col flex-1'>
            <span className='font-bold text-neutral-950 tracking-t-3 md:tracking-t-none text-lg md:text-[clamp(18px,calc(11.14px+0.893vw),24px)]'>
              {loanStats.borrowed}
            </span>
            <span className='font-medium text-neutral-950 tracking-t-3 text-sm md:text-[clamp(14px,calc(11.71px+0.298vw),16px)]'>
              Borrowed
            </span>
          </div>
          <div className='w-px self-stretch bg-neutral-300' />
          <div className='flex flex-col flex-1'>
            <span className='font-bold text-neutral-950 tracking-t-3 md:tracking-t-none text-lg md:text-[clamp(18px,calc(11.14px+0.893vw),24px)]'>
              {loanStats.late}
            </span>
            <span className='font-medium text-neutral-950 tracking-t-3 text-sm md:text-[clamp(14px,calc(11.71px+0.298vw),16px)]'>
              Late
            </span>
          </div>
          <div className='w-px self-stretch bg-neutral-300' />
          <div className='flex flex-col flex-1'>
            <span className='font-bold text-neutral-950 tracking-t-3 md:tracking-t-none text-lg md:text-[clamp(18px,calc(11.14px+0.893vw),24px)]'>
              {loanStats.returned}
            </span>
            <span className='font-medium text-neutral-950 tracking-t-3 text-sm md:text-[clamp(14px,calc(11.71px+0.298vw),16px)]'>
              Returned
            </span>
          </div>
          <div className='w-px self-stretch bg-neutral-300' />
          <div className='flex flex-col flex-1'>
            <span className='font-bold text-neutral-950 tracking-t-3 md:tracking-t-none text-lg md:text-[clamp(18px,calc(11.14px+0.893vw),24px)]'>
              {loanStats.total}
            </span>
            <span className='font-medium text-neutral-950 tracking-t-3 text-sm md:text-[clamp(14px,calc(11.71px+0.298vw),16px)]'>
              Total
            </span>
          </div>
        </div>
      )}
    </>
  );
}
