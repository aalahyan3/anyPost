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
                {currentproject &&  <Select
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
                    <div className='flex min-w-0 flex-1 items-center gap-3 rounded-lg bg-muted px-3 py-2 text-foreground sm:flex-none'>
                        <div className='flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-medium'>
                            {user?.name?.at(0)}
                        </div>
                        <span className="min-w-0 truncate text-sm">{user?.email}</span>
                    </div>
                )}

                <Button
                    variant="destructive"
                    onClick={() => logout()}
                    className='h-12 w-12 shrink-0 rounded-lg p-0 flex items-center justify-center'
                >
                    <LogOut className='w-5 h-5' />
                </Button>
            </div>

        </div>
    )
}

export default Header