import {} from "react";
import type { Region } from "../types";
import {
  Layout,
  SummonerSearch,
  SummonerDashboard,
  LoadingState,
  ErrorState,
} from "../components";
import { useSearchParams, Link } from "react-router-dom";
import { useSummary } from "../hooks";
import "./Home.css";

export function Home() {
  const [urlParams, setUrlParams] = useSearchParams();

  const region = urlParams.get("region") as Region | null;
  const gameName = urlParams.get("gameName") || "";
  const tagLine = urlParams.get("tagLine") || "";

  const hasSearched = !!(region && gameName && tagLine);

  const {
    data: summary,
    loading,
    error,
    refetch,
  } = useSummary(region, gameName, tagLine);

  const handleSearch = (region: Region, gameName: string, tagLine: string) => {
    setUrlParams({ region, gameName, tagLine });
  };

  const handleBackToSearch = () => {
    setUrlParams({});
  };

  return (
    <Layout>
      {/* Show search in compact mode when we have results */}
      {hasSearched && (
        <header className="search-header-bar">
          <button
            className="back-button"
            onClick={handleBackToSearch}
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
          <SummonerSearch
            onSearch={handleSearch}
            isCompact
            isLoading={loading}
            initialRegion={region as Region}
            initialRiotId={`${gameName}#${tagLine}`}
          />
        </header>
      )}

      {!hasSearched && (
        <div className="top-nav">
          <Link to="/leaderboard" className="nav-link">
            🏆 Leaderboard
          </Link>
        </div>
      )}

      {/* Main content area */}
      <div className="home-content">
        {!hasSearched ? (
          /* Hero search */
          <div className="hero-section">
            <SummonerSearch
              onSearch={handleSearch}
              isLoading={loading}
              initialRegion={(region as Region) || "na1"}
              initialRiotId={
                gameName && tagLine ? `${gameName}#${tagLine}` : ""
              }
            />

            {/* Features section */}
            <div className="features-section">
              <FeatureCard
                icon="📊"
                title="Match History"
                description="Track your recent games with detailed stats"
              />
              <FeatureCard
                icon="🏆"
                title="Ranked Stats"
                description="Monitor your climb through the ranks"
              />
              <FeatureCard
                icon="⚔️"
                title="Performance"
                description="Analyze KDA, damage, and more"
              />
            </div>
          </div>
        ) : loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : summary ? (
          <SummonerDashboard
            summary={summary}
            region={region as string}
            gameName={gameName}
            tagLine={tagLine}
          />
        ) : null}
      </div>
    </Layout>
  );
}

// Feature Card Component
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="feature-card glass-panel">
      <span className="feature-icon">{icon}</span>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );
}

export default Home;
