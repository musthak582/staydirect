"use client";

import { useState } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import Link from "next/link";
import { 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  Sparkles,
  Building2,
  Shield,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-white flex items-center justify-center px-6 font-mono"
      >
        <div className="max-w-md w-full text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto"
          >
            <CheckCircle2 size={30} className="text-emerald-600" />
          </motion.div>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tighter text-zinc-900">
              Check your inbox
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed">
              We've sent a verification link to your email. Click it to activate your account and start accepting direct bookings.
            </p>
          </div>

          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-left space-y-2">
            <p className="text-xs font-medium text-zinc-900">Next steps:</p>
            <ul className="space-y-1.5">
              {[
                "Click the verification link in your email",
                "Sign in to your new account",
                "Create your hotel profile",
                "Add rooms and start booking"
              ].map((step, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-zinc-600">
                  <span className="w-1 h-1 bg-emerald-400 rounded-full" />
                  {step}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <Link href="/sign-in">
              <Button className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest uppercase h-11 px-8 gap-2 w-full group">
                Go to sign in
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <p className="text-xs text-zinc-400">
              Didn't receive the email?{" "}
              <button className="text-zinc-900 underline underline-offset-2 hover:text-zinc-700">
                Resend
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    );
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

        {/* Center content - Value propositions */}
        <div className="relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="text-xs tracking-widest uppercase text-white/40">
              Join 500+ hotels already saving
            </p>

            <div className="space-y-4">
              {[
                { icon: Shield, label: "Zero commission", value: "Keep 100%", desc: "No more 15-30% fees" },
                { icon: Zap, label: "Setup time", value: "< 5 minutes", desc: "Get live instantly" },
                { icon: Building2, label: "Properties", value: "500+", desc: "And growing daily" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <item.icon size={18} className="text-white/60" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40">{item.label}</p>
                    <p className="text-sm font-medium text-white">{item.value}</p>
                    <p className="text-xs text-white/30">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quote */}
          <motion.blockquote
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="border-l-2 border-emerald-500/50 pl-4"
          >
            <p className="text-white/70 text-sm leading-relaxed italic">
              "StayDirect helped us increase direct bookings by 80% in just 3 months. The best decision we made for our hotel."
            </p>
            <footer className="mt-3">
              <p className="text-xs text-white/40">— Michael Chen, Oceanview Inn</p>
            </footer>
          </motion.blockquote>
        </div>

        {/* Free trial badge */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/10">
            <Sparkles size={12} className="text-amber-400" />
            <span className="text-xs text-white/60">14-day free trial · No credit card</span>
          </div>
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
            <p className="text-xs tracking-widest uppercase text-zinc-400 mb-2">Start saving today</p>
            <h1 className="text-3xl font-semibold tracking-tighter text-zinc-900 mb-2">
              Create your account
            </h1>
            <p className="text-sm text-zinc-500">
              Join hundreds of hotels saving thousands in commission fees.
            </p>
          </motion.div>

          {/* Google Sign Up */}
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
                  <span>Sign up with Google</span>
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
            <span className="text-xs text-zinc-400 tracking-widest uppercase">or with email</span>
            <Separator className="flex-1 bg-zinc-100" />
          </motion.div>

          {/* Error Alert */}
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
          </motion.div>

          {/* Sign Up Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label className="text-xs font-medium tracking-widest uppercase text-zinc-500">
                Full name
              </Label>
              <Input
                name="name"
                placeholder="John Doe"
                required
                className="h-12 border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-300 focus-visible:ring-1 focus-visible:ring-zinc-900 focus-visible:border-zinc-900 text-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium tracking-widest uppercase text-zinc-500">
                Email address
              </Label>
              <Input
                name="email"
                type="email"
                placeholder="you@hotel.com"
                required
                className="h-12 border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-300 focus-visible:ring-1 focus-visible:ring-zinc-900 focus-visible:border-zinc-900 text-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium tracking-widest uppercase text-zinc-500">
                Password
              </Label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  required
                  minLength={8}
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
              <p className="text-xs text-zinc-400 mt-1">Minimum 8 characters</p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest uppercase font-medium gap-2 rounded-lg mt-4 group"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  <span>Create free account</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </motion.form>

          {/* Sign in link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-zinc-400 mt-6 text-center"
          >
            Already have an account?{" "}
            <Link 
              href="/sign-in" 
              className="text-zinc-900 font-medium hover:underline underline-offset-4 transition-colors"
            >
              Sign in
            </Link>
          </motion.p>

          {/* Terms */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xs text-zinc-400 mt-4 text-center leading-relaxed"
          >
            By signing up, you agree to our{" "}
            <a href="/terms" className="underline underline-offset-2 hover:text-zinc-600 transition-colors">
              Terms of Service
            </a>
            {" and "}
            <a href="/privacy" className="underline underline-offset-2 hover:text-zinc-600 transition-colors">
              Privacy Policy
            </a>
          </motion.p>

          {/* Free trial note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 p-4 bg-zinc-50 border border-zinc-200 rounded-lg"
          >
            <p className="text-xs text-zinc-600 text-center">
              <span className="font-medium text-zinc-900">14-day free trial</span> · No credit card required · Cancel anytime
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}