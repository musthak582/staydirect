"use client";

import Link from "next/link";
import { ArrowRight, Zap, Shield, BarChart3, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900" style={{ fontFamily: "'GeistMono', 'Courier New', monospace" }}>

      {/* Dot grid background */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #d4d4d8 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }} />

      {/* Nav */}
      <nav className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-zinc-200 flex items-center justify-between px-8 py-4 sticky top-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-zinc-950 rounded-md flex items-center justify-center">
            <div className="w-3.5 h-3.5 bg-white rounded-sm" />
          </div>
          <span className="text-zinc-900 text-sm font-medium tracking-widest uppercase">Axiom</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-xs tracking-widest uppercase text-zinc-400">
          <a href="#features" className="hover:text-zinc-900 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-zinc-900 transition-colors">Pricing</a>
          <a href="#docs" className="hover:text-zinc-900 transition-colors">Docs</a>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/sign-in">
            <Button variant="ghost" className="text-xs tracking-widest uppercase text-zinc-500 hover:text-zinc-900 h-9">
              Sign in
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest uppercase h-9 gap-1.5">
              Get started <ArrowRight size={12} />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-28 pb-24">
        <Badge variant="outline" className="border-zinc-300 text-zinc-500 text-xs tracking-widest uppercase gap-2 mb-10 h-8 font-normal">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          Now in public beta
        </Badge>

        <p className="text-xs tracking-widest uppercase text-zinc-400 mb-5">The infrastructure layer for modern SaaS</p>

        <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter leading-none text-zinc-900 max-w-4xl mb-6">
          Build what
          <br />
          <span className="italic font-light text-zinc-400">actually</span> matters.
        </h1>

        <p className="text-zinc-500 max-w-md text-sm leading-relaxed mb-10">
          Authentication primitives, session management, and identity infrastructure so your team ships in days — not months.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link href="/sign-up">
            <Button className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest uppercase h-12 px-8 gap-2 group">
              Start building free
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="outline" className="border-zinc-200 text-zinc-600 hover:border-zinc-400 text-xs tracking-widest uppercase h-12 px-8 gap-1.5">
              View demo <ChevronRight size={13} />
            </Button>
          </Link>
        </div>

        {/* Stat row */}
        <div className="flex items-center gap-12 mt-20 pt-12 border-t border-zinc-200">
          {[
            { n: "99.99%", l: "Uptime SLA" },
            { n: "< 50ms", l: "Auth latency" },
            { n: "SOC 2", l: "Compliant" },
          ].map(({ n, l }) => (
            <div key={l} className="text-center">
              <p className="text-2xl font-semibold tracking-tight text-zinc-900">{n}</p>
              <p className="text-xs tracking-widest uppercase text-zinc-400 mt-1">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Code block */}
      <section className="relative z-10 px-6 pb-24 max-w-2xl mx-auto">
        <div className="bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 shadow-xl">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/10">
            <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <span className="ml-2 text-xs text-white/30 tracking-widest">axiom.config.ts</span>
          </div>
          <div className="p-6 text-xs leading-7 font-mono">
            <div><span className="text-white/30">import</span> <span className="text-white">{"{ betterAuth }"}</span> <span className="text-white/30">from</span> <span className="text-blue-400">"better-auth"</span></div>
            <div className="mt-2"><span className="text-white/30">export const</span> <span className="text-white">auth</span> <span className="text-white/50">=</span> <span className="text-white">betterAuth{"({"}</span></div>
            <div className="ml-4"><span className="text-emerald-400">emailAndPassword</span><span className="text-white">:</span> <span className="text-white">{"{"}</span> <span className="text-emerald-400">enabled</span><span className="text-white">:</span> <span className="text-amber-400">true</span> <span className="text-white">{"}"}</span><span className="text-white">,</span></div>
            <div className="ml-4"><span className="text-emerald-400">socialProviders</span><span className="text-white">:</span> <span className="text-white">{"{"}</span> <span className="text-emerald-400">google</span><span className="text-white">:</span> <span className="text-white/40">{"{ ... }"}</span> <span className="text-white">{"}"}</span><span className="text-white">,</span></div>
            <div><span className="text-white">{"});"}</span></div>
            <Separator className="my-4 bg-white/10" />
            <div className="text-white/30">
              <span className="text-white/20">▸</span> Auth ready in <span className="text-white">3 lines.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 px-6 pb-28 max-w-5xl mx-auto">
        <p className="text-xs tracking-widest uppercase text-zinc-400 mb-10 text-center">Everything you need</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: Shield, title: "Secure by default", desc: "scrypt hashing, HttpOnly cookies, CSRF protection, and timing-attack prevention — all pre-configured." },
            { icon: Zap, title: "Ship in minutes", desc: "Email/password, Google OAuth, email verification, password reset. Copy, paste, done." },
            { icon: BarChart3, title: "Full observability", desc: "Session tracking, device fingerprinting, IP logging. Know exactly who's inside your app." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white border border-zinc-200 rounded-xl p-6 hover:border-zinc-400 transition-colors group">
              <div className="w-9 h-9 bg-zinc-100 rounded-lg flex items-center justify-center mb-5 group-hover:bg-zinc-200 transition-colors">
                <Icon size={15} className="text-zinc-700" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-900 mb-2">{title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 pb-28 text-center">
        <div className="max-w-lg mx-auto bg-zinc-950 rounded-2xl p-14">
          <p className="text-xs tracking-widest uppercase text-white/30 mb-4">Ready to ship?</p>
          <h2 className="text-3xl font-semibold tracking-tight text-white mb-7">Start for free today.</h2>
          <Link href="/sign-up">
            <Button className="bg-white text-zinc-900 hover:bg-zinc-100 text-xs tracking-widest uppercase h-12 px-8 gap-2 group">
              Create account
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-white border-t border-zinc-200 px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-zinc-950 rounded-md flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-sm" />
          </div>
          <span className="text-xs text-zinc-500 tracking-widest uppercase">Axiom</span>
        </div>
        <p className="text-xs text-zinc-400">© 2025 Axiom. All rights reserved.</p>
      </footer>
    </div>
  );
}