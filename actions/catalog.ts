import { supabase } from "@/lib/supabase";
import { BadgeRow } from "@/types/badge";
import { Catalog, PlaceRow, QuestRow, RoadRow } from "@/types/catalog";
import { buildCatalog } from "@/utils/catalogMapper";

const CATALOG_TIMEOUT_MS = 8000;

export const fetchCatalog = async (): Promise<Catalog> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CATALOG_TIMEOUT_MS);

  try {
    const [roadsResult, placesResult, questsResult, badgesResult] =
      await Promise.all([
        supabase
          .from("roads")
          .select(
            "id, name, description, leaderboard_id, road_places(place_id, position)"
          )
          .order("id")
          .abortSignal(controller.signal),
        supabase.from("places").select("*").abortSignal(controller.signal),
        supabase
          .from("quests")
          .select("*, quiz_questions(*)")
          .abortSignal(controller.signal),
        supabase
          .from("badges")
          .select("*")
          .order("price")
          .order("id")
          .abortSignal(controller.signal),
      ]);

    const failure =
      roadsResult.error ??
      placesResult.error ??
      questsResult.error ??
      badgesResult.error;
    if (failure) {
      throw new Error(failure.message);
    }

    const catalog = buildCatalog(
      (roadsResult.data ?? []) as RoadRow[],
      (placesResult.data ?? []) as PlaceRow[],
      (questsResult.data ?? []) as QuestRow[],
      (badgesResult.data ?? []) as BadgeRow[]
    );

    if (
      catalog.roads.length === 0 ||
      catalog.places.length === 0 ||
      catalog.badges.length === 0
    ) {
      throw new Error("The database returned no roads, places, or badges");
    }

    return catalog;
  } finally {
    clearTimeout(timeoutId);
  }
};
