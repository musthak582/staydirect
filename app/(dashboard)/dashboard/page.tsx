"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import {
  LayoutDashboard, Settings, Users, BarChart3,
  LogOut, Bell, ChevronRight, Zap, Shield, Activity, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Active sessions", value: "1" },
  { label: "API calls today", value: "—" },
  { label: "Last login", value: "Now" },
];

const recentActivity = [
  { action: "Signed in", detail: "Email + password", time: "Just now", ok: true },
  { action: "Account created", detail: "Email verified", time: "Today", ok: true },
];

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) router.push("/sign-in");
  }, [isPending, session, router]);

  async function handleSignOut() {
    setSigningOut(true);
    await signOut({ fetchOptions: { onSuccess: () => router.push("/sign-in") } });
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center gap-2">
          {[0, 150, 300].map((d) => (
            <div key={d} className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
          ))}
        </div>
      </div>
    );
  }
  if (!session?.user) return null;

  const { user } = session;
  const initials = user.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-zinc-50 flex" style={{ fontFamily: "'GeistMono', 'Courier New', monospace" }}>

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-zinc-200 min-h-screen">

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-zinc-100">
          <div className="w-7 h-7 bg-zinc-950 rounded-md flex items-center justify-center">
            <div className="w-3.5 h-3.5 bg-white rounded-sm" />
          </div>
          <span className="text-zinc-900 text-sm font-medium tracking-widest uppercase">Axiom</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {[
            { icon: LayoutDashboard, label: "Overview", active: true },
            { icon: Activity, label: "Activity", active: false },
            { icon: Users, label: "Users", active: false },
            { icon: BarChart3, label: "Analytics", active: false },
            { icon: Settings, label: "Settings", active: false },
          ].map(({ icon: Icon, label, active }) => (
            <button key={label}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs tracking-widest uppercase transition-colors ${
                active
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
              }`}>
              <Icon size={13} />
              {label}
            </button>
          ))}
        </nav>

        <Separator className="bg-zinc-100" />

        {/* User + sign out */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-900 text-white rounded-lg flex items-center justify-center text-xs font-semibold shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-900 truncate">{user.name || "User"}</p>
              <p className="text-xs text-zinc-400 truncate">{user.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full h-9 border-zinc-200 text-zinc-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-xs tracking-widest uppercase gap-2 transition-all"
          >
            {signingOut ? <Loader2 size={12} className="animate-spin" /> : <LogOut size={12} />}
            {signingOut ? "Signing out…" : "Sign out"}
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen">

        {/* Top bar */}
        <header className="bg-white border-b border-zinc-200 flex items-center justify-between px-8 py-4">
          <div>
            <p className="text-xs tracking-widest uppercase text-zinc-400">Overview</p>
            <h1 className="text-base font-semibold text-zinc-900 mt-0.5">
              Good to see you, {user.name?.split(" ")[0] || "there"}.
            </h1>
          </div>
          <div className="flex items-center gap-2.5">
            {/* Live badge */}
            <Badge variant="outline" className="hidden md:flex gap-1.5 border-zinc-200 text-zinc-500 text-xs tracking-widest uppercase font-normal h-8">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live
            </Badge>
            <Button variant="outline" size="icon" className="relative h-9 w-9 border-zinc-200">
              <Bell size={14} className="text-zinc-500" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-zinc-900 rounded-full" />
            </Button>
            {/* Mobile sign out */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleSignOut}
              disabled={signingOut}
              className="md:hidden h-9 w-9 border-zinc-200 text-zinc-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
            >
              {signingOut ? <Loader2 size={13} className="animate-spin" /> : <LogOut size={13} />}
            </Button>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-8 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map(({ label, value }) => (
              <div key={label} className="bg-white border border-zinc-200 rounded-xl p-5">
                <p className="text-xs tracking-widest uppercase text-zinc-400 mb-2">{label}</p>
                <p className="text-3xl font-semibold text-zinc-900 tracking-tight">{value}</p>
              </div>
            ))}
          </div>

          {/* Two columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Account info */}
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
                <span className="text-xs tracking-widest uppercase text-zinc-500 font-medium">Account</span>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-zinc-400 hover:text-zinc-900 tracking-widest uppercase gap-1 px-2">
                  Edit <ChevronRight size={11} />
                </Button>
              </div>
              <div className="p-5 space-y-3.5">
                {[
                  { field: "Name", value: user.name || "—" },
                  { field: "Email", value: user.email },
                  { field: "Verified", value: user.emailVerified ? "Yes" : "Pending" },
                  { field: "Provider", value: "Email + password" },
                ].map(({ field, value }) => (
                  <div key={field} className="flex items-center justify-between gap-4">
                    <span className="text-xs tracking-widest uppercase text-zinc-400 shrink-0">{field}</span>
                    <span className="text-xs text-zinc-700 text-right truncate font-medium">{value as string}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity */}
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-100">
                <span className="text-xs tracking-widest uppercase text-zinc-500 font-medium">Recent activity</span>
              </div>
              <div className="divide-y divide-zinc-50">
                {recentActivity.map(({ action, detail, time, ok }) => (
                  <div key={action} className="flex items-center gap-4 px-5 py-4">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${ok ? "bg-zinc-900" : "bg-zinc-300"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-zinc-800">{action}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">{detail}</p>
                    </div>
                    <span className="text-xs text-zinc-400 shrink-0">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100">
              <span className="text-xs tracking-widest uppercase text-zinc-500 font-medium">Quick actions</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-zinc-100">
              {[
                { icon: Zap, title: "API keys", desc: "Manage access tokens" },
                { icon: Shield, title: "Security", desc: "Sessions & 2FA" },
                { icon: Settings, title: "Preferences", desc: "Customize account" },
              ].map(({ icon: Icon, title, desc }) => (
                <button key={title}
                  className="flex items-center gap-4 px-5 py-5 text-left hover:bg-zinc-50 transition-colors group">
                  <div className="w-9 h-9 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-zinc-200 transition-colors">
                    <Icon size={14} className="text-zinc-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-900">{title}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{desc}</p>
                  </div>
                  <ChevronRight size={13} className="text-zinc-300 group-hover:text-zinc-500 transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Session / sign out */}
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100">
              <span className="text-xs tracking-widest uppercase text-zinc-500 font-medium">Session</span>
            </div>
            <div className="px-5 py-5 flex items-center justify-between gap-6">
              <div>
                <p className="text-xs font-medium text-zinc-800">Signed in as {user.email}</p>
                <p className="text-xs text-zinc-400 mt-0.5">This will end your session across all open tabs.</p>
              </div>
              <Button
                variant="outline"
                onClick={handleSignOut}
                disabled={signingOut}
                className="shrink-0 h-9 border-zinc-200 text-zinc-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-xs tracking-widest uppercase gap-2 transition-all"
              >
                {signingOut ? <Loader2 size={12} className="animate-spin" /> : <LogOut size={12} />}
                {signingOut ? "Signing out…" : "Sign out"}
              </Button>
            </div>
          </div>

        </div>

        <footer className="bg-white border-t border-zinc-200 px-8 py-4 flex items-center justify-between">
          <span className="text-xs text-zinc-400 tracking-widest uppercase">Axiom v1.0</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            <span className="text-xs text-zinc-400">All systems operational</span>
          </div>
        </footer>
      </main>
    </div>
  );
}