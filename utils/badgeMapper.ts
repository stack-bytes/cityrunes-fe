import { Badge, BadgeRow, UserBadgeRow } from "@/types/badge";

export const mapBadgeRow = (row: BadgeRow): Badge => ({
  id: row.id,
  name: row.name,
  price: row.price,
  backgroundColor: row.background_color,
  imageId: row.image_id,
  imageUrl: row.image_url,
});

export const mapUserBadgeRows = (rows: UserBadgeRow[]): Badge[] =>
  rows
    .map((row) => row.badges)
    .filter((badge): badge is BadgeRow => badge !== null)
    .map(mapBadgeRow);
