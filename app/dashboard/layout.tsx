"use client";

import { useState } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Navbar } from "@/components/navigation/navbar";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(true)} showMenuButton />

      <div className="flex flex-1">
        <aside className="hidden md:block w-64 border-r">
          <Sidebar />
        </aside>

        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
