import { Road } from "./road";
import { User } from "./user";

export interface Leaderboard {
  id: string;
  users: User[];
  road: Road;
}
