import "./LoadingState.css";

export function LoadingState() {
  return (
    <div className="loading-state">
      <div className="loading-content">
        {/* Hextech spinner */}
        <div className="hextech-spinner">
          <div className="spinner-ring spinner-ring-1" />
          <div className="spinner-ring spinner-ring-2" />
          <div className="spinner-ring spinner-ring-3" />
          <div className="spinner-core" />
        </div>

        <p className="loading-text">
          <span className="loading-text-main">Summoning Data</span>
          <span className="loading-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoadingState;
