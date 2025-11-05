"use client";

import { SeverityBadge } from "@/components/dashboard/severity-badge";

export function MisconfigTable({ findings }: { findings: any[] }) {
    if (!findings || findings.length === 0)
        return <p className="text-sm text-muted-foreground">No misconfigurations detected 🎉</p>;

    return (
        <div className="overflow-x-auto">
            <table className="w-full border rounded-lg">
                <thead className="bg-muted/50">
                    <tr>
                        <th className="p-2 text-left">Resource ID</th>
                        <th className="p-2 text-left">Type</th>
                        <th className="p-2 text-left">Vulnerability</th>
                        <th className="p-2 text-left">Severity</th>
                        <th className="p-2 text-left">CVSS</th>
                        <th className="p-2 text-left">Detected</th>
                    </tr>
                </thead>
                <tbody>
                    {findings.map((f) => (
                        <tr key={f._id} className="border-t hover:bg-secondary/30 transition-colors">
                            <td className="p-2 font-mono">{f.resourceId}</td>
                            <td className="p-2">{f.resourceType}</td>
                            <td className="p-2">{f.vulnerabilityType}</td>
                            <td className="p-2">
                                <SeverityBadge severity={f.severityLabel} />
                            </td>
                            <td className="p-2">{f.cvssScore}</td>
                            <td className="p-2">{new Date(f.detectedAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
