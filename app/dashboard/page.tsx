"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/stats-card";
import { SeverityBadge } from "@/components/dashboard/severity-badge";
import { TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, Shield } from "lucide-react";
import dynamic from "next/dynamic";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line, Legend } from "recharts";

// Dynamically import charts to avoid hydration mismatch
const TrendChart = dynamic(() => import("./charts").then(mod => mod.TrendChart), { ssr: false });

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [awsData, setAwsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔒 Authentication check
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getProfile();
        if (!data || data.message === "Invalid or expired token") {
          router.push("/login");
        } else {
          setUser(data);
        }
      } catch (error) {
        router.push("/login");
      }
    };
    fetchUser();
  }, [router]);

  // 📊 Fetch AWS CVSS Data after user is set
  useEffect(() => {
    const fetchAwsCVSSData = async () => {
      if (!user) return;
      try {
        const res = await fetch("http://localhost:5000/api/aws/fetch-data", {
          credentials: "include",
        });
        const result = await res.json();
        setAwsData(result.scoredData || []);
      } catch (err) {
        console.error("Error fetching AWS data:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchAwsCVSSData();
  }, [user]);

  if (loading) {
    return <p className="p-6 text-muted-foreground">Loading your AWS dashboard...</p>;
  }

  if (!user) {
    return <p className="p-6 text-red-500">Unauthorized. Redirecting to login...</p>;
  }

  // ✅ Data Calculations
  const totalFindings = awsData.length;
  const criticalCount = awsData.filter((i) => i.severityLabel === "Critical").length;
  const highCount = awsData.filter((i) => i.severityLabel === "High").length;
  const mediumCount = awsData.filter((i) => i.severityLabel === "Medium").length;
  const lowCount = awsData.filter((i) => i.severityLabel === "Low").length;

  const avgCVSS =
    awsData.reduce((acc, cur) => acc + parseFloat(cur.cvssScore || 0), 0) /
    (awsData.length || 1);

  // For resource type distribution
  const resourceTypes = Array.from(new Set(awsData.map((d) => d.resourceType || "Unknown")));
  const resourceTypeData = resourceTypes.map((type) => ({
    name: type,
    count: awsData.filter((d) => d.resourceType === type).length,
  }));

  const severityData = [
    { name: "Critical", value: criticalCount, color: "#ef4444" },
    { name: "High", value: highCount, color: "#f97316" },
    { name: "Medium", value: mediumCount, color: "#eab308" },
    { name: "Low", value: lowCount, color: "#3b82f6" },
  ];

  // Simple mock trend data (could later come from MongoDB)
  const trendData = [
    { date: "Mon", avg: 8.5 },
    { date: "Tue", avg: 7.8 },
    { date: "Wed", avg: 6.3 },
    { date: "Thu", avg: 7.0 },
    { date: "Fri", avg: 5.9 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, <span className="font-semibold">{user.fullName}</span> 👋
          <br />
          Real-time insights from your AWS environment.
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Findings"
          value={totalFindings}
          description="From your AWS environment"
          icon={AlertTriangle}
          trend={{ value: 0, isPositive: false }}
        />
        <StatsCard
          title="Critical Issues"
          value={criticalCount}
          description="Immediate attention required"
          icon={Shield}
          trend={{ value: -10, isPositive: true }}
        />
        <StatsCard
          title="Average CVSS"
          value={avgCVSS.toFixed(1)}
          description="Mean risk score (0–10)"
          icon={Clock}
          trend={{ value: -5, isPositive: true }}
        />
        <StatsCard
          title="Low Severity"
          value={lowCount}
          description="Minimal risk items"
          icon={CheckCircle}
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Issues by Severity</CardTitle>
            <CardDescription>CVSS-based severity distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Issues by Resource Type</CardTitle>
            <CardDescription>Breakdown of affected AWS resources</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={resourceTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>CVSS Trend (Example)</CardTitle>
          <CardDescription>Average CVSS score over recent scans</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="avg"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Findings */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Findings</CardTitle>
          <CardDescription>Analyzed vulnerabilities with CVSS scoring</CardDescription>
        </CardHeader>
        <CardContent>
          {awsData.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No findings were detected from your AWS feature-engineered data.
            </p>
          ) : (
            <div className="space-y-4">
              {awsData.slice(0, 10).map((item, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{item.resourceId || "Unknown Resource"}</h4>
                      <SeverityBadge severity={item.severityLabel} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.vulnerabilityType || "Unspecified vulnerability"}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                      <span className="font-mono">Type: {item.resourceType}</span>
                      <span>CVSS: {item.cvssScore}</span>
                      <span>Detected: {new Date(item.detectedAt || Date.now()).toISOString().split("T")[0]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
