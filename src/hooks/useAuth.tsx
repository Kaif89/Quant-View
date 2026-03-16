import { useUser, useClerk } from '@clerk/clerk-react';
import { useCallback, useMemo } from 'react';

export function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser();
  const clerk = useClerk();

  const logout = useCallback(() => {
    clerk.signOut();
  }, [clerk]);

  const authUser = useMemo(() => {
    if (!user) return null;
    return {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress || '',
      name: user.fullName || undefined,
    };
  }, [user]);

  return {
    user: authUser,
    isLoading: !isLoaded,
    isAuthenticated: !!isSignedIn,
    logout,
  };
}
