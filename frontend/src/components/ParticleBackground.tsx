import { useEffect, useRef } from "react";
import "./ParticleBackground.css";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  hue: number;
  saturation: number;
  lightness: number;
  pulsePhase: number;
  pulseSpeed: number;
}

interface EnergyOrb {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  hue: number;
  driftX: number;
  driftY: number;
  pulsePhase: number;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const orbsRef = useRef<EnergyOrb[]>([]);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const particleCount = Math.floor((canvas.width * canvas.height) / 12000);
      particlesRef.current = [];

      for (let i = 0; i < particleCount; i++) {
        // Mix of cyan, gold, and purple particles
        const colorRoll = Math.random();
        let hue: number, saturation: number, lightness: number;

        if (colorRoll < 0.5) {
          // Cyan/teal (hextech)
          hue = 175 + Math.random() * 15;
          saturation = 85 + Math.random() * 15;
          lightness = 55 + Math.random() * 15;
        } else if (colorRoll < 0.8) {
          // Gold
          hue = 40 + Math.random() * 10;
          saturation = 65 + Math.random() * 20;
          lightness = 55 + Math.random() * 15;
        } else {
          // Purple (arcane)
          hue = 270 + Math.random() * 20;
          saturation = 70 + Math.random() * 20;
          lightness = 55 + Math.random() * 15;
        }

        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2.5 + 0.5,
          speedY: -(Math.random() * 0.4 + 0.15),
          speedX: (Math.random() - 0.5) * 0.25,
          opacity: Math.random() * 0.4 + 0.15,
          hue,
          saturation,
          lightness,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.01 + Math.random() * 0.02,
        });
      }
    };

    const createOrbs = () => {
      const orbCount = 5;
      orbsRef.current = [];

      for (let i = 0; i < orbCount; i++) {
        const hue = Math.random() > 0.5 ? 175 : 270; // Cyan or purple
        orbsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 100 + Math.random() * 150,
          opacity: 0.03 + Math.random() * 0.03,
          hue,
          driftX: (Math.random() - 0.5) * 0.3,
          driftY: (Math.random() - 0.5) * 0.3,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    const animate = () => {
      timeRef.current += 0.016;

      // Clear with the deep arcane background
      ctx.fillStyle = "rgba(10, 14, 26, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw energy orbs (background glow)
      orbsRef.current.forEach((orb) => {
        orb.x += orb.driftX;
        orb.y += orb.driftY;
        orb.pulsePhase += 0.005;

        // Wrap around screen
        if (orb.x < -orb.radius) orb.x = canvas.width + orb.radius;
        if (orb.x > canvas.width + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = canvas.height + orb.radius;
        if (orb.y > canvas.height + orb.radius) orb.y = -orb.radius;

        const pulseFactor = 0.7 + Math.sin(orb.pulsePhase) * 0.3;
        const gradient = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius * pulseFactor,
        );

        gradient.addColorStop(
          0,
          `hsla(${orb.hue}, 80%, 50%, ${orb.opacity * pulseFactor})`,
        );
        gradient.addColorStop(
          0.5,
          `hsla(${orb.hue}, 80%, 40%, ${orb.opacity * 0.3 * pulseFactor})`,
        );
        gradient.addColorStop(1, `hsla(${orb.hue}, 80%, 30%, 0)`);

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius * pulseFactor, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Draw particles
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.y += particle.speedY;
        particle.x +=
          particle.speedX +
          Math.sin(timeRef.current + particle.pulsePhase) * 0.1;
        particle.pulsePhase += particle.pulseSpeed;

        // Reset particle when it goes off screen
        if (particle.y < -10) {
          particle.y = canvas.height + 10;
          particle.x = Math.random() * canvas.width;
        }

        // Pulsing opacity
        const pulseOpacity =
          particle.opacity * (0.7 + Math.sin(particle.pulsePhase) * 0.3);

        // Draw outer glow
        const glowGradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 4,
        );
        glowGradient.addColorStop(
          0,
          `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness}%, ${pulseOpacity})`,
        );
        glowGradient.addColorStop(
          0.4,
          `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness}%, ${pulseOpacity * 0.4})`,
        );
        glowGradient.addColorStop(
          1,
          `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness}%, 0)`,
        );

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        // Draw core particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness + 15}%, ${pulseOpacity + 0.3})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createParticles();
    createOrbs();
    animate();

    const handleResize = () => {
      resizeCanvas();
      createParticles();
      createOrbs();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="particle-background">
      <canvas ref={canvasRef} className="particle-canvas" />
      <div className="gradient-overlay" />
      <div className="rune-overlay" />
      <div className="energy-lines" />
      <div className="vignette-overlay" />
      <div className="top-fade" />
    </div>
  );
}

export default ParticleBackground;
