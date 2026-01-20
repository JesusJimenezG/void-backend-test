import "./DemaciaBackground.css";
import backgroundImage from "../assets/lol_background.jpg";

export function DemaciaBackground() {
  return (
    <div className="demacia-background">
      {/* Main background image */}
      <div
        className="background-image"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Dark gradient overlay for readability */}
      <div className="gradient-overlay" />

      {/* Petricite dust particles */}
      <div className="dust-container">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="dust-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
              opacity: 0.3 + Math.random() * 0.4,
            }}
          />
        ))}
      </div>

      {/* Golden motes */}
      <div className="motes-container">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="gold-mote"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Light rays from top-right */}
      <div className="light-rays" />

      {/* Vignette for depth */}
      <div className="vignette-overlay" />

      {/* Bottom fade for content */}
      <div className="bottom-fade" />
    </div>
  );
}

export default DemaciaBackground;
