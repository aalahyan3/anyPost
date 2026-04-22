"use client"

import { Button } from '@/components/ui/button';
import { useProjects } from '@/context/projects-provider';
import { useUser } from '@/context/user-provider'
import { Plus, PlusCircle, PlusSquare, Settings, Waves } from 'lucide-react';
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import HelloImg from "@/public/hello.png"

function NewDashboard() {
    const { user } = useUser();
    const router = useRouter();
    const { projects } = useProjects();

    return (
        <div className='p-6 min-h-[60vh] flex flex-col items-center justify-center space-y-6'>
            <div className='text-center space-y-2 '>
                <div className='w-fit mx-auto'>
                    <Image src={HelloImg} alt='hello' width={80} height={80} />
                </div>
                <h1 className='text-2xl font-bold tracking-tight'>
                    Hello {user?.name || 'there'}!
                </h1>
                <p className='text-muted-foreground text-lg'>
                    Welcome to anyPost. Please create your first project to get started.
                </p>
            </div>

            <div className='flex items-center gap-4 '>
                <Button onClick={
                    () => {
                        document.getElementById('CreateProjectDialogTrigger')?.click();
                    }
                } className='flex items-center gap-2 p-6 rounded-xl'>
                    <PlusCircle className='w-4 h-4' />
                    Create Project
                </Button>

            </div>
        </div>
    )
}

export default NewDashboard