"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { 
  ArrowLeft, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  Mail,
  Lock,
  Shield,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const emailValue = fd.get("email") as string;
    setEmail(emailValue);

    const { error } = await authClient.requestPasswordReset({
      email: emailValue,
      redirectTo: "/reset-password",
    });

    setLoading(false);
    if (error) setError(error.message || "Something went wrong.");
    else setSent(true);
  }

  return (
    <div className="min-h-screen bg-white flex font-mono">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-zinc-950 p-12 relative overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black" />
        
        {/* Dot grid */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "32px 32px"
          }} 
        />

        {/* Floating orbs */}
        <div className="absolute top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="relative flex items-center gap-3 z-10">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center group hover:scale-105 transition-transform">
            <div className="w-5 h-5 bg-zinc-950 rounded-md group-hover:rotate-12 transition-transform" />
          </div>
          <span className="text-white text-lg font-medium tracking-widest uppercase">StayDirect</span>
        </div>

        {/* Center content - Security messaging */}
        <div className="relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-emerald-400" />
              <span className="text-xs tracking-widest uppercase text-white/40">Secure password reset</span>
            </div>

            <div className="space-y-4">
              {[
                { icon: Lock, text: "End-to-end encrypted" },
                { icon: Shield, text: "Time-limited reset links" },
                { icon: CheckCircle2, text: "Instant confirmation" },
              ].map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <item.icon size={14} className="text-white/60" />
                  </div>
                  <span className="text-sm text-white/70">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Security tip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 border border-white/10 rounded-xl p-5"
          >
            <p className="text-xs text-white/40 mb-2">🔐 Security tip</p>
            <p className="text-sm text-white/70 leading-relaxed">
              Reset links expire after 1 hour for your security. Never share this link with anyone.
            </p>
          </motion.div>
        </div>

        {/* Support contact */}
        <div className="relative z-10">
          <p className="text-xs text-white/30">
            Need help?{" "}
            <a href="/support" className="text-white/60 hover:text-white transition-colors underline underline-offset-2">
              Contact support
            </a>
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-12 py-12">
        <div className="max-w-md w-full mx-auto">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-zinc-950 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm" />
            </div>
            <span className="text-zinc-900 text-sm font-medium tracking-widest uppercase">StayDirect</span>
          </div>

          {sent ? (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm"
            >
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto"
                >
                  <Mail size={28} className="text-emerald-600" />
                </motion.div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold tracking-tighter text-zinc-900">
                    Check your inbox
                  </h2>
                  <p className="text-sm text-zinc-500">
                    We've sent a password reset link to:
                  </p>
                  <p className="text-sm font-medium text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-lg py-2 px-4">
                    {email}
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left">
                  <p className="text-xs text-amber-800 font-medium mb-1">📧 Didn't receive the email?</p>
                  <ul className="text-xs text-amber-700 space-y-1">
                    <li>• Check your spam folder</li>
                    <li>• Make sure you entered the correct email</li>
                    <li>• The link expires in 1 hour</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setSent(false)}
                    className="text-sm text-zinc-400 hover:text-zinc-900 transition-colors"
                  >
                    Try a different email
                  </button>

                  <Link href="/sign-in">
                    <Button 
                      variant="outline" 
                      className="w-full border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 text-xs tracking-widest uppercase h-11 gap-2 group"
                    >
                      <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                      Back to sign in
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Form State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm"
            >
              <div className="mb-8">
                <p className="text-xs tracking-widest uppercase text-zinc-400 mb-2">
                  Password reset
                </p>
                <h1 className="text-2xl font-semibold tracking-tighter text-zinc-900 mb-2">
                  Forgot your password?
                </h1>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  No worries! Enter your email and we'll send you a secure reset link.
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5"
                >
                  <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-700 py-3">
                    <AlertCircle size={14} />
                    <AlertDescription className="text-xs">{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-xs font-medium tracking-widest uppercase text-zinc-500">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <Input
                      name="email"
                      type="email"
                      placeholder="you@hotel.com"
                      required
                      className="h-12 pl-10 border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-300 focus-visible:ring-1 focus-visible:ring-zinc-900 focus-visible:border-zinc-900 text-sm rounded-lg"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest uppercase font-medium gap-2 rounded-lg group"
                >
                  {loading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <>
                      <span>Send reset link</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>

              <Link 
                href="/sign-in" 
                className="flex items-center justify-center gap-2 mt-6 text-xs text-zinc-400 hover:text-zinc-900 transition-colors group"
              >
                <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                <span className="tracking-widest uppercase">Back to sign in</span>
              </Link>

              <div className="mt-6 pt-6 border-t border-zinc-100">
                <p className="text-xs text-zinc-400 text-center">
                  Remember your password?{" "}
                  <Link href="/sign-in" className="text-zinc-900 font-medium hover:underline underline-offset-2">
                    Sign in
                  </Link>
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}