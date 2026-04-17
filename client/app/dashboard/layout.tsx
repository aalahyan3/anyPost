import { DashboardShell } from "./_components/app-sidebar"
import { ProjectsProvider } from "@/context/projects-provider"
import { AuthGuard } from "@/components/auth-guard"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <ProjectsProvider>
        <DashboardShell>{children}</DashboardShell>
      </ProjectsProvider>
    </AuthGuard>
  )
}

