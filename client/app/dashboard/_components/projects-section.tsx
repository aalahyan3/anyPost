"use client"

import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useProjects } from "@/context/projects-provider"

export function ProjectsSection() {
  const pathname = usePathname()
  const { projects } = useProjects()

  if (projects.length === 0) {
    return (
      <SidebarMenuItem>
        <span className="px-4 py-2 text-sm text-muted-foreground/70">No projects yet</span>
      </SidebarMenuItem>
    )
  }

  return (
    <>
      {projects.map((project) => (
        <SidebarMenuItem key={project.id}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(`/dashboard/projects/${project.id}`)}
          >
            <Link 
              href={`/dashboard/projects/${project.id}`}
              className={`py-3 px-4 transition-colors ${pathname.startsWith(`/dashboard/projects/${project.id}`) ? "!bg-primary !text-primary-foreground font-medium" : ""}`}
            >
              <span className="truncate">{project.name}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  )
}
