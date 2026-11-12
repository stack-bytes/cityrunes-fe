import { Badge } from "./badge";

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  badges: Badge[];
  coins: number;
}

export interface UserRow {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  coins: number;
  created_at: string;
}
