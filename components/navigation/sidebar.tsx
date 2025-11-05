"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutDashboard, FileText, Settings, Shield, Activity, TriangleAlert as AlertTriangle, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Misconfigurations",
    icon: AlertTriangle,
    href: "/misconfigurations",
    color: "text-orange-500",
  },
  {
    label: "Playbooks",
    icon: FileText,
    href: "/playbooks",
    color: "text-emerald-500",
  },
  {
    label: "Activity",
    icon: Activity,
    href: "/activity",
    color: "text-pink-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-gray-500",
  },
];

export function Sidebar({ className, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12 h-full", className)}>
      <div className="space-y-4 py-4 h-full bg-secondary/10">
        <div className="px-3 py-2 h-full">
          <div className="flex items-center justify-between mb-6 px-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6" />
              <h2 className="text-lg font-bold tracking-tight">CloudSecure</h2>
            </div>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 md:hidden"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={onClose}
                  className={cn(
                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-secondary/50 rounded-lg transition",
                    pathname === route.href
                      ? "bg-secondary text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <div className="flex items-center flex-1">
                    <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                    {route.label}
                  </div>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
