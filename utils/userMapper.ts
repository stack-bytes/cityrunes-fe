import { User, UserRow } from "@/types/user";

export const mapUserRow = (row: UserRow): User => ({
  id: row.id,
  username: row.username,
  email: row.email,
  avatarUrl: row.avatar_url,
  badges: [],
  coins: row.coins,
});
