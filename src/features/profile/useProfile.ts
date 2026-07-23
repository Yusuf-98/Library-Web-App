import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getMyProfile, updateMyProfile } from '@/lib/api/users';
import { queryKeys } from '@/lib/queryKeys';
import { getErrorMessage } from '@/lib/utils';
import { useAppDispatch } from '@/app/hooks';
import { updateUser } from '@/features/auth/authSlice';

export function useMyProfile() {
  return useQuery({
    queryKey: queryKeys.me.all,
    queryFn: getMyProfile,
  });
}

interface UpdateProfilePayload {
  name: string;
  phone: string;
  profilePhoto?: File;
}

export function useUpdateProfileMutation() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateMyProfile(payload),
    onSuccess: (updated) => {
      dispatch(
        updateUser({
          name: updated.name,
          phone: updated.phone,
          profilePhoto: updated.profilePhoto,
        })
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.me.all });
      toast.success('Profile updated successfully.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update profile. Please try again.'));
    },
  });
}
