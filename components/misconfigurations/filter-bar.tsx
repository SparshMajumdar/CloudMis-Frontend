"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function FilterBar({ onFilter }: { onFilter: (term: string) => void }) {
  const [search, setSearch] = useState("");

  const handleSearch = () => onFilter(search);

  return (
    <div className="flex gap-2 mb-4">
      <Input
        placeholder="Search by resource ID, type, or vulnerability..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
}
