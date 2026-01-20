import "./PerformanceStats.css";

interface PerformanceStatsProps {
  kda: string;
  winRate: string;
  avgKills: number;
  avgDeaths: number;
  avgAssists: number;
  totalGames: number;
}

export function PerformanceStats({
  kda,
  winRate,
  avgKills,
  avgDeaths,
  avgAssists,
  totalGames,
}: PerformanceStatsProps) {
  const winRateNum = parseFloat(winRate);
  const kdaNum = parseFloat(kda);

  return (
    <div className="performance-stats glass-panel">
      <h3 className="stats-title">Performance</h3>

      <div className="stats-grid">
        <div className="stat-circle-container">
          <div className="kda-display">
            <span
              className={`kda-value ${kdaNum >= 3 ? "good" : kdaNum >= 5 ? "excellent" : ""}`}
            >
              {kda}
            </span>
            <span className="kda-label">KDA</span>
          </div>
        </div>

        <div className="stats-details">
          <div className="detail-row">
            <span className="detail-label">Win Rate</span>
            <div className="detail-bar-container">
              <div
                className="detail-bar"
                style={{
                  width: `${winRateNum}%`,
                  backgroundColor:
                    winRateNum >= 50 ? "var(--win-green)" : "var(--loss-red)",
                }}
              />
            </div>
            <span className="detail-value">{winRate}%</span>
          </div>

          <div className="detail-averages">
            <div className="avg-item">
              <span className="avg-value kills">{avgKills.toFixed(1)}</span>
              <span className="avg-label">Kills</span>
            </div>
            <div className="avg-item">
              <span className="avg-value deaths">{avgDeaths.toFixed(1)}</span>
              <span className="avg-label">Deaths</span>
            </div>
            <div className="avg-item">
              <span className="avg-value assists">{avgAssists.toFixed(1)}</span>
              <span className="avg-label">Assists</span>
            </div>
          </div>

          <div className="total-games">
            <span>{totalGames} Games Played</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerformanceStats;
