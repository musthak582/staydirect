"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function VerifiedContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error"); // Better Auth sets ?error=invalid_token if bad

  if (error) {
    return (
      <div className="text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
          <XCircle size={28} className="text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-2">
            Verification failed
          </h1>
          <p className="text-sm text-zinc-500 leading-relaxed max-w-xs mx-auto">
            This verification link is invalid or has already expired. Request a new one from the sign-in page.
          </p>
        </div>
        <Link href="/sign-in">
          <Button
            variant="outline"
            className="border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-xs tracking-widest uppercase gap-2 h-10"
          >
            Back to sign in <ArrowRight size={12} />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center space-y-5">
      {/* Animated check */}
      <div className="relative w-16 h-16 mx-auto">
        <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center">
          <CheckCircle2 size={28} className="text-zinc-900" />
        </div>
        {/* Ripple ring */}
        <div
          className="absolute inset-0 rounded-full border border-zinc-300 animate-ping opacity-30"
          style={{ animationDuration: "1.8s" }}
        />
      </div>

      <div>
        <p className="text-xs tracking-widest uppercase text-zinc-400 mb-2">All done</p>
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-2">
          Email verified
        </h1>
        <p className="text-sm text-zinc-500 leading-relaxed max-w-xs mx-auto">
          Your account is now active. Sign in to get started.
        </p>
      </div>

      {/* Divider with label */}
      <div className="flex items-center gap-3 max-w-xs mx-auto">
        <div className="flex-1 h-px bg-zinc-200" />
        <span className="text-xs text-zinc-400 tracking-widest uppercase">next step</span>
        <div className="flex-1 h-px bg-zinc-200" />
      </div>

      <Link href="/sign-in">
        <Button className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest uppercase h-11 px-8 gap-2 group">
          Sign in to your account
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </Link>

      <p className="text-xs text-zinc-400">
        Need help?{" "}
        <a href="mailto:support@axiom.com" className="underline underline-offset-4 hover:text-zinc-700 transition-colors">
          Contact support
        </a>
      </p>
    </div>
  );
}

export default function VerifiedPage() {
  return (
    <div
      className="min-h-screen bg-white flex items-center justify-center px-6"
      style={{ fontFamily: "'GeistMono', 'Courier New', monospace" }}
    >
      {/* Dot grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #d4d4d8 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-14">
          <div className="w-7 h-7 bg-zinc-950 rounded-md flex items-center justify-center">
            <div className="w-3.5 h-3.5 bg-white rounded-sm" />
          </div>
          <span className="text-zinc-900 text-sm font-medium tracking-widest uppercase">
            Axiom
          </span>
        </Link>

        {/* Card */}
        <div className="bg-white border border-zinc-200 rounded-xl p-10 shadow-sm">
          <Suspense
            fallback={
              <div className="text-center text-xs text-zinc-400 tracking-widest uppercase py-8">
                Verifying…
              </div>
            }
          >
            <VerifiedContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}