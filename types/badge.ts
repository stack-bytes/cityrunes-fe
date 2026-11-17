export interface Badge {
  id: string;
  name: string;
  price: number;
  backgroundColor: string;
  imageId: string | null;
  imageUrl: string | null;
}

export interface BadgeRow {
  id: string;
  name: string;
  price: number;
  background_color: string;
  image_id: string | null;
  image_url: string | null;
}

export interface UserBadgeRow {
  badges: BadgeRow | null;
}
