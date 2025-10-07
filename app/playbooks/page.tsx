"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { mockPlaybooks, mockExecutions } from "@/lib/mock-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, CircleCheck as CheckCircle, Clock, Circle as XCircle, Zap, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/navigation/navbar";
import { Sidebar } from "@/components/navigation/sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function PlaybooksPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();

  const handleExecutePlaybook = (playbookName: string) => {
    toast({
      title: "Playbook Executed",
      description: `${playbookName} has been triggered successfully.`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Running":
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      case "Failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      Success: "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20",
      Running: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20",
      Failed: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20",
      Pending: "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 border-gray-500/20",
    };

    return (
      <Badge variant="outline" className={variants[status]}>
        {status}
      </Badge>
    );
  };

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
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Security Playbooks</h1>
              <p className="text-muted-foreground mt-2">
                Automated response workflows for common security misconfigurations
              </p>
            </div>

            <Tabs defaultValue="playbooks" className="space-y-6">
              <TabsList>
                <TabsTrigger value="playbooks">Available Playbooks</TabsTrigger>
                <TabsTrigger value="executions">Recent Executions</TabsTrigger>
              </TabsList>

              <TabsContent value="playbooks" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {mockPlaybooks.map((playbook) => (
                    <Card key={playbook.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <CardTitle className="flex items-center gap-2">
                              {playbook.name}
                              {playbook.automated && (
                                <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
                                  <Zap className="h-3 w-3 mr-1" />
                                  Auto
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription>{playbook.description}</CardDescription>
                          </div>
                          <Switch checked={playbook.isActive} />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 text-sm">
                          <Badge variant="outline">{playbook.category}</Badge>
                          <Badge
                            variant="outline"
                            className={
                              playbook.severityTrigger === "Critical"
                                ? "border-red-500/50 text-red-500"
                                : playbook.severityTrigger === "High"
                                ? "border-orange-500/50 text-orange-500"
                                : "border-yellow-500/50 text-yellow-500"
                            }
                          >
                            Min: {playbook.severityTrigger}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            Actions
                          </h4>
                          {playbook.actions.map((action) => (
                            <div
                              key={action.step}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                                {action.step}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{action.action}</p>
                                <code className="text-xs">{action.command}</code>
                              </div>
                            </div>
                          ))}
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-full">
                              <Play className="h-4 w-4 mr-2" />
                              Execute Playbook
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Execute {playbook.name}?</DialogTitle>
                              <DialogDescription>
                                This will trigger the automated response workflow. The playbook
                                will execute the following actions in sequence:
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-2 py-4">
                              {playbook.actions.map((action) => (
                                <div key={action.step} className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-sm">{action.action}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                className="flex-1"
                                onClick={() => handleExecutePlaybook(playbook.name)}
                              >
                                Confirm & Execute
                              </Button>
                              <DialogTrigger asChild>
                                <Button variant="outline" className="flex-1">
                                  Cancel
                                </Button>
                              </DialogTrigger>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="executions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Execution History</CardTitle>
                    <CardDescription>
                      Track the status and results of playbook executions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockExecutions.map((execution) => (
                        <div
                          key={execution.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
                        >
                          <div className="flex items-start gap-4 flex-1">
                            <div className="mt-1">{getStatusIcon(execution.status)}</div>
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{execution.playbookName}</h4>
                                {getStatusBadge(execution.status)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                <p>Started: {new Date(execution.startedAt).toLocaleString()}</p>
                                {execution.completedAt && (
                                  <p>
                                    Completed: {new Date(execution.completedAt).toLocaleString()}
                                  </p>
                                )}
                              </div>
                              {execution.results && (
                                <div className="mt-2 p-2 bg-secondary/50 rounded text-xs font-mono">
                                  {JSON.stringify(execution.results, null, 2)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
