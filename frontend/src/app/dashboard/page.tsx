'use client';

import { useUser } from "@/hooks/useUser";
import { useLogout } from "@/hooks/useLogout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  // Protect the route: if no user is found after loading, kick them to login
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const { mutate: logout } = useLogout();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If we have a user, render the dashboard
  if (user) {
    return (
      <main className="p-8 max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.username}</p>
          </div>
          <Button variant="outline" onClick={() => logout()}>
            Logout
          </Button>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Profile Info</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-mono">{user.email}</p>
              <p className="text-xs text-muted-foreground">User ID: {user.id}</p>
            </CardContent>
          </Card>
          
          {/* Placeholder for future FlowForge stats */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground text-center">
                + New Project
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </main>
    );
  }

  return null;
}