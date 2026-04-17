import { AuthGuard } from '@/components/auth-guard'
import { ProjectsProvider } from '@/context/projects-provider'
import React from 'react'
import Header from './_components/Header'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <ProjectsProvider>
                <div className='flex min-h-dvh flex-col'>
                    <Header />
                    <div className='flex-1 min-h-0'>
                        {children}
                    </div>
                </div>
            </ProjectsProvider>
        </AuthGuard>
    )
}
