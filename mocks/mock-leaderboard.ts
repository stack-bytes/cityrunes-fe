export interface LeaderboardUser {
  id: string;
  username: string;
  coins: number;
  avatar?: any;
}

export const MOCK_LEADERBOARD_USERS: LeaderboardUser[] = [
  {
    id: "user-1",
    username: "Rares Catana",
    coins: 0,
    avatar: require("../assets/images/raresc4.png"),
  },
  {
    id: "user-2",
    username: "ADNREI",
    coins: 120,
    avatar: require("../assets/images/raresc4.png"),
  },
  {
    id: "user-3",
    username: "Lucian",
    coins: 95,
    avatar: require("../assets/images/raresc4.png"),
  },
  {
    id: "user-4",
    username: "MArian",
    coins: 75,
    avatar: require("../assets/images/raresc4.png"),
  },
  {
    id: "user-5",
    username: "Alexandra",
    coins: 65,
    avatar: require("../assets/images/raresc4.png"),
  },
  {
    id: "user-6",
    username: "Stefan",
    coins: 50,
    avatar: require("../assets/images/raresc4.png"),
  },
  {
    id: "user-7",
    username: "Elena",
    coins: 45,
    avatar: require("../assets/images/raresc4.png"),
  },
];
