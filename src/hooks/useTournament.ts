import { useQuery } from '@tanstack/react-query';
import { fetchTournament } from '../services/worldcupApi';
import type { TournamentState } from '../types/domain';

export const TOURNAMENT_QUERY_KEY = ['tournament'] as const;

export function useTournament() {
  return useQuery<TournamentState, Error>({
    queryKey: TOURNAMENT_QUERY_KEY,
    queryFn: ({ signal }) => fetchTournament(signal),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 2,
  });
}
