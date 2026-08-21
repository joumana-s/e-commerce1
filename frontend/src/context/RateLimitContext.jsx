import { createContext, useContext, useEffect, useState } from 'react';

const RateLimitContext = createContext(null);

export function RateLimitProvider({ children }) {
  const [cooldown, setCooldown] = useState(0);
  const [retryAfter, setRetryAfter] = useState(null);

  useEffect(() => {
    let timer = null;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((c) => Math.max(0, c - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    const handler = (e) => {
      setRetryAfter(e.detail.retryAfter);
      setCooldown(e.detail.retryAfter);
    };
    window.addEventListener('rate-limit', handler);
    return () => window.removeEventListener('rate-limit', handler);
  }, []);

  const clearCooldown = () => {
    setCooldown(0);
    setRetryAfter(null);
  };

  return (
    <RateLimitContext.Provider value={{ cooldown, retryAfter, clearCooldown }}>
      {children}
    </RateLimitContext.Provider>
  );
}

export function useRateLimit() {
  const ctx = useContext(RateLimitContext);
  if (!ctx) throw new Error('useRateLimit must be used within RateLimitProvider');
  return ctx;
}
