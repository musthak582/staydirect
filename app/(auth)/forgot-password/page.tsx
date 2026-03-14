"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2, AlertCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);

    const { error } = await authClient.requestPasswordReset({
      email: fd.get("email") as string,
      redirectTo: "/reset-password",
    });

    setLoading(false);
    if (error) setError(error.message || "Something went wrong.");
    else setSent(true);
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6" style={{ fontFamily: "'GeistMono', 'Courier New', monospace" }}>

      {/* Subtle grid */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #e4e4e7 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }} />

      <div className="relative w-full max-w-sm">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 mb-12">
          <div className="w-7 h-7 bg-zinc-950 rounded-md flex items-center justify-center">
            <div className="w-3.5 h-3.5 bg-white rounded-sm" />
          </div>
          <span className="text-zinc-900 text-sm font-medium tracking-widest uppercase">Axiom</span>
        </Link>

        {sent ? (
          <div className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm space-y-5 text-center">
            <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center mx-auto">
              <Mail size={20} className="text-zinc-700" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 mb-2">Email sent</h2>
              <p className="text-sm text-zinc-500 leading-relaxed">
                If that address exists in our system, you'll receive a reset link shortly. Check your spam too.
              </p>
            </div>
            <Link href="/sign-in">
              <Button variant="outline" className="border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-xs tracking-widest uppercase gap-2 h-10">
                <ArrowLeft size={12} /> Back to sign in
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm">
            <div className="mb-7">
              <p className="text-xs tracking-widest uppercase text-zinc-400 mb-1.5">Account recovery</p>
              <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-2">Forgot your password?</h1>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Enter your email and we'll send you a secure reset link.
              </p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-5 border-red-200 bg-red-50 text-red-700 py-3">
                <AlertCircle size={14} />
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest uppercase font-medium gap-2"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <><span>Send reset link</span><ArrowRight size={13} /></>}
              </Button>
            </form>

            <Link href="/sign-in" className="flex items-center justify-center gap-2 mt-5 text-xs text-zinc-400 hover:text-zinc-700 transition-colors tracking-widest uppercase">
              <ArrowLeft size={12} /> Back to sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}