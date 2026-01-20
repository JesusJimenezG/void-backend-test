import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useMatches } from "../hooks/useMatches";
import { MatchTile, LoadingState, ErrorState, Layout } from "../components";
import type { Region, MatchDTO, MatchParticipantDTO } from "../types";
import "./MatchHistory.css";

export function MatchHistory() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const region = searchParams.get("region") as Region;
  const rawGameName = searchParams.get("gameName") || "";
  const rawTagLine = searchParams.get("tagLine") || "";

  // Robustly parse name if it contains #
  const [gameName, tagLine] = rawGameName.includes("#")
    ? [rawGameName.split("#")[0], rawGameName.split("#")[1]]
    : [rawGameName, rawTagLine];

  const {
    data: response,
    loading,
    error,
    refetch,
  } = useMatches(region, gameName, tagLine, { page, take: 10 });

  const matches = response?.data || [];

  if (!region || !gameName || !tagLine) {
    return (
      <Layout>
        <ErrorState
          message="Missing summoner information. Please search again."
          onRetry={() => navigate("/")}
        />
      </Layout>
    );
  }

  const handleNextPage = () => setPage((p) => p + 1);
  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));

  return (
    <Layout>
      <div className="match-history-page">
        <header className="history-header">
          <button onClick={() => navigate(-1)} className="back-link">
            ← Back to Dashboard
          </button>
          <h1 className="history-title">
            Match History:{" "}
            <span className="highlight-name">
              {gameName}#{tagLine}
            </span>
          </h1>
        </header>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : matches && matches.length > 0 ? (
          <div className="history-list">
            {matches.map((match: MatchDTO) => (
              <MatchTile
                key={match.metadata.matchId}
                match={match}
                puuid={
                  match.info.participants.find(
                    (p: MatchParticipantDTO) =>
                      p.riotIdGameName?.toLowerCase() ===
                        gameName.toLowerCase() &&
                      p.riotIdTagline?.toLowerCase() === tagLine.toLowerCase(),
                  )?.puuid || ""
                }
                // Note: The puuid logic here is a bit tricky if we filter participant by name.
                // ideally useMatches should return the puuid context or we get it from local storage/url if safe.
                // For now, attempting to find self in participant list by name match.
              />
            ))}

            <div className="pagination-controls">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              <span className="page-indicator">Page {page}</span>
              <button
                onClick={handleNextPage}
                disabled={matches.length < 10}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-history glass-panel">
            <p>No matches found.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default MatchHistory;
