'use client';

import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Folder, ExternalLink, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateProjectModal } from "@/components/CreateProjectModal";

export default function DashboardPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage and monitor your FlowForge workspaces.
          </p>
        </div>
        <CreateProjectModal />
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Render projects from the user object */}
        {user.projects && user.projects.length > 0 ? (
          user.projects.map((project: any) => (
            <Card key={project.id} className="group hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold truncate pr-4">
                  {project.name || "Untitled Project"}
                </CardTitle>
                <Folder className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                  {project.description || "No description provided for this project."}
                </p>
                <div className="mt-4 flex items-center gap-2">
                   <Badge variant="secondary" className="text-[10px]">Active</Badge>
                   <div className="flex items-center text-[10px] text-muted-foreground">
                     <Clock className="mr-1 h-3 w-3" />
                     {new Date(project.created_at).toLocaleDateString()}
                   </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="ghost" className="w-full justify-between text-xs" asChild>
                  <a href={`/dashboard/projects/${project.id}`}>
                    Open Workspace <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          /* Empty State */
          <Card className="col-span-full border-dashed py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-muted p-3">
                <Folder className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No projects yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Create your first FlowForge project to get started.
              </p>
              <CreateProjectModal />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}