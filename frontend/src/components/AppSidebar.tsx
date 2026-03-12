"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { LayoutDashboard, FolderKanban, Settings, CreditCard, Sparkles } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Projects", url: "/dashboard/projects", icon: FolderKanban },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const { user } = useUser();
  const isPro = user?.subscription_status === "active";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="font-bold px-4 py-2">FlowForge</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={isPro ? "Billing" : "Upgrade"}
              className={
                !isPro
                  ? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                  : ""
              }
            >
              <Link href="/dashboard/billing">
                {isPro ? <CreditCard /> : <Sparkles />}
                <span>{isPro ? "Billing" : "Upgrade to Pro"}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
