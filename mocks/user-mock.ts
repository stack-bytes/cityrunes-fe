import { User } from "@/types/user";

export const MOCK_USER: User = {
  id: "user-1",
  username: "Rares Catana",
  email: "rares_catana@example.com",
  password: "securepassword123",
  photos: [
    "https://example.com/photos/rares_catana_1.jpg",
    "https://example.com/photos/rares_catana_2.jpg",
  ],
  badges: [],
  coins: 0,
};
