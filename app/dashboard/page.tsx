"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/stats-card";
import { SeverityBadge } from "@/components/dashboard/severity-badge";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { mockMisconfigurations } from "@/lib/mock-data";
import { TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, Shield, TrendingDown, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const totalIssues = mockMisconfigurations.length;
  const criticalIssues = mockMisconfigurations.filter((m) => m.severity === "Critical").length;
  const openIssues = mockMisconfigurations.filter((m) => m.status === "Open").length;
  const remediatedIssues = mockMisconfigurations.filter((m) => m.status === "Remediated").length;

  const severityData = [
    {
      name: "Critical",
      value: mockMisconfigurations.filter((m) => m.severity === "Critical").length,
      color: "#ef4444",
    },
    {
      name: "High",
      value: mockMisconfigurations.filter((m) => m.severity === "High").length,
      color: "#f97316",
    },
    {
      name: "Medium",
      value: mockMisconfigurations.filter((m) => m.severity === "Medium").length,
      color: "#eab308",
    },
    {
      name: "Low",
      value: mockMisconfigurations.filter((m) => m.severity === "Low").length,
      color: "#3b82f6",
    },
  ];

  const resourceTypeData = [
    { name: "S3 Bucket", count: 1 },
    { name: "Security Group", count: 1 },
    { name: "IAM User", count: 1 },
    { name: "EBS Volume", count: 1 },
    { name: "RDS Instance", count: 1 },
    { name: "CloudTrail", count: 1 },
    { name: "Lambda", count: 1 },
    { name: "EC2 Instance", count: 1 },
  ];

  const trendData = [
    { date: "Oct 1", issues: 12 },
    { date: "Oct 2", issues: 11 },
    { date: "Oct 3", issues: 13 },
    { date: "Oct 4", issues: 10 },
    { date: "Oct 5", issues: 9 },
    { date: "Oct 6", issues: 8 },
    { date: "Oct 7", issues: 8 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Monitor and manage AWS security misconfigurations across your infrastructure
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Issues"
          value={totalIssues}
          description="Active misconfigurations"
          icon={AlertTriangle}
          trend={{ value: -12, isPositive: true }}
        />
        <StatsCard
          title="Critical Issues"
          value={criticalIssues}
          description="Require immediate attention"
          icon={Shield}
          trend={{ value: -25, isPositive: true }}
        />
        <StatsCard
          title="Open Issues"
          value={openIssues}
          description="Awaiting remediation"
          icon={Clock}
          trend={{ value: 8, isPositive: false }}
        />
        <StatsCard
          title="Remediated"
          value={remediatedIssues}
          description="Successfully fixed"
          icon={CheckCircle}
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Issues by Severity</CardTitle>
            <CardDescription>Distribution of security issues by severity level</CardDescription>
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
                  outerRadius={80}
                  fill="#8884d8"
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
            <CardDescription>Breakdown of affected AWS services</CardDescription>
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

      <Card>
        <CardHeader>
          <CardTitle>Security Trend</CardTitle>
          <CardDescription>Total issues over the past week</CardDescription>
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
                dataKey="issues"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Misconfigurations</CardTitle>
          <CardDescription>Latest security issues detected in your environment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockMisconfigurations.slice(0, 5).map((misc) => (
              <div
                key={misc.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{misc.title}</h4>
                    <SeverityBadge severity={misc.severity} />
                    <StatusBadge status={misc.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">{misc.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <span className="font-mono">{misc.resourceId}</span>
                    <span>{misc.region}</span>
                    <span>{new Date(misc.detectedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
