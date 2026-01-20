import { useState, useEffect } from "react";
import type {
  SummaryDTO,
  LeagueEntryDTO,
  MatchDTO,
  MatchParticipantDTO,
  Region,
} from "../types";
import { REGION_LABELS } from "../types";
import { MatchTile } from "./MatchTile";
import { PerformanceStats } from "./PerformanceStats";
import "./SummonerDashboard.css";

interface SummonerDashboardProps {
  summary: SummaryDTO;
  region: string;
  gameName: string;
  tagLine: string;
}

const DDRAGON_VERSION = "14.24.1";
const DDRAGON_BASE = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}`;

export function SummonerDashboard({
  summary,
  region,
  gameName,
  tagLine,
}: SummonerDashboardProps) {
  const { summoner, rankedEntries, recentMatches: initialMatches } = summary;

  // Integrated Match History State
  const [matches, setMatches] = useState<MatchDTO[]>(initialMatches || []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(
    initialMatches ? initialMatches.length >= 10 : false,
  );
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Sync internal state when summary prop updates (e.g. searching a new player)
  useEffect(() => {
    setMatches(initialMatches || []);
    setPage(1);
    setHasMore(initialMatches ? initialMatches.length >= 10 : false);
  }, [summoner.puuid, initialMatches]);

  // Calculate stats from ALL loaded matches
  const stats =
    matches.length > 0 ? calculateStats(matches, summoner.puuid) : null;

  const handleLoadMore = async () => {
    if (isFetchingMore || !hasMore) return;

    setIsFetchingMore(true);
    const nextPage = page + 1;
    const query = new URLSearchParams({
      page: nextPage.toString(),
      take: "10",
      queueId: "ALL",
      order: "DESC",
    });

    // URL path without the /api prefix - we'll add it via BASE_URL
    const matchPath = `/match/${region}/${encodeURIComponent(displayName)}/${encodeURIComponent(displayTag)}?${query}`;

    try {
      // Use strict undefined check for VITE_API_URL (empty string = relative path for production)
      const baseUrl =
        import.meta.env.VITE_API_URL !== undefined
          ? import.meta.env.VITE_API_URL
          : "http://localhost:4000";
      // Construct full URL: baseUrl + "/api" + matchPath
      const response = await fetch(`${baseUrl}/api${matchPath}`);
      if (!response.ok) throw new Error("Failed to load more matches");

      const result = await response.json();
      // The endpoint returns a paginated object { data: MatchDTO[], meta: ... }
      const newMatches: MatchDTO[] = result.data;

      if (newMatches && newMatches.length > 0) {
        setMatches((prev: MatchDTO[]) => [...prev, ...newMatches]);
        setPage(nextPage);
        setHasMore(newMatches.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  // Find Solo/Duo ranked entry
  const soloQueue = rankedEntries.find(
    (e) => e.queueType === "RANKED_SOLO_5x5",
  );
  // Find Flex ranked entry
  const flexQueue = rankedEntries.find((e) => e.queueType === "RANKED_FLEX_SR");

  // Get display name and tag robustly
  // Get display name and tag robustly - prioritize search terms if API is light
  const displayName =
    summoner.gameName || gameName || summoner.name?.split("#")[0] || "Summoner";
  const displayTag =
    summoner.tagLine || tagLine || summoner.name?.split("#")[1] || "";

  return (
    <div className="summoner-dashboard">
      {/* === HEADER === */}
      <header className="dashboard-header">
        <div className="header-profile">
          <div className="profile-icon-wrapper">
            <img
              src={`${DDRAGON_BASE}/img/profileicon/${summoner.profileIconId}.png`}
              alt="Profile Icon"
              className="profile-icon"
            />
            <span className="profile-level">{summoner.summonerLevel}</span>
            <div className="profile-icon-glow" />
          </div>
          <div className="profile-info">
            <div className="search-badge">
              <span className="region-tag">
                {REGION_LABELS[region as Region] || region}
              </span>
            </div>
            <h1 className="summoner-name">
              {displayName}
              <span className="summoner-tag">#{displayTag}</span>
            </h1>
            <p className="summoner-level-text">
              Level {summoner.summonerLevel}
            </p>
          </div>
        </div>
      </header>

      {/* === MAIN CONTENT === */}
      <main className="dashboard-content">
        {/* Left: Ranked Stats */}
        <aside className="ranked-section">
          <h2 className="section-title">
            <span className="section-title-icon">🏆</span>
            Ranked Stats
          </h2>
          <div className="ranked-cards">
            <RankedCard entry={soloQueue} queueName="Solo/Duo" />
            <RankedCard entry={flexQueue} queueName="Flex" />
          </div>
        </aside>

        {/* Center: Performance & Match History */}
        <div className="center-column">
          {stats && (
            <section className="performance-section">
              <PerformanceStats
                kda={stats.kda}
                winRate={stats.winRate}
                avgKills={stats.avgKills}
                avgDeaths={stats.avgDeaths}
                avgAssists={stats.avgAssists}
                totalGames={stats.totalGames}
              />
            </section>
          )}

          <section className="matches-section">
            <div className="section-header-row">
              <h2 className="section-title">
                <span className="section-title-icon">⚔️</span>
                Recent Matches
              </h2>
            </div>
            <div className="matches-list">
              {matches.length > 0 ? (
                <>
                  {matches.map((match) => (
                    <MatchTile
                      key={match.metadata.matchId}
                      match={match}
                      puuid={summoner.puuid}
                    />
                  ))}
                  {hasMore && (
                    <div className="load-more-container">
                      <button
                        className="load-more-btn glass-panel"
                        onClick={handleLoadMore}
                        disabled={isFetchingMore}
                      >
                        {isFetchingMore ? (
                          <>
                            <span className="spinner-small" /> Loading...
                          </>
                        ) : (
                          "Load More Matches"
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="empty-matches glass-panel">
                  <span className="empty-icon">📭</span>
                  <p>No recent matches found</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

// Ranked Card Component
interface RankedCardProps {
  entry?: LeagueEntryDTO;
  queueName: string;
}

function RankedCard({ entry, queueName }: RankedCardProps) {
  const winRate = entry
    ? ((entry.wins / (entry.wins + entry.losses)) * 100).toFixed(1)
    : 0;

  return (
    <div className="ranked-card glass-panel">
      <div className="ranked-header">
        <span className="queue-name">{queueName}</span>
        {entry?.hotStreak && <span className="hot-streak">🔥 Hot Streak</span>}
      </div>

      {entry ? (
        <>
          <div className="rank-display">
            <img
              src={`/ranks/${entry.tier.toLowerCase()}.png`}
              alt={entry.tier}
              className="rank-emblem"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="rank-info">
              <span className="rank-tier">
                {entry.tier} {entry.rank}
              </span>
              <span className="rank-lp">{entry.leaguePoints} LP</span>
            </div>
          </div>

          <div className="ranked-stats">
            <div className="win-loss">
              <span className="wins">{entry.wins}W</span>
              <span className="losses">{entry.losses}L</span>
            </div>
            <div className="winrate">
              <div className="winrate-bar">
                <div
                  className="winrate-fill"
                  style={{ width: `${winRate}%` }}
                />
              </div>
              <span className="winrate-text">{winRate}% WR</span>
            </div>
          </div>
        </>
      ) : (
        <div className="unranked">
          <span className="unranked-text">Unranked</span>
          <p className="unranked-hint">Play ranked games to get placed</p>
        </div>
      )}
    </div>
  );
}

export default SummonerDashboard;

// Helper to calculate stats
function calculateStats(matches: MatchDTO[], puuid: string) {
  let wins = 0;
  let kills = 0;
  let deaths = 0;
  let assists = 0;

  matches.forEach((m) => {
    const p = m.info.participants.find(
      (p: MatchParticipantDTO) => p.puuid === puuid,
    );
    if (p) {
      if (p.win) wins++;
      kills += p.kills;
      deaths += p.deaths;
      assists += p.assists;
    }
  });

  const total = matches.length;
  const winRate = ((wins / total) * 100).toFixed(0);
  const kda =
    deaths === 0 ? "Perfect" : ((kills + assists) / deaths).toFixed(2);

  return {
    kda,
    winRate,
    avgKills: kills / total,
    avgDeaths: deaths / total,
    avgAssists: assists / total,
    totalGames: total,
  };
}
