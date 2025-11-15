import { Coordinates } from "expo-maps";
import { Road } from "./road";

export interface Place {
  id: string;
  name: string;
  coordinates: Coordinates;
  photos?: string[];
  description: string;
  icon: string;
  reward: number;
  roads?: Road[];
}
