"use client";

export function ActivityTimeline({ logs }: { logs: any[] }) {
  if (!logs || logs.length === 0)
    return <p className="text-sm text-muted-foreground">No recent activity logged.</p>;

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div key={log._id} className="flex items-start gap-3">
          <div className="w-2 h-2 bg-primary rounded-full mt-2" />
          <div>
            <p className="text-sm font-medium">{log.action}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(log.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
