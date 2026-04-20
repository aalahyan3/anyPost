"use client"

import { logout } from '@/app/actions/logout';
import { Button } from '@/components/ui/button';
import { DialogTrigger, Dialog } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProjects } from '@/context/projects-provider';
import { useUser } from '@/context/user-provider';
import { LogOut, PlusCircle, Settings } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import EditProjectDialog from './EditProjectDialog';
import CreateProjectDialog from './CreateProjectDialog';
import ThemeChanger from '@/components/ThemeChanger';

function Header() {
    const projects = useProjects();
    const router = useRouter();
    const params = useParams();
    const { user, loading } = useUser();
    const currentproject = (params.id as string) || undefined;

    const [settingDialogOpen, setSettingDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    useEffect(() => {
        if (!projects.loading && projects.projects && projects.projects.length > 0 && !currentproject) {
            console.log("redirecting to first project", projects.projects[0].id);
            router.push(`/new-dashboard/${projects.projects[0].id}`);
        }
        if (!projects.loading && projects.projects && projects.projects.length == 0) setAddDialogOpen(true);
    }, [projects.loading, projects.projects, router, currentproject]);



    return (
        <div className='flex flex-col gap-4 border-b bg-sidebar px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between'>
            <div className='flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:w-auto'>
                {currentproject && <Select
                    value={currentproject || undefined}
                    onValueChange={(value) => {
                        router.push(`/new-dashboard/${value}`);
                    }}
                >
                    <SelectTrigger className="h-10! w-full sm:w-[240px]">
                        <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent position='popper' className='p-1'>
                        {projects.projects.map((project) => (
                            <SelectItem className='p-2' key={project.id} value={project.id}>{project.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>}
                {currentproject && <Dialog open={settingDialogOpen} onOpenChange={setSettingDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant={"outline"} className='h-10 w-full rounded-lg px-4 sm:w-auto'>
                            <Settings className='h-5 w-5' /> Edit project
                        </Button>
                    </DialogTrigger>
                    <EditProjectDialog
                        project={projects.projects.find((p) => p.id === currentproject) || null}
                        updateProject={projects.updateProject}
                        deleteProject={projects.deleteProject}
                        onClose={() => setSettingDialogOpen(false)}
                    />
                </Dialog>}

                <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className='h-10 w-full rounded-lg px-4 sm:w-auto' id='CreateProjectDialogTrigger'>
                            <PlusCircle className='h-5 w-5' /> New project
                        </Button>
                    </DialogTrigger>
                    <CreateProjectDialog addProject={projects.addProject} onClose={() => setAddDialogOpen(false)} />
                </Dialog>


            </div>

            <div className='flex w-full items-center justify-between gap-2 text-secondary-foreground sm:w-auto sm:justify-end'>
                <ThemeChanger className="h-12 w-12 shrink-0 rounded-lg p-0 flex items-center justify-center" />
                {loading ? (
                    <div className="flex h-12 items-center">
                        <span className="text-sm animate-pulse">loading...</span>
                    </div>
                ) : (
                    <div className="flex h-12 w-full max-w-sm items-center gap-3 rounded-xl border border-border bg-card/50 p-1.5 pr-2 shadow-sm transition-colors hover:bg-card sm:w-fit">
  {/* Avatar - High Contrast */}
  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold ring-1 ring-primary/20">
    {user?.name?.at(0)?.toUpperCase()}
  </div>

  {/* Info Section - Improved Truncation */}
  <div className="flex min-w-0 flex-1 flex-col leading-tight sm:flex-none sm:min-w-[120px]">
    <span className="truncate text-sm font-medium text-foreground">
      {user?.name || "User"}
    </span>
    <span className="truncate text-[11px] text-muted-foreground">
      {user?.email}
    </span>
  </div>

  {/* Logout Button - Consistent with your UI preference */}
  <Button
    variant="ghost"
    size="icon"
    onClick={() => logout()}
    className="h-8 w-8 shrink-0 rounded-lg text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
  >
    <LogOut className="h-4 w-4" />
  </Button>
</div>
                )}

                {/* <Button
                    variant="destructive"
                    onClick={() => logout()}
                    className='h-12 w-12 shrink-0 rounded-lg p-0 flex items-center justify-center'
                >
                    <LogOut className='w-5 h-5' />
                </Button> */}
            </div>

        </div>
    )
}

export default Header