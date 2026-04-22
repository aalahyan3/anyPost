"use client"

import { ProjectType } from '@/app/lib/types';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react'
import { toast } from 'sonner';

interface EditProjectDialogProps {
    project: ProjectType | null;
    updateProject: (id: string, updates: { name?: string, active?: boolean }) => Promise<ProjectType>;
    deleteProject: (id: string) => Promise<void>;
    onClose: () => void;
}

function EditProjectDialog({ project, updateProject, deleteProject, onClose }: EditProjectDialogProps) {
    const [name, setName] = useState(project?.name || "");
    const [confirmName, setConfirmName] = useState("");
    const [showDelete, setShowDelete] = useState(false);
    const [inputError, setInputError] = useState<string | null>(null);
    const router = useRouter();
    useEffect(() => {
        setName(project?.name || "");
    }, [project]);


    const handleUpdateProject = async () => {
        if (!project) return;
        if (name.length < 3 || name.length > 20) {
            setInputError("Project name must be between 3 and 20 characters long");
            return;
        }
        try {
            await updateProject(project.id, { name });
            toast.success("Project updated successfully");
            onClose();
        } catch (error) {
            if (error instanceof Error) {
                setInputError(error.message);
            } else {
                setInputError("Error updating project");
            }
        }
    }

    const handleDeleteProject = async () => {
        if (!project) return;
        try {
            await deleteProject(project.id);
            toast.success("Project deleted successfully");
            setShowDelete(false);
            onClose();
            router.push("/dashboard");
        } catch (error) {
            toast.error("Error deleting project");
        }
    }



    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit {project?.name}</DialogTitle>

            </DialogHeader>
            <div className='flex flex-col gap-4'>
                <div className='space-y-1'>
                    <label htmlFor="name" className='block '>Project name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={cn('border p-2 py-3 rounded-lg w-full', inputError && 'border-destructive')} />
                    {
                        inputError && (
                            <span className='text-destructive'>{inputError}</span>
                        )
                    }
                </div>
                <div className='flex gap-2 justify-end'>

                    <Button variant={"destructive"} className='p-5' disabled={showDelete} onClick={() => setShowDelete(true)}>
                        Delete Project
                    </Button>
                    <Button className='p-5' disabled={name === project?.name} onClick={handleUpdateProject}>
                        Save
                    </Button>
                </div>

                {
                    showDelete && (
                        <div className='p-4  border rounded-lg'>
                            <p className='my-2'>Type
                                <strong className='font-mono bg-muted rounded-2xl'> '{name}' </strong> to confirm deletion.
                            </p>
                            <div>
                                <input type="text" value={confirmName} onChange={(e) => setConfirmName(e.target.value)} className={cn('border p-2 py-3 rounded-lg w-full', inputError && 'border-destructive')} />
                                <Button variant={"destructive"} className='w-full mt-2' disabled={confirmName !== project?.name} onClick={handleDeleteProject}>
                                    Confirm Delete
                                </Button>
                            </div>
                        </div>
                    )
                }
            </div>
        </DialogContent>
    )
}

export default EditProjectDialog