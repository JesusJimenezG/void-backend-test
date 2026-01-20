// Region types matching Riot API
export type Region =
  | "na1"
  | "euw1"
  | "eun1"
  | "kr"
  | "jp1"
  | "br1"
  | "la1"
  | "la2"
  | "oc1"
  | "tr1"
  | "ru"
  | "ph2"
  | "sg2"
  | "th2"
  | "tw2"
  | "vn2";

export const REGION_LABELS: Record<Region, string> = {
  na1: "North America",
  euw1: "Europe West",
  eun1: "Europe Nordic & East",
  kr: "Korea",
  jp1: "Japan",
  br1: "Brazil",
  la1: "Latin America North",
  la2: "Latin America South",
  oc1: "Oceania",
  tr1: "Turkey",
  ru: "Russia",
  ph2: "Philippines",
  sg2: "Singapore",
  th2: "Thailand",
  tw2: "Taiwan",
  vn2: "Vietnam",
};

// Ranked types
export type QueueType = "RANKED_SOLO_5x5" | "RANKED_FLEX_SR" | "RANKED_TFT";
export type RankedTier =
  | "IRON"
  | "BRONZE"
  | "SILVER"
  | "GOLD"
  | "PLATINUM"
  | "EMERALD"
  | "DIAMOND"
  | "MASTER"
  | "GRANDMASTER"
  | "CHALLENGER";

export type RankedDivision = "I" | "II" | "III" | "IV";

// Summoner DTO
export interface SummonerDTO {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
  gameName?: string;
  tagLine?: string;
}

// League Entry DTO
export interface LeagueEntryDTO {
  leagueId: string;
  puuid: string;
  summonerId: string;
  summonerName: string;
  queueType: QueueType;
  tier: RankedTier;
  rank: RankedDivision;
  leaguePoints: number;
  wins: number;
  losses: number;
  hotStreak: boolean;
  veteran: boolean;
  freshBlood: boolean;
  inactive: boolean;
}

// Match participant DTO
export interface MatchParticipantDTO {
  puuid: string;
  summonerName: string;
  summonerId: string;
  summonerLevel: number;
  championId: number;
  championName: string;
  champLevel: number;
  teamId: number;
  teamPosition: string;
  role: string;
  lane: string;
  kills: number;
  deaths: number;
  assists: number;
  totalDamageDealtToChampions: number;
  totalDamageTaken: number;
  goldEarned: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
  visionScore: number;
  wardsPlaced: number;
  wardsKilled: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  summoner1Id: number;
  summoner2Id: number;
  win: boolean;
  riotIdGameName?: string;
  riotIdTagline?: string;
}

// Match team DTO
export interface MatchTeamDTO {
  teamId: number;
  win: boolean;
  bans: { championId: number; pickTurn: number }[];
  objectives: {
    baron: { first: boolean; kills: number };
    champion: { first: boolean; kills: number };
    dragon: { first: boolean; kills: number };
    inhibitor: { first: boolean; kills: number };
    riftHerald: { first: boolean; kills: number };
    tower: { first: boolean; kills: number };
  };
}

// Match info DTO
export interface MatchInfoDTO {
  gameCreation: number;
  gameDuration: number;
  gameEndTimestamp: number;
  gameId: number;
  gameMode: string;
  gameName: string;
  gameStartTimestamp: number;
  gameType: string;
  gameVersion: string;
  mapId: number;
  queueId: number;
  participants: MatchParticipantDTO[];
  teams: MatchTeamDTO[];
}

// Match DTO
export interface MatchDTO {
  metadata: {
    matchId: string;
    dataVersion: string;
    participants: string[];
  };
  info: MatchInfoDTO;
}

// Summary DTO (custom)
export interface SummaryDTO {
  summoner: SummonerDTO;
  rankedEntries: LeagueEntryDTO[];
  recentMatches: MatchDTO[];
}

// Champion Mastery DTO
export interface ChampionMasteryDTO {
  championId: number;
  championLevel: number;
  championPoints: number;
  lastPlayTime: number;
  championPointsSinceLastLevel: number;
  championPointsUntilNextLevel: number;
  chestGranted: boolean;
  tokensEarned: number;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

// Search state
export interface SearchState {
  region: Region;
  gameName: string;
  tagLine: string;
}
