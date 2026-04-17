"use client"
import { Check, ChevronDown, Copy, Plug } from 'lucide-react'
import React from 'react'

function IntegrationInstructions({ formId }: { formId: string }) {
    const [integrationOpen, setIntegrationOpen] = React.useState(false)
    const [activeTab, setActiveTab] = React.useState<"react" | "html">("react")
    const [copied, setCopied] = React.useState<"url" | "react" | "html" | null>(null);


    const handleCopy = (text: string, type: "url" | "react" | "html") => {
        navigator.clipboard.writeText(text)
        setCopied(type)
        setTimeout(() => setCopied(null), 2000)
    }

  return (
    <div className="mt-4 flex flex-col gap-6">
        <div
          className={`overflow-hidden rounded-xl border bg-card transition-all duration-300`}
        >
          <button
            onClick={() => setIntegrationOpen(!integrationOpen)}
            aria-expanded={integrationOpen}
            aria-controls="integration-content"
            className="flex w-full items-center justify-between border-b bg-muted/30 px-6 py-4 transition-colors hover:bg-muted/50 focus:outline-none"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <Plug className="size-4" />
              </div>
              <div className="text-left">
                <h2 className="text-lg font-semibold tracking-tight">
                  Integration Options
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Link your projects tightly. Connect via POST to this endpoint.
                </p>
              </div>
            </div>
            <ChevronDown
              className={`size-5 text-muted-foreground transition-transform duration-300 ${integrationOpen ? "rotate-180" : ""}`}
            />
          </button>

          <div
            id="integration-content"
            aria-hidden={!integrationOpen}
            className={`grid transition-all duration-300 ease-out ${
              integrationOpen
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div
                className={`space-y-8 p-6 transition-all duration-300 ${
                  integrationOpen
                    ? "translate-y-0 blur-0"
                    : "-translate-y-2 blur-[1px]"
                }`}
              >
              {/* Endpoint */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Endpoint URL</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 overflow-auto rounded-lg border bg-muted/50 px-3 py-2.5 font-mono text-sm">
                    <span className="mr-2 font-semibold text-emerald-500">
                      POST
                    </span>
                    https://anypost.com/f/{formId}
                  </code>
                  <button
                    onClick={() =>
                      handleCopy(`https://anypost.com/f/${formId}`, "url")
                    }
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-background transition-colors hover:bg-muted"
                    title="Copy URL"
                  >
                    {copied === "url" ? (
                      <Check className="size-4 text-emerald-500" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <hr className="border-border" />

              {/* TABS HEADER */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b px-1">
                  <div className="flex gap-6">
                    <button
                      onClick={() => setActiveTab("react")}
                      className={`border-b-2 pb-2.5 text-sm font-medium transition-colors ${
                        activeTab === "react"
                          ? "border-primary text-foreground"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      React (Fetch)
                    </button>
                    <button
                      onClick={() => setActiveTab("html")}
                      className={`border-b-2 pb-2.5 text-sm font-medium transition-colors ${
                        activeTab === "html"
                          ? "border-primary text-foreground"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Raw HTML Form
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      if (activeTab === "react") {
                        handleCopy(
                          `const response = await fetch("https://anypost.com/f/${formId}", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ email: "user@example.com", message: "Hello!" })\n});`,
                          "react"
                        )
                      } else {
                        handleCopy(
                          `<form action="https://anypost.com/f/${formId}" method="POST">\n  <input type="email" name="email" placeholder="Your Email" />\n  <textarea name="message" placeholder="Your Message"></textarea>\n  <button type="submit">Submit</button>\n</form>`,
                          "html"
                        )
                      }
                    }}
                    className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    {copied === activeTab ? (
                      <Check className="size-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                    {copied === activeTab ? "Copied!" : "Copy Code"}
                  </button>
                </div>

                {/* TABS CONTENT */}
                <pre className="overflow-auto rounded-lg border bg-zinc-950 p-5 text-[13px] leading-relaxed shadow-inner">
                  {activeTab === "react" && (
                    <code className="font-mono text-zinc-50">
                      <span className="text-purple-400">const</span>{" "}
                      <span className="text-blue-300">response</span>{" "}
                      <span className="text-purple-400">=</span>{" "}
                      <span className="text-purple-400">await</span>{" "}
                      <span className="text-emerald-300">
                        &quot;https://anypost.com/f/{formId}&quot;
                      </span>
                      , {"{"}
                      {"\n"} <span className="text-zinc-400">method:</span>{" "}
                      <span className="text-emerald-300">&quot;POST&quot;</span>
                      ,{"\n"} <span className="text-zinc-400">headers:</span>{" "}
                      {"{"}{" "}
                      <span className="text-emerald-300">
                        &quot;Content-Type&quot;
                      </span>
                      :{" "}
                      <span className="text-emerald-300">
                        &quot;application/json&quot;
                      </span>{" "}
                      {"}"},{"\n"} <span className="text-zinc-400">body:</span>{" "}
                      <span className="text-yellow-200">JSON</span>.
                      <span className="text-blue-400">stringify</span>({"{"}{" "}
                      <span className="text-blue-300">email</span>:{" "}
                      <span className="text-emerald-300">
                        &quot;user@example.com&quot;
                      </span>
                      , <span className="text-blue-300">message</span>:{" "}
                      <span className="text-emerald-300">
                        &quot;Hello!&quot;
                      </span>{" "}
                      {"}"}){"\n"}
                      {"})"};
                    </code>
                  )}

                  {activeTab === "html" && (
                    <code className="font-mono text-zinc-50">
                      <span className="text-zinc-400">&lt;</span>
                      <span className="text-pink-400">form</span>{" "}
                      <span className="text-purple-300">action</span>
                      <span className="text-zinc-400">=</span>
                      <span className="text-emerald-300">
                        &quot;https://anypost.com/f/{formId}&quot;
                      </span>{" "}
                      <span className="text-purple-300">method</span>
                      <span className="text-zinc-400">=</span>
                      <span className="text-emerald-300">&quot;POST&quot;</span>
                      <span className="text-zinc-400">&gt;</span>
                      {"\n  "}
                      <span className="text-zinc-400">&lt;</span>
                      <span className="text-pink-400">input</span>{" "}
                      <span className="text-purple-300">type</span>
                      <span className="text-zinc-400">=</span>
                      <span className="text-emerald-300">
                        &quot;email&quot;
                      </span>{" "}
                      <span className="text-purple-300">name</span>
                      <span className="text-zinc-400">=</span>
                      <span className="text-emerald-300">
                        &quot;email&quot;
                      </span>{" "}
                      <span className="text-purple-300">placeholder</span>
                      <span className="text-zinc-400">=</span>
                      <span className="text-emerald-300">
                        &quot;Your Email&quot;
                      </span>{" "}
                      <span className="text-zinc-400">/&gt;</span>
                      {"\n  "}
                      <span className="text-zinc-400">&lt;</span>
                      <span className="text-pink-400">textarea</span>{" "}
                      <span className="text-purple-300">name</span>
                      <span className="text-zinc-400">=</span>
                      <span className="text-emerald-300">
                        &quot;message&quot;
                      </span>{" "}
                      <span className="text-purple-300">placeholder</span>
                      <span className="text-zinc-400">=</span>
                      <span className="text-emerald-300">
                        &quot;Your Message&quot;
                      </span>
                      <span className="text-zinc-400">&gt;&lt;/</span>
                      <span className="text-pink-400">textarea</span>
                      <span className="text-zinc-400">&gt;</span>
                      {"\n  "}
                      <span className="text-zinc-400">&lt;</span>
                      <span className="text-pink-400">button</span>{" "}
                      <span className="text-purple-300">type</span>
                      <span className="text-zinc-400">=</span>
                      <span className="text-emerald-300">
                        &quot;submit&quot;
                      </span>
                      <span className="text-zinc-400">&gt;</span>Submit
                      <span className="text-zinc-400">&lt;/</span>
                      <span className="text-pink-400">button</span>
                      <span className="text-zinc-400">&gt;</span>
                      {"\n"}
                      <span className="text-zinc-400">&lt;/</span>
                      <span className="text-pink-400">form</span>
                      <span className="text-zinc-400">&gt;</span>
                    </code>
                  )}
                </pre>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
  )
}

export default IntegrationInstructions