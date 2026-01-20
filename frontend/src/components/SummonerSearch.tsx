import { useState } from "react";
import type { Region } from "../types";
import { REGION_LABELS } from "../types";
import "./SummonerSearch.css";

interface SummonerSearchProps {
  onSearch: (region: Region, gameName: string, tagLine: string) => void;
  isCompact?: boolean;
  isLoading?: boolean;
  initialRegion?: Region;
  initialRiotId?: string;
}

const REGIONS: Region[] = [
  "na1",
  "euw1",
  "eun1",
  "kr",
  "jp1",
  "br1",
  "la1",
  "la2",
  "oc1",
  "tr1",
  "ru",
  "ph2",
  "sg2",
  "th2",
  "tw2",
  "vn2",
];

export function SummonerSearch({
  onSearch,
  isCompact = false,
  isLoading = false,
  initialRegion = "na1",
  initialRiotId = "",
}: SummonerSearchProps) {
  const [region, setRegion] = useState<Region>(initialRegion);
  const [riotId, setRiotId] = useState(initialRiotId);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse Riot ID (GameName#TagLine)
    const parts = riotId.trim().split("#");
    if (parts.length >= 2) {
      const gameName = parts[0].trim();
      const tagLine = parts.slice(1).join("#").trim();
      if (gameName && tagLine) {
        onSearch(region, gameName, tagLine);
      }
    }
  };

  // Validate Riot ID format
  const isValidFormat =
    riotId.includes("#") &&
    riotId.split("#")[0]?.trim() &&
    riotId.split("#")[1]?.trim();

  return (
    <div
      className={`summoner-search ${isCompact ? "summoner-search--compact" : ""}`}
    >
      {!isCompact && (
        <div className="search-header">
          <h1 className="search-title">
            <span className="title-main">Arcane Stats</span>
            <span className="title-subtitle">League of Legends Tracker</span>
          </h1>
          <p className="search-description">
            Track your progress, analyze your matches, and climb the ranks.
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={`search-form ${isFocused ? "search-form--focused" : ""}`}
      >
        <div className="search-input-group">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as Region)}
            className="region-select"
            aria-label="Select region"
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {REGION_LABELS[r]}
              </option>
            ))}
          </select>

          <div className="search-input-wrapper">
            <input
              type="text"
              value={riotId}
              onChange={(e) => setRiotId(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Riot ID (e.g., Player#NA1)"
              className="search-input"
              aria-label="Riot ID"
            />
            <div className="search-input-glow" />
          </div>

          <button
            type="submit"
            disabled={!isValidFormat || isLoading}
            className="search-button"
            aria-label="Search summoner"
          >
            {isLoading ? (
              <span className="search-spinner" />
            ) : (
              <svg
                className="search-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            )}
          </button>
        </div>

        {!isCompact && !isValidFormat && riotId && (
          <p className="search-hint">
            Enter a valid Riot ID with format: GameName#TagLine
          </p>
        )}
      </form>
    </div>
  );
}

export default SummonerSearch;
