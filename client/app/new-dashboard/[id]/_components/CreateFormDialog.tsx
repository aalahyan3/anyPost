"use client"

import { api } from "@/app/lib/api"
import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Axios, AxiosError } from "axios"
import { InfoIcon } from "lucide-react"
import React from "react"
import { toast } from "sonner"

function CreateFormDialog({ projectId, onSuccess }: { projectId: string; onSuccess: () => void }) {
    const [error, setError] = React.useState<string | null>(null);
    const [name, setName] = React.useState("");
    const [loading, setLoading] = React.useState(false);


    const handleSubmit =  async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        let lenght = name.trim().length;

        if (lenght < 3 ||lenght > 20) {
            setError("Form name must be between 3 and 20 characters");
            setLoading(false);
            return;
        }

        try {
            const res = await api.post(`/api/v1/projects/${projectId}/forms`, {
                name: name.trim(),
            });
            toast.success("Form created successfully");
            setName("");
            setError(null);
            onSuccess();
        }
        catch (err:  Error | any) {
            setError(err instanceof AxiosError ? err.response?.data.message : "An error occurred while creating the form");
        }
        finally{
            setLoading(false);
        }
    }
        
  return (
    <DialogContent>
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Create New Form</DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-2">
            <label htmlFor="form-name" className="block">Form Name</label>
            <Input value={name} onChange={(e)=> setName(e.target.value)} required type="text" name="name"  id="form-name" placeholder="Enter form name" className="py-5" />
        </div>
        {error && (
            <p className="text-destructive text-sm p-2 mt-4  bg-destructive/10 rounded-lg"><InfoIcon className="w-4 h-4 mr-2 inline" /> {error}</p>
        )}

        <DialogFooter className="mt-6">
            <Button disabled={loading} variant={"outline"}>Cancel</Button>
            <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Form"}
            </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

export default CreateFormDialog
