export interface LeaderboardUser {
  id: string;
  username: string;
  coins: number;
  avatar?: any;
}

export const MOCK_LEADERBOARD_USERS: LeaderboardUser[] = [
  {
    id: "user-2",
    username: "Andrei",
    coins: 120,
    avatar: require("../assets/images/popa.jpg"),
  },
  {
    id: "user-3",
    username: "Adrian",
    coins: 95,
    avatar: require("../assets/images/raul.jpeg"),
  },
  {
    id: "user-4",
    username: "Alexia",
    coins: 75,
    avatar: require("../assets/images/alexia.jpg"),
  },
  {
    id: "user-5",
    username: "Stefan",
    coins: 50,
    avatar: require("../assets/images/adi.png"),
  },
];
