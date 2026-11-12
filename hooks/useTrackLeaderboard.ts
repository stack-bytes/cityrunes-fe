import { fetchTrackLeaderboard } from "@/actions/leaderboard";
import { useQuery } from "@tanstack/react-query";

export const useTrackLeaderboard = (trackId: string) =>
  useQuery({
    queryKey: ["leaderboard", trackId],
    queryFn: () => fetchTrackLeaderboard(trackId),
    enabled: !!trackId,
    staleTime: 0,
  });
