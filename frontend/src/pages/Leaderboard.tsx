import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { LoadingState, ErrorState, Layout } from "../components";
import type { Region } from "../types";
import { REGION_LABELS } from "../types";
import "./Leaderboard.css";

const REGIONS: Region[] = ["na1", "euw1", "eun1", "kr", "br1", "la1", "la2"];

export function Leaderboard() {
  const navigate = useNavigate();
  const [region, setRegion] = useState<Region>("na1");
  const { data: leaderboard, loading, error, refetch } = useLeaderboard(region);

  return (
    <Layout>
      <div className="leaderboard-page">
        <header className="leaderboard-header">
          <div className="header-left">
            <button
              onClick={() => navigate("/")}
              className="back-btn glass-panel"
              aria-label="Back to search"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <h1 className="page-title">Regional Leaderboard</h1>
          </div>
          <div className="region-selector">
            <label htmlFor="region-select">Region:</label>
            <select
              id="region-select"
              value={region}
              onChange={(e) => setRegion(e.target.value as Region)}
              className="glass-select"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {REGION_LABELS[r]}
                </option>
              ))}
            </select>
          </div>
        </header>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : leaderboard ? (
          <div className="leaderboard-container glass-panel">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Summoner</th>
                  <th>LP Rank</th>
                  <th>Winrate Rank</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(leaderboard)
                  .sort(
                    ([, a], [, b]) => a.leaguePoints.top - b.leaguePoints.top,
                  )
                  .map(([name, stats], index) => (
                    <tr key={name} className="leaderboard-row">
                      <td className="rank-cell">#{index + 1}</td>
                      <td className="summoner-cell">{name}</td>
                      <td className="stat-cell">#{stats.leaguePoints.top}</td>
                      <td className="stat-cell">#{stats.winRate.top}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">No data available for this region.</div>
        )}
      </div>
    </Layout>
  );
}

export default Leaderboard;
