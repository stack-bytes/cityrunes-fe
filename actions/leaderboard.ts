import { environment } from "@/environment";
import { TrackLeaderboard } from "@/types/leaderboard";

export const fetchTrackLeaderboard = async (
  trackId: string
): Promise<TrackLeaderboard> => {
  const url = new URL(`${environment.supabaseUrl}/functions/v1/get-leaderboard`);
  url.searchParams.set("trackId", trackId);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${environment.supabasePublishableKey}`,
      apikey: environment.supabasePublishableKey,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `HTTP error! status: ${response.status}`);
  }

  return response.json();
};
