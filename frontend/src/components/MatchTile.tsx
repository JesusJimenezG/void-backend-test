import { useState } from "react";
import type { MatchDTO } from "../types";
import "./MatchTile.css";

interface MatchTileProps {
  match: MatchDTO;
  puuid: string;
}

const DDRAGON_VERSION = "14.24.1";
const DDRAGON_BASE = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}`;

export function MatchTile({ match, puuid }: MatchTileProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const participant = match.info.participants.find((p) => p.puuid === puuid);
  if (!participant) return null;

  const isWin = participant.win;
  const kda =
    participant.deaths === 0
      ? "Perfect"
      : (
          (participant.kills + participant.assists) /
          participant.deaths
        ).toFixed(2);

  const gameDate = new Date(match.info.gameStartTimestamp);
  const gameDuration = Math.floor(match.info.gameDuration / 60);
  const cs = participant.totalMinionsKilled + participant.neutralMinionsKilled;
  const csPerMin = (cs / (match.info.gameDuration / 60)).toFixed(1);

  // Get item IDs (filter out 0 which means empty slot)
  const items = [
    participant.item0,
    participant.item1,
    participant.item2,
    participant.item3,
    participant.item4,
    participant.item5,
  ].filter((id) => id > 0);
  const trinket = participant.item6;

  return (
    <div
      className={`match-tile ${isWin ? "match-tile--win" : "match-tile--loss"}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* === COLLAPSED VIEW === */}
      <div className="match-tile-main">
        {/* Result indicator */}
        <div
          className={`match-result ${isWin ? "match-result--win" : "match-result--loss"}`}
        >
          <span className="result-text">{isWin ? "W" : "L"}</span>
        </div>

        {/* Champion */}
        <div className="match-champion">
          <img
            src={`${DDRAGON_BASE}/img/champion/${participant.championName}.png`}
            alt={participant.championName}
            className="champion-icon"
            loading="lazy"
          />
          <span className="champion-level">{participant.champLevel}</span>
        </div>

        {/* KDA */}
        <div className="match-kda">
          <div className="kda-score">
            <span className="kda-kills">{participant.kills}</span>
            <span className="kda-separator">/</span>
            <span className="kda-deaths">{participant.deaths}</span>
            <span className="kda-separator">/</span>
            <span className="kda-assists">{participant.assists}</span>
          </div>
          <span
            className={`kda-ratio ${parseFloat(kda) >= 3 ? "kda-ratio--good" : ""}`}
          >
            {kda} KDA
          </span>
        </div>

        {/* Stats */}
        <div className="match-stats">
          <div className="stat-item">
            <span className="stat-value">{cs}</span>
            <span className="stat-label">CS ({csPerMin}/m)</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{participant.visionScore}</span>
            <span className="stat-label">Vision</span>
          </div>
        </div>

        {/* Items */}
        <div className="match-items">
          <div className="items-grid">
            {items.map((itemId, index) => (
              <img
                key={index}
                src={`${DDRAGON_BASE}/img/item/${itemId}.png`}
                alt={`Item ${itemId}`}
                className="item-icon"
                loading="lazy"
              />
            ))}
            {trinket > 0 && (
              <img
                src={`${DDRAGON_BASE}/img/item/${trinket}.png`}
                alt="Trinket"
                className="item-icon item-icon--trinket"
                loading="lazy"
              />
            )}
          </div>
        </div>

        {/* Meta info */}
        <div className="match-meta">
          <span className="meta-duration">{gameDuration}m</span>
          <span className="meta-date">{formatDate(gameDate)}</span>
        </div>

        {/* Expand button */}
        <button
          className={`expand-button ${isExpanded ? "expand-button--active" : ""}`}
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>

      {/* === EXPANDED VIEW === */}
      {isExpanded && (
        <div className="match-tile-expanded">
          <div className="divider" />
          <div className="expanded-stats">
            <StatCard
              label="Damage Dealt"
              value={formatNumber(participant.totalDamageDealtToChampions)}
              icon="⚔️"
            />
            <StatCard
              label="Damage Taken"
              value={formatNumber(participant.totalDamageTaken)}
              icon="🛡️"
            />
            <StatCard
              label="Gold Earned"
              value={formatNumber(participant.goldEarned)}
              icon="💰"
            />
            <StatCard
              label="Wards Placed"
              value={participant.wardsPlaced.toString()}
              icon="👁️"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Helper components
function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="stat-card">
      <span className="stat-card-icon">{icon}</span>
      <span className="stat-card-value">{value}</span>
      <span className="stat-card-label">{label}</span>
    </div>
  );
}

// Utility functions
function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export default MatchTile;
