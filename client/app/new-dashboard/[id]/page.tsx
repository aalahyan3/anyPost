"use client"


import { useForm } from '@/context/form-context';
import { AlertCircle, FilePlus } from 'lucide-react';
import FormDetailPage from './_componenet/FormDetailPage';
import { useParams, usePathname, useSearchParams } from 'next/navigation';

function ProjectPage() {
    const params = useParams();
    const projectId = params.id as string;
    const { form } = useForm();







    if (!form){
        return (
            <section>
                <div className="flex h-screen w-full items-center justify-center bg-background">
                    <div className="text-center">
                        <FilePlus className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                        <h2 className="text-lg font-semibold">No Form Selected</h2>
                        <p className="mt-2 text-sm text-muted-foreground">Select or create a new form to get started.</p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <main className='flex min-h-0 flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8'>
            <FormDetailPage projectId={projectId} formId={form.id} />
        </main>
    )
}

export default ProjectPage