"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useUser } from "@/context/user-provider"
import {
  Folder,
  Form,
  Inbox,
  LayoutDashboard,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { logout } from "@/app/actions/logout"
import { ProjectsSection } from "./projects-section"
import Logo from "@/components/Logo"



export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useUser()


  return (
    <>
      <Sidebar collapsible="icon">
        {/* Header */}
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/dashboard" className="block text-2xl font-bold">
                  <Logo />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* Main Nav */}
        <SidebarContent>
          {/* Top Static Links */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/dashboard" || pathname === "/dashboard/overview"}>
                    <Link
                      href="/dashboard"
                      className={`p-6 ${pathname === "/dashboard" || pathname === "/dashboard/overview" ? "bg-primary! text-primary-foreground!" : ""}`}
                    >
                      <LayoutDashboard className="size-4" />
                      <span>Overview</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/dashboard/projects"}>
                    <Link
                      href="/dashboard/projects"
                      className={`p-6 ${pathname === "/dashboard/projects" ? "bg-primary! text-primary-foreground!" : ""}`}
                    >
                      <Folder className="size-4" />
                      <span>Projects</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* User's Assigned Projects */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-2">Projects</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* Flat list of projects */}
                <ProjectsSection />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        {user && (
          <SidebarFooter>
            <SidebarMenu>
              {/* User info row */}
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" tooltip={user.email ?? "User"}>
                  <div className="flex aspect-square size-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold shrink-0">
                    {(user.name ?? user.email ?? "U")[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col gap-0 leading-none min-w-0">
                    <span className="font-medium truncate text-xs">{user.name ?? "Account"}</span>
                    <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Logout */}
              <SidebarMenuItem>
                <form action={logout}>
                  <SidebarMenuButton
                    size="lg"
                    tooltip="Logout"
                    type="submit"
                    className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut className="size-4 shrink-0" />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </form>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        )}

        <SidebarRail />
      </Sidebar>
    </>
  )
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 overflow-x-auto">
          <SidebarTrigger className="-ml-1" />
          <div className="h-4 w-px bg-border shrink-0" />
          <div className="flex items-center gap-2 text-sm whitespace-nowrap">
            {segments.map((segment, index) => {
              const href = "/" + segments.slice(0, index + 1).join("/")
              const isLast = index === segments.length - 1

              // Cleanly format ID hashes to be shorter, otherwise capitalize
              const isId = segment.length > 20 || /^[0-9a-fA-F]{24}$/.test(segment)
              const label = isId
                ? segment.slice(0, 8) + "..."
                : segment.charAt(0).toUpperCase() + segment.slice(1)

              return (
                <div key={href} className="flex items-center gap-2">
                  {index > 0 && <span className="text-muted-foreground">/</span>}
                  {isLast ? (
                    <span className="text-foreground font-medium">{label}</span>
                  ) : (
                    <Link href={href} className="text-muted-foreground hover:text-foreground transition-colors">
                      {label}
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
