
"use client"
import React, { useEffect } from 'react'
import SideBar from './_components/SideBar'
import { useParams } from 'next/navigation'
import { useProjects } from '@/context/projects-provider';
import { useRouter } from 'next/navigation';
import { FormProvider } from '@/context/form-context';

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
    const params = useParams();
    const { id } = params;
    const { loading, projects } = useProjects();
    const router = useRouter();
    // const [currForm, setCurrForm] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && projects) {
            const project = projects.find((p) => p.id === id);
            if (!project) {
                router.push('/new-dashboard');
            }
        }
    }, [id, projects, loading, router])

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <svg className="h-8 w-8 animate-spin text-primary/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            </div>
        )
    }

    return (
        <FormProvider>
            <div className='flex min-h-0 flex-1 flex-col md:flex-row'>
                <SideBar className="w-full shrink-0  md:w-64 " projectId={id as string} />
                <div className='min-w-0 flex-1'>
                    {children}
                </div>
            </div>
        </FormProvider>
    )
}