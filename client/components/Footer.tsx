import Link from 'next/link'
import React from 'react'
import { ArrowRight } from 'lucide-react'

const links = [
  { label: 'Why Donation?', href: '#' },
  { label: 'Contributing', href: '#' },
  { label: 'Contact', href: '#' },
]

function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden rounded-t-2xl bg-[#080808] text-[#f5f0e8] border-t border-x">

      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 -top-20 h-[500px] w-[500px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,210,80,0.08) 0%, transparent 68%)' }}
      />

      <div className="relative z-10 mx-auto  px-8 pb-10 pt-6">


        {/* Big heading */}
        <h2 className="mb-5  font-serif text-[clamp(2.6rem,2vw,4.5rem)] leading-[1.05] tracking-[-0.03em]">
          Build your first form<br />
          <em className="italic text-primary">in under 5 minutes.</em>
        </h2>

        {/* Subtext */}
        <p className="mb-7 text-sm text-[#f5f0e8]/40">
          Join 15+ developers building amazing forms with AnyPost.
        </p>

        {/* CTA button */}
        <a
          href="#"
          className="group inline-flex items-center gap-2 rounded-full border border-[#f5f0e8]/15 bg-[#f5f0e8]/[0.06] px-5 py-2.5 text-sm font-medium text-[#f5f0e8] transition-colors hover:border-[#f5f0e8]/30 hover:bg-[#f5f0e8]/10"
        >
          Start for free
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </a>


        <div
          className="my-12"
          style={{ height: '1px', background: 'linear-gradient(to right, rgba(245,240,232,0.1), transparent)' }}
        />

        {/* Bottom row */}
        <div className="flex flex-wrap items-start justify-between gap-10">

          {/* Brand */}
          <div>
            <p className="mb-2 font-serif text-lg tracking-tight">
              Any<span className="italic opacity-35">Post</span>
            </p>
            <p className="max-w-[220px] text-xs leading-[1.75] text-[#f5f0e8]/30">
              Automating the web, one form at a time.<br />
              Built for developers, by developers.<br />
              Made with ❤️ by <a className='underline' href="https://aalahyan3.tech">aalahyan3</a> .
            </p>
          </div>

          <div>
            <p className="mb-4 font-mono text-[0.63rem] uppercase tracking-[0.14em] text-[#f5f0e8]/22">
              Useful links
            </p>
            <ul className="flex flex-col gap-2.5">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-block text-[0.825rem] text-[#f5f0e8]/45 transition-all hover:translate-x-1 hover:text-[#f5f0e8]/90"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-9 border-t border-[#f5f0e8]/[0.06] pt-5 font-mono text-[0.63rem] tracking-[0.06em] text-[#f5f0e8]/18">
          © {new Date().getFullYear()} AnyPost — All rights reserved.
        </p>

      </div>
    </footer>
  )
}

export default Footer