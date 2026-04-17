import { FormType } from "@/app/lib/types"
import { FileText } from "lucide-react"
import Link from "next/link"

export function FormCard({ form }: { form: FormType }) {
  return (
    <Link
      href={`/dashboard/forms/${form.id}?projectId=${form.projectId}`}
      className="group rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/30 flex items-start gap-3"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <FileText className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium truncate">{form.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Created {new Date(form.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
        </p>
      </div>
      <span
        className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
          form.active
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {form.active ? "Active" : "Inactive"}
      </span>
    </Link>
  )
}
