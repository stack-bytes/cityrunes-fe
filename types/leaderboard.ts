export interface LeaderboardUser {
  id: string;
  username: string;
  points: number;
  avatar?: any;
}

export interface TrackLeaderboard {
  trackId: string;
  users: LeaderboardUser[];
}

export interface UserTrackPoints {
  userId: string;
  trackId: string;
  points: number;
}
