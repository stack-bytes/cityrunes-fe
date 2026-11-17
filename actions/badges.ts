import { supabase } from "@/lib/supabase";
import { Badge, UserBadgeRow } from "@/types/badge";
import { mapUserBadgeRows } from "@/utils/badgeMapper";

const USER_BADGES_TIMEOUT_MS = 8000;

export const fetchUserBadges = async (userId: string): Promise<Badge[]> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), USER_BADGES_TIMEOUT_MS);

  try {
    const { data, error } = await supabase
      .from("user_badges")
      .select("badges(*)")
      .eq("user_id", userId)
      .order("purchased_at")
      .abortSignal(controller.signal);

    if (error) {
      throw new Error(error.message);
    }

    return mapUserBadgeRows((data ?? []) as unknown as UserBadgeRow[]);
  } finally {
    clearTimeout(timeoutId);
  }
};
