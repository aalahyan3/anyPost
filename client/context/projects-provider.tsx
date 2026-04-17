"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { ProjectType } from "@/app/lib/types"
import { api } from "@/app/lib/api"

interface ProjectsContextType {
  projects: ProjectType[]
  loading: boolean
  addProject: (name: string) => Promise<ProjectType>
  updateProject: (id: string, updates: { name?: string, active?: boolean }) => Promise<ProjectType>
  deleteProject: (id: string) => Promise<void>
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined)

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<ProjectType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/api/v1/projects")
      .then((res) => {
        const list: ProjectType[] = res.data.data ?? res.data
        setProjects(Array.isArray(list) ? list : [])
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false))
  }, [])

  const addProject = async (name: string): Promise<ProjectType> => {
    const res = await api.post("/api/v1/projects", { name })
    const created: ProjectType = res.data.data
    setProjects((prev) => [...prev, created])
    return created
  }

  const updateProject = async (id: string, updates: { name?: string, active?: boolean }): Promise<ProjectType> => {
    const res = await api.put(`/api/v1/projects/${id}`, updates)
    const updated: ProjectType = res.data.data
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)))
    return updated
  }

  const deleteProject = async (id: string): Promise<void> => {
    await api.delete(`/api/v1/projects/${id}`)
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <ProjectsContext.Provider value={{ projects, loading, addProject, updateProject, deleteProject }}>
      {children}
    </ProjectsContext.Provider>
  )
}

export function useProjects() {
  const context = useContext(ProjectsContext)
  if (!context) throw new Error("useProjects must be used within a ProjectsProvider")
  return context
}
