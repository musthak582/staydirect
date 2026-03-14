"use client";

import { useState } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);

    const res = await signUp.email({
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      password: fd.get("password") as string,
    });

    setLoading(false);
    if (res.error) setError(res.error.message || "Something went wrong.");
    else setSuccess(true);
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    await signIn.social({ provider: "google", callbackURL: "/dashboard" });
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6" style={{ fontFamily: "'GeistMono', 'Courier New', monospace" }}>
        <div className="max-w-sm w-full text-center space-y-5">
          <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center mx-auto">
            <CheckCircle2 size={22} className="text-zinc-900" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 mb-2">Check your inbox</h2>
            <p className="text-sm text-zinc-500 leading-relaxed">
              If that email isn&apos;t registered yet, we sent a verification link.
              Click it to activate your account.
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed mt-3">
              Already have an account?{" "}
              <Link href="/sign-in" className="underline underline-offset-4 hover:text-zinc-700 transition-colors">
                Sign in instead
              </Link>{" "}or{" "}
              <Link href="/forgot-password" className="underline underline-offset-4 hover:text-zinc-700 transition-colors">
                reset your password
              </Link>.
            </p>
          </div>
          <Link href="/sign-in">
            <Button variant="outline" className="border-zinc-200 text-zinc-700 hover:bg-zinc-50 text-xs tracking-widest uppercase gap-2 h-10">
              Back to sign in <ArrowRight size={12} />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex" style={{ fontFamily: "'GeistMono', 'Courier New', monospace" }}>

      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] bg-zinc-950 p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "28px 28px"
          }} />

        <div className="relative flex items-center gap-2.5">
          <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center">
            <div className="w-3.5 h-3.5 bg-zinc-950 rounded-sm" />
          </div>
          <span className="text-white text-sm font-medium tracking-widest uppercase">Axiom</span>
        </div>

        <div className="relative space-y-6">
          <div>
            <p className="text-xs tracking-widest uppercase text-white/30 mb-5">Why builders choose us</p>
            <div className="space-y-4">
              {[
                { n: "< 50ms", l: "Auth latency" },
                { n: "99.99%", l: "Uptime SLA" },
                { n: "SOC 2", l: "Certified" },
              ].map(({ n, l }) => (
                <div key={l} className="flex items-center justify-between border-b border-white/10 pb-4 last:border-0 last:pb-0">
                  <span className="text-xs text-white/40 tracking-widest uppercase">{l}</span>
                  <span className="text-sm font-medium text-white">{n}</span>
                </div>
              ))}
            </div>
          </div>

          <blockquote className="border-l-2 border-white/20 pl-4">
            <p className="text-white/60 text-sm leading-relaxed italic">
              "We went from zero to production auth in an afternoon."
            </p>
            <footer className="mt-3">
              <p className="text-xs text-white/35">Sarah K., CTO — Vercel-backed startup</p>
            </footer>
          </blockquote>
        </div>

        <p className="relative text-xs text-white/20 tracking-wide">Free forever for indie devs</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-12">
        <div className="max-w-sm w-full mx-auto">

          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-7 h-7 bg-zinc-950 rounded-md flex items-center justify-center">
              <div className="w-3.5 h-3.5 bg-white rounded-sm" />
            </div>
            <span className="text-zinc-900 text-sm font-medium tracking-widest uppercase">Axiom</span>
          </div>

          <div className="mb-8">
            <p className="text-xs tracking-widest uppercase text-zinc-400 mb-1.5">Get started</p>
            <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Create your account</h1>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-11 border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 text-xs tracking-widest uppercase font-medium gap-2.5"
            onClick={handleGoogle}
            disabled={googleLoading}
          >
            {googleLoading ? <Loader2 size={14} className="animate-spin" /> : (
              <svg width="14" height="14" viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
            )}
            Continue with Google
          </Button>

          <div className="flex items-center gap-3 my-5">
            <Separator className="flex-1 bg-zinc-100" />
            <span className="text-xs text-zinc-400 tracking-widest uppercase">or</span>
            <Separator className="flex-1 bg-zinc-100" />
          </div>

          {error && (
            <Alert variant="destructive" className="mb-5 border-red-200 bg-red-50 text-red-700 py-3">
              <AlertCircle size={14} />
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium tracking-widest uppercase text-zinc-500">Full name</Label>
              <Input
                name="name"
                placeholder="John Doe"
                required
                className="h-11 border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-300 focus-visible:ring-1 focus-visible:ring-zinc-900 focus-visible:border-zinc-900 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium tracking-widest uppercase text-zinc-500">Email address</Label>
              <Input
                name="email"
                type="email"
                placeholder="you@company.com"
                required
                className="h-11 border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-300 focus-visible:ring-1 focus-visible:ring-zinc-900 focus-visible:border-zinc-900 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium tracking-widest uppercase text-zinc-500">Password</Label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  className="h-11 border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-300 focus-visible:ring-1 focus-visible:ring-zinc-900 focus-visible:border-zinc-900 text-sm pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest uppercase font-medium mt-1 gap-2"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <><span>Create account</span><ArrowRight size={13} /></>}
            </Button>
          </form>

          <p className="text-xs text-zinc-400 mt-6 text-center">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-zinc-900 font-medium hover:underline underline-offset-4 transition-colors">
              Sign in
            </Link>
          </p>

          <p className="text-xs text-zinc-300 mt-3 text-center leading-relaxed">
            By signing up you agree to our{" "}
            <a href="#" className="underline underline-offset-2 hover:text-zinc-500 transition-colors">Terms</a>
            {" & "}
            <a href="#" className="underline underline-offset-2 hover:text-zinc-500 transition-colors">Privacy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}