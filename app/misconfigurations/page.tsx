"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MisconfigTable } from "@/components/misconfigurations/misconfig-table";
import { FilterBar } from "@/components/misconfigurations/filter-bar";

export default function MisconfigurationsPage() {
  const [findings, setFindings] = useState<any[]>([]);
  const [filteredFindings, setFilteredFindings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Fetch all findings from backend
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/aws/findings", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch misconfigurations");
        const data = await res.json();
        setFindings(data);
        setFilteredFindings(data);
      } catch (err: any) {
        console.error("Error fetching misconfigurations:", err);
        setError("Unable to load misconfigurations. Please try again later.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🔍 Filter logic for search bar
  const handleFilter = (term: string) => {
    if (!term.trim()) {
      setFilteredFindings(findings);
      return;
    }
    const searchTerm = term.toLowerCase();
    const filtered = findings.filter(
      (f) =>
        f.resourceId?.toLowerCase().includes(searchTerm) ||
        f.resourceType?.toLowerCase().includes(searchTerm) ||
        f.vulnerabilityType?.toLowerCase().includes(searchTerm)
    );
    setFilteredFindings(filtered);
  };

  // 🕒 Loading state
  if (loading) return <p className="p-6 text-muted-foreground">Loading misconfigurations...</p>;

  // ❌ Error state
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Detected Misconfigurations</CardTitle>
          <CardDescription>
            All CVSS-scored findings dynamically retrieved from your AWS environment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FilterBar onFilter={handleFilter} />
          <MisconfigTable findings={filteredFindings} />
        </CardContent>
      </Card>
    </div>
  );
}
