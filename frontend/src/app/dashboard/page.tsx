"use client";

import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useAnalytics } from "@/hooks/useAnalytics";
import { LayoutGrid, LineChart, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AnalyticsChart } from "@/components/AnalyticsChart";
import { CreateProjectModal } from "@/components/CreateProjectModal";
import { TrafficSimulator } from "@/components/TrafficSimulator";
import { ReportGenerator } from "@/components/ReportGenratorButton";

export default function DashboardPage() {
  const { user, isLoading } = useUser();
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null,
  );

  // Set default selected project once user loads
  if (!selectedProjectId && user?.projects?.length > 0) {
    setSelectedProjectId(user.projects[0].id);
  }

  const { data: analytics, isLoading: isStatsLoading } =
    useAnalytics(selectedProjectId);

  if (isLoading)
    return (
      <div className="animate-spin h-8 w-8 border-b-2 border-primary mx-auto mt-20" />
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">FlowForge</h1>
        <CreateProjectModal />
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" /> Projects
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" /> Analytics
          </TabsTrigger>
        </TabsList>

        {/* --- PROJECTS TAB --- */}
        <TabsContent value="projects" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* ... Your existing projects.map logic ... */}
          </div>
        </TabsContent>

        {/* --- ANALYTICS TAB --- */}
        <TabsContent value="analytics" className="space-y-4 mt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4 bg-muted/30 rounded-lg border border-dashed">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4" /> Viewing Project:
              </label>
              <select
                className="bg-background border rounded-md p-2 text-sm focus:ring-2 focus:ring-primary outline-none min-w-[180px]"
                value={selectedProjectId || ""}
                onChange={(e) => setSelectedProjectId(Number(e.target.value))}
              >
                {user?.projects?.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Traffic Simulator Button */}
            {selectedProjectId && (
              <div className="flex gap-4">
                <TrafficSimulator projectId={selectedProjectId} />
                <ReportGenerator projectId={selectedProjectId} />
              </div>
            )}
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${analytics?.totalRevenue.toLocaleString() || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.totalEvents.toLocaleString() || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* The Chart */}
          <AnalyticsChart
            data={analytics?.chartData || []}
            title="Performance Trend"
            dataKey="revenue"
            color="#22c55e"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
