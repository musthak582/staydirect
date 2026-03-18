"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, sendVerificationEmail } from "@/lib/auth-client";
import Link from "next/link";
import { 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  Mail,
  Sparkles,
  Building2,
  CheckCircle2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

export default function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unverified, setUnverified] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [resendSent, setResendSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUnverified(false);
    const fd = new FormData(e.currentTarget);

    const res = await signIn.email(
      {
        email: fd.get("email") as string,
        password: fd.get("password") as string,
        rememberMe: true,
      },
      {
        onError: (ctx) => {
          if (ctx.error.status === 403) setUnverified(true);
          else setError(ctx.error.message || "Invalid credentials.");
        },
      }
    );

    setLoading(false);
    if (res?.data) router.push("/dashboard");
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    await signIn.social({ provider: "google", callbackURL: "/dashboard" });
  }

  async function handleResend() {
    await sendVerificationEmail({ email: emailValue, callbackURL: "/verified" });
    setResendSent(true);
  }

  return (
    <div className="min-h-screen bg-white flex font-mono">
      {/* Left decorative panel - StayDirect branded */}
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

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          {/* Terminal simulation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="border border-white/10 bg-white/5 rounded-2xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <span className="ml-2 text-xs text-white/30 tracking-widest">hotel@staydirect:~$</span>
            </div>
            <div className="space-y-2 text-sm font-mono text-white/50">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2"
              >
                <span className="text-emerald-400">⟫</span>
                <span>Initializing booking system...</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-2"
              >
                <span className="text-emerald-400">⟫</span>
                <span>Connected to Stripe ✓</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex items-center gap-2"
              >
                <span className="text-emerald-400">⟫</span>
                <span>Your hotel site is live at </span>
                <span className="text-white">grand-hotel.staydirect.com</span>
              </motion.div>
              <div className="text-white/30 mt-4">_<span className="animate-pulse">▌</span></div>
            </div>
          </motion.div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Sparkles key={i} size={12} className="text-amber-400 fill-amber-400" />
              ))}
            </div>
            <p className="text-white/70 text-sm leading-relaxed italic">
              "StayDirect helped us save over $15,000 in commission last year. The setup took one afternoon and our guests love it."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm text-white/50">
                SJ
              </div>
              <div>
                <p className="text-xs text-white/80">Sarah Johnson</p>
                <p className="text-xs text-white/30">Owner, Grand Hotel</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust badges */}
        <div className="relative z-10 flex items-center gap-4 text-xs text-white/30">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-emerald-400" />
            SOC 2 Type II
          </span>
          <span className="w-px h-3 bg-white/10" />
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-emerald-400" />
            99.9% Uptime
          </span>
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

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <p className="text-xs tracking-widest uppercase text-zinc-400 mb-2">Welcome back</p>
            <h1 className="text-3xl font-semibold tracking-tighter text-zinc-900 mb-2">
              Sign in to StayDirect
            </h1>
            <p className="text-sm text-zinc-500">
              Access your dashboard to manage bookings and rooms.
            </p>
          </motion.div>

          {/* Google Sign In */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 text-xs tracking-widest uppercase font-medium gap-3 group"
              onClick={handleGoogle}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 18 18">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </Button>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 my-6"
          >
            <Separator className="flex-1 bg-zinc-100" />
            <span className="text-xs text-zinc-400 tracking-widest uppercase">or sign in with email</span>
            <Separator className="flex-1 bg-zinc-100" />
          </motion.div>

          {/* Alerts */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {error && (
              <Alert variant="destructive" className="mb-5 border-red-200 bg-red-50 text-red-700 py-3">
                <AlertCircle size={14} />
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}
            {unverified && (
              <Alert className="mb-5 border-amber-200 bg-amber-50 py-3">
                <Mail size={14} className="text-amber-600" />
                <AlertDescription className="text-xs text-amber-700 space-y-2">
                  <p className="font-medium">Email not verified</p>
                  <p>Please check your inbox and verify your email address.</p>
                  {!resendSent ? (
                    <button 
                      onClick={handleResend} 
                      className="text-amber-800 underline underline-offset-2 hover:text-amber-900 transition-colors text-xs"
                    >
                      Resend verification email
                    </button>
                  ) : (
                    <span className="text-amber-800 font-medium flex items-center gap-1.5">
                      <CheckCircle2 size={12} />
                      Verification email sent!
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </motion.div>

          {/* Sign In Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label className="text-xs font-medium tracking-widest uppercase text-zinc-500">
                Email address
              </Label>
              <Input
                name="email"
                type="email"
                placeholder="you@hotel.com"
                required
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                className="h-12 border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-300 focus-visible:ring-1 focus-visible:ring-zinc-900 focus-visible:border-zinc-900 text-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium tracking-widest uppercase text-zinc-500">
                  Password
                </Label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="h-12 border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-300 focus-visible:ring-1 focus-visible:ring-zinc-900 focus-visible:border-zinc-900 text-sm pr-12 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest uppercase font-medium gap-2 rounded-lg mt-2 group"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  <span>Sign in to dashboard</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </motion.form>

          {/* Sign up link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-zinc-400 mt-6 text-center"
          >
            Don't have an account?{" "}
            <Link 
              href="/sign-up" 
              className="text-zinc-900 font-medium hover:underline underline-offset-4 transition-colors"
            >
              Create one now
            </Link>
          </motion.p>

          {/* Trust badges for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="lg:hidden flex items-center justify-center gap-4 mt-8 text-xs text-zinc-400"
          >
            <span>🔒 256-bit SSL</span>
            <span className="w-px h-3 bg-zinc-200" />
            <span>✓ SOC 2</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}