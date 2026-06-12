import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '@/services/api';

/**
 * Hook for watchlist CRUD operations.
 * Uses Clerk user ID to identify the user.
 * Falls back gracefully if auth is not available.
 */
export function useWatchlist() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const userId = user?.id || 'anonymous';

  const { data: watchlist = [], isLoading } = useQuery({
    queryKey: ['watchlist', userId],
    queryFn: () => getWatchlist(userId),
    staleTime: 60000,
    enabled: !!userId,
    retry: 1,
  });

  const addMutation = useMutation({
    mutationFn: (ticker: string) => addToWatchlist(userId, ticker),
    onSuccess: (_, ticker) => {
      queryClient.invalidateQueries({ queryKey: ['watchlist', userId] });
      toast.success(`Added ${ticker.toUpperCase()} to watchlist`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add to watchlist');
    },
  });

  const removeMutation = useMutation({
    mutationFn: (ticker: string) => removeFromWatchlist(userId, ticker),
    onSuccess: (_, ticker) => {
      queryClient.invalidateQueries({ queryKey: ['watchlist', userId] });
      toast.success(`Removed ${ticker.toUpperCase()} from watchlist`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove from watchlist');
    },
  });

  return {
    watchlist,
    isLoading,
    addTicker: (ticker: string) => addMutation.mutate(ticker),
    removeTicker: (ticker: string) => removeMutation.mutate(ticker),
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
}
