"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Loader2, AlertCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) {
      setError("Invalid or expired reset link. Please request a new one.");
      return;
    }
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);

    const { error } = await authClient.resetPassword({
      newPassword: fd.get("password") as string,
      token,
    });

    setLoading(false);
    if (error) setError(error.message || "Something went wrong.");
    else router.push("/sign-in?reset=true");
  }

  if (!token) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm text-center space-y-5">
        <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
          <XCircle size={20} className="text-red-500" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 mb-2">Link invalid</h2>
          <p className="text-sm text-zinc-500 leading-relaxed">This reset link is missing or has expired.</p>
        </div>
        <Link href="/forgot-password">
          <Button variant="outline" className="border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-xs tracking-widest uppercase gap-2 h-10">
            Request new link <ArrowRight size={12} />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm">
      <div className="mb-7">
        <p className="text-xs tracking-widest uppercase text-zinc-400 mb-1.5">Account recovery</p>
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-2">Set new password</h1>
        <p className="text-sm text-zinc-500 leading-relaxed">Choose a strong password. You'll be signed in after.</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-5 border-red-200 bg-red-50 text-red-700 py-3">
          <AlertCircle size={14} />
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium tracking-widest uppercase text-zinc-500">New password</Label>
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
          <p className="text-xs text-zinc-400 leading-relaxed pt-0.5">
            Use letters, numbers, and symbols for a stronger password.
          </p>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest uppercase font-medium gap-2"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <><span>Reset password</span><ArrowRight size={13} /></>}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6" style={{ fontFamily: "'GeistMono', 'Courier New', monospace" }}>
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #e4e4e7 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }} />
      <div className="relative w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2.5 mb-12">
          <div className="w-7 h-7 bg-zinc-950 rounded-md flex items-center justify-center">
            <div className="w-3.5 h-3.5 bg-white rounded-sm" />
          </div>
          <span className="text-zinc-900 text-sm font-medium tracking-widest uppercase">Axiom</span>
        </Link>
        <Suspense fallback={<div className="text-xs text-zinc-400 tracking-widest uppercase">Loading...</div>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}