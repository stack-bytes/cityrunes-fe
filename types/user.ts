import { Badge } from "./badge";

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  badges: Badge[];
  coins: number;
}
