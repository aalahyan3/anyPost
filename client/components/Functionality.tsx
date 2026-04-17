import { LayoutDashboard, Link2, PlusIcon } from "lucide-react"
import React from "react"

type StepsType = {
  title: string
  description: string
  icon: React.ReactNode
  number: string
}

const steps: StepsType[] = [
  {
    number: "01",
    title: "Create a form",
    description:
      "Name your form in the AnyPost dashboard and get a unique endpoint instantly.",
    icon: <PlusIcon className="h-5 w-5" />,
  },
  {
    number: "02",
    title: "Connect endpoint",
    description:
      "Add the action URL to your HTML form or POST from any frontend framework.",
    icon: <Link2 className="h-5 w-5" />,
  },
  {
    number: "03",
    title: "Receive submissions",
    description:
      "View and manage your form submissions in a clean, real-time dashboard.",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
]

function Functionality() {
  return (
    <section className="mx-auto mt-14 w-full  px-4 lg:px-8">
      <div>
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="max-w- text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Forms in minutes,
            <span className="block text-foreground/65">not hours</span>
          </h2>

        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <article
              key={step.title}
              className="group relative overflow- rounded-2xl border border-border/60 bg-background/60 p-7 transition-colors hover:border-border"
            >
              <span
                className="pointer-events-none absolute -right-1 -top-4 select-none text-8xl 
                font-semibold tracking-tight text-secondary   transition-all duration-300  group-hover:-translate-y-1 group-hover:text-secondary "
                aria-hidden
              >
                {step.number}
              </span>

              {i < steps.length - 1 && (
                <span
                  className="absolute -right-5 top-8 hidden h-px w-10 bg-linear-to-r from-border/70 to-transparent lg:block"
                  aria-hidden
                />
              )}

              <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/70 text-foreground transition-colors group-hover:border-border group-hover:bg-secondary/40">
                {step.icon}
              </div>

              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-secondary-foreground/75">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Functionality