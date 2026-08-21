import { useQuery } from '@tanstack/react-query';

function SystemStatus() {
  const health = useQuery({
    queryKey: ['system-health'],
    queryFn: () => fetch('/api/health').then((r) => r.json()),
    refetchInterval: 30000,
  });

  const isHealthy = health.data?.status === 'ok';

  return (
    <div className="system-status">
      <div className={`status-indicator ${isHealthy ? 'healthy' : 'error'}`}>
        <span className="status-dot"></span>
        <span className="status-text">
          {health.isLoading ? 'Checking…' : isHealthy ? 'Systems operational' : 'Service degraded'}
        </span>
      </div>
      <div className="status-meta">
        <span>Backend: {isHealthy ? 'Online' : 'Offline'}</span>
        <span>Uptime: monitored</span>
        <span>Health: /api/health</span>
      </div>
    </div>
  );
}

export default SystemStatus;
