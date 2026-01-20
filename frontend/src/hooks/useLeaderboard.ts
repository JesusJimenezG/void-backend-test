import { useFetch } from "./useFetch";
import type { Region } from "../types";

export interface LeaderboardEntry {
  leaguePoints: { top: number };
  winRate: { top: number };
}

export type LeaderboardData = Record<string, LeaderboardEntry>;

export function useLeaderboard(region: Region) {
  const url = region ? `/summary/${region}/leaderboard` : null;
  return useFetch<LeaderboardData>(url, { immediate: !!url });
}

export default useLeaderboard;
