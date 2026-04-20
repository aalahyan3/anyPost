import React from "react"

const companies = [
  { name: "Vercel", src: "https://simpleicons.org/icons/vercel.svg" },
  { name: "GitHub", src: "https://simpleicons.org/icons/github.svg" },
  { name: "Figma", src: "https://simpleicons.org/icons/figma.svg" },
  { name: "Stripe", src: "https://simpleicons.org/icons/stripe.svg" },
  { name: "Notion", src: "https://simpleicons.org/icons/notion.svg" },
  { name: "Linear", src: "https://simpleicons.org/icons/linear.svg" },
]

function Testimonials() {
  return (
    <section className="w-full py-10 bg-muted md:rounded-xl">
      <p
        style={{
          fontFamily: "'DM Mono', 'Fira Mono', monospace",
          fontSize: "0.7rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          opacity: 0.4,
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
        Trusted by developers at leading companies
      </p>

      <div className="flex items-center justify-center gap-10 flex-wrap">
        {companies.map((company) => (
          <img
            key={company.name}
            src={company.src}
            alt={company.name}
            title={company.name}
            className="logo-icon"
            style={{ height: "22px", width: "auto", opacity: 0.45 }}
          />
        ))}
      </div>

      <style>{`
        @media (prefers-color-scheme: dark) { .logo-icon { filter: invert(1); } }
        :is(.dark, [data-theme="dark"]) .logo-icon { filter: invert(1); }
        :is(.light, [data-theme="light"]) .logo-icon { filter: none !important; }
      `}</style>
    </section>
  )
}

export default Testimonials