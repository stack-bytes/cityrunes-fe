import { Badge } from "./badge";

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  photos: string[];
  badges: Badge[];
  coins: number;
}
