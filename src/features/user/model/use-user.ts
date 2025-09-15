import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../api/user-api';
import { queryKeys } from '@/shared/queryKeys';
import type { UserResponse } from '@/entities/user/model/user';

export const useUser = <T extends UserResponse>() => {
  const { data, ...rest } = useQuery<T>({
    queryKey: queryKeys.user.all.queryKey,
    queryFn: getUsers,
  });

  return { users: data, ...rest };
};
