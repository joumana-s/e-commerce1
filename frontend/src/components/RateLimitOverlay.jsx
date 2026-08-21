import { useRateLimit } from '../context/RateLimitContext';

export default function RateLimitOverlay() {
  const { cooldown } = useRateLimit();

  if (cooldown <= 0) return null;

  const minutes = Math.floor(cooldown / 60);
  const seconds = cooldown % 60;
  const timeLeft = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  return (
    <div className="rate-limit-overlay">
      <div className="rate-limit-modal">
        <h2>Too many requests</h2>
        <p>Please wait <strong>{timeLeft}</strong> before continuing.</p>
      </div>
    </div>
  );
}
