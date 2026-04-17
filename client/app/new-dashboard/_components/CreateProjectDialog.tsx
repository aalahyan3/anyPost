"use client"

import { ProjectType } from '@/app/lib/types';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'sonner';

interface CreateProjectDialogProps {
    addProject: (name: string) => Promise<ProjectType>;
    onClose: () => void;
}

function CreateProjectDialog({ addProject, onClose }: CreateProjectDialogProps) {
    const [name, setName] = useState("");
    const [inputError, setInputError] = useState<string | null>(null);
    const router = useRouter();

    const handleCreateProject = async () => {
        if (name.length < 3 || name.length > 20) {
            setInputError("Project name must be between 3 and 20 characters long");
            return;
        }
        try {
            const newProject = await addProject(name);
            toast.success("Project created successfully");
            setName("");
            setInputError(null);
            onClose(); // Close on success
            router.push(`/new-dashboard/${newProject.id}`);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const apiMessage =
                    (error.response?.data as { message?: string; error?: string } | undefined)?.message ||
                    (error.response?.data as { message?: string; error?: string } | undefined)?.error;
                setInputError(apiMessage || error.message || "Error creating project");
                return;
            }

            else if (error instanceof Error) {
                setInputError(error.message);
                return;
            }

            setInputError("Error creating project");
        }
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className='flex flex-col gap-4 mt-4'>
                <div className='space-y-1'>
                    <label htmlFor="name" className='block '>Project name</label>
                    <input type="text" placeholder="My awesome project" value={name} onChange={(e) => {
                        setName(e.target.value);
                        setInputError(null);
                    }} className={cn('border p-2 py-3 rounded-lg w-full', inputError && 'border-destructive')} />
                    {
                        inputError && (
                            <span className='text-destructive'>{inputError}</span>
                        )
                    }
                </div>
                <div className='flex gap-2 justify-end mt-2'>
                    <Button variant={"outline"} className='p-5' onClick={onClose}>
                        Cancel
                    </Button>
                    <Button className='p-5' disabled={name.length === 0} onClick={handleCreateProject}>
                        Create Project
                    </Button>
                </div>
            </div>
        </DialogContent>
    )
}

export default CreateProjectDialog
