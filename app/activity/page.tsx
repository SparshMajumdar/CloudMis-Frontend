"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ActivityTimeline } from "@/components/activity/activity-timeline";

export default function ActivityPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/aws/activity", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch activity logs");
        const data = await res.json();
        setLogs(data);
      } catch (err: any) {
        console.error("Error fetching activity logs:", err);
        setError("Unable to load activity at the moment. Please try again later.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <p className="p-6 text-muted-foreground">Loading activity...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>System and user events from your AWS environment</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityTimeline logs={logs} />
        </CardContent>
      </Card>
    </div>
  );
}
