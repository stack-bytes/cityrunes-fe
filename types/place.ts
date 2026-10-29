export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Place {
  id: string;
  name: string;
  coordinates: Coordinates;
  description: string;
  icon: string;
  reward: number;
  imageId: string | null;
  imageUrl: string | null;
}
