"use client"

import { api } from '@/app/lib/api'
import { FormType } from '@/app/lib/types'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useForm } from '@/context/form-context'
import axios from 'axios'


import { Omega, Pencil, Settings2, Trash2, Trash2Icon } from 'lucide-react'
import React from 'react'


function EditModal({form, onSuccess}: {form: FormType, onSuccess: (updatedForm?: FormType) => void}) {
    const [name, setName] = React.useState(form.name);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [active, setActive] = React.useState(form.active);
    const { refreshForms, setForm } = useForm()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (loading) return
      handleEdit()
    }


    const handleEdit = async () => {
        const trimmed = name.trim()
        
        if (trimmed.length < 3 || trimmed.length > 20) {
            setError("Project name must be between 3 and 20 characters.")
            return
        }
            
    
        setLoading(true)
        setError(null)
        try {
          // NOTE: Using fallback pathing if your backend route differs slightly.
          const res = await api.patch(`/api/v1/projects/${form.projectId}/forms/${form.id}`, {
            name: trimmed,
            active: active,
          })
          const updatedForm = res.data?.data ?? res.data
          setForm(updatedForm)
          refreshForms()
          onSuccess(updatedForm);
        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.errors[0].message || err.response?.data?.message || "Request rejected from the server.")
            }
        } finally {
          setLoading(false)
        }
      }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle className='flex items-center gap-4'> <Settings2 /> <span className='block'>Edit {form.name}</span> </DialogTitle>
            </DialogHeader>
            <div>
              <form id="edit-form" onSubmit={handleSubmit} className='w-full'>
                    <div className='space-y-2'>
                        <label htmlFor="edit-name" className='block'>Form Name</label>
                        <Input required type="text" id="edit-name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className='flex items-center gap-2 mt-4'>
                        <Switch className='block' checked={active} onCheckedChange={(checked) => setActive(checked)} />
                        <span className=' block'>Active</span>
                    </div>
                    {error && <p className='text-destructive mt-2 text-sm'>{error}</p>}
                </form>

            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onSuccess()}>Close</Button>
                <Button 
                    type="submit"
                    form="edit-form"
                    disabled={loading || (name.trim() === form.name && active === form.active)} 
                >
                    {loading ? "Saving..." : "Save Changes"}
                </Button>

            </DialogFooter>
        </DialogContent>
    )
}

function FormPageHeader({
  form,
  onFormUpdated,
  onDelete,
  deleting = false,
  deleteError,
}: {
  form: FormType
  onFormUpdated?: (updatedForm: FormType) => void
  onDelete?: () => void
  deleting?: boolean
  deleteError?: string | null
}) {
    const [showEdit, setShowEdit] = React.useState(false)
    const [showDelete, setShowDelete] = React.useState(false)
  return (
    <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              {form.name}
            </h1>
            <span
              className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                form.active
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {form.active ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="flex gap-2">
            <Dialog open={showEdit} onOpenChange={setShowEdit}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setShowEdit(true)}>
                  Edit Form
                </Button>
              </DialogTrigger>

              <EditModal form={form} onSuccess={(updatedForm) => {
                if (updatedForm && onFormUpdated) {
                  onFormUpdated(updatedForm)
                }
                setShowEdit(false)
              }} />
            </Dialog>

            <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" onClick={() => setShowDelete(true)}>
                  Delete Form
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                    <Trash2Icon />
                  </AlertDialogMedia>
                  <AlertDialogTitle>Delete {form.name}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this form and all submissions associated with it.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <Button variant="outline" onClick={() => setShowDelete(false)} disabled={deleting}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={onDelete} disabled={deleting}>
                    {deleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 border-y py-4 text-sm text-muted-foreground">
          <div className="rounded-full border bg-accent px-2.5 py-1 font-mono text-xs text-foreground">
            Form id: {form.id}
          </div>
          <span>&middot;</span>
          <span>
            Created{" "}
            {new Date(form.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
  )
}

export default FormPageHeader