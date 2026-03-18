"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  XCircle,
  Lock,
  Shield,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/)) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    setPasswordStrength(strength);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) {
      setError("Invalid or expired reset link. Please request a new one.");
      return;
    }
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const password = fd.get("password") as string;

    const { error } = await authClient.resetPassword({
      newPassword: password,
      token,
    });

    setLoading(false);
    if (error) setError(error.message || "Something went wrong.");
    else router.push("/sign-in?reset=true");
  }

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500";
    if (passwordStrength <= 50) return "bg-orange-500";
    if (passwordStrength <= 75) return "bg-yellow-500";
    return "bg-emerald-500";
  };

  const getStrengthText = () => {
    if (passwordStrength <= 25) return "Weak";
    if (passwordStrength <= 50) return "Fair";
    if (passwordStrength <= 75) return "Good";
    return "Strong";
  };

  if (!token) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm"
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center mx-auto">
            <XCircle size={28} className="text-red-500" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tighter text-zinc-900">
              Invalid reset link
            </h2>
            <p className="text-sm text-zinc-500">
              This password reset link has expired or is invalid.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left">
            <p className="text-xs text-amber-800 font-medium mb-1">🔐 Common reasons:</p>
            <ul className="text-xs text-amber-700 space-y-1">
              <li>• Link expired (valid for 1 hour)</li>
              <li>• Already used once</li>
              <li>• Copied incorrectly</li>
            </ul>
          </div>

          <Link href="/forgot-password">
            <Button className="w-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest uppercase h-11 gap-2 group">
              Request new link
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm"
    >
      <div className="mb-8">
        <p className="text-xs tracking-widest uppercase text-zinc-400 mb-2">
          Reset password
        </p>
        <h1 className="text-2xl font-semibold tracking-tighter text-zinc-900 mb-2">
          Set new password
        </h1>
        <p className="text-sm text-zinc-500 leading-relaxed">
          Choose a strong password that you haven't used before.
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label className="text-xs font-medium tracking-widest uppercase text-zinc-500">
            New password
          </Label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              required
              minLength={8}
              onChange={(e) => checkPasswordStrength(e.target.value)}
              className="h-12 pl-10 pr-12 border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-300 focus-visible:ring-1 focus-visible:ring-zinc-900 focus-visible:border-zinc-900 text-sm rounded-lg"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Password strength meter */}
          {passwordStrength > 0 && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${passwordStrength}%` }}
                    className={`h-full ${getStrengthColor()}`}
                  />
                </div>
                <span className="text-xs text-zinc-500 ml-3 min-w-[40px]">
                  {getStrengthText()}
                </span>
              </div>
              <ul className="grid grid-cols-2 gap-1 text-xs text-zinc-400">
                <li className="flex items-center gap-1">
                  <span className={`w-1 h-1 rounded-full ${passwordStrength >= 25 ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                  Min. 8 characters
                </li>
                <li className="flex items-center gap-1">
                  <span className={`w-1 h-1 rounded-full ${passwordStrength >= 50 ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                  Lowercase letter
                </li>
                <li className="flex items-center gap-1">
                  <span className={`w-1 h-1 rounded-full ${passwordStrength >= 75 ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                  Uppercase letter
                </li>
                <li className="flex items-center gap-1">
                  <span className={`w-1 h-1 rounded-full ${passwordStrength >= 100 ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                  Number
                </li>
              </ul>
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading || passwordStrength < 50}
          className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest uppercase font-medium gap-2 rounded-lg group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <>
              <span>Reset password</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-zinc-100">
        <div className="flex items-center justify-between">
          <Link 
            href="/sign-in" 
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-900 transition-colors group"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            <span className="tracking-widest uppercase">Back to sign in</span>
          </Link>
          <Link 
            href="/forgot-password" 
            className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors underline underline-offset-2"
          >
            Request new link
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-white flex font-mono">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-zinc-950 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black" />
        
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "32px 32px"
          }} 
        />

        <div className="absolute top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="relative flex items-center gap-3 z-10">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center group hover:scale-105 transition-transform">
            <div className="w-5 h-5 bg-zinc-950 rounded-md group-hover:rotate-12 transition-transform" />
          </div>
          <span className="text-white text-lg font-medium tracking-widest uppercase">StayDirect</span>
        </div>

        {/* Password tips */}
        <div className="relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-emerald-400" />
              <span className="text-xs tracking-widest uppercase text-white/40">Password tips</span>
            </div>

            <div className="space-y-3">
              {[
                "Use at least 8 characters",
                "Mix uppercase & lowercase",
                "Include numbers",
                "Avoid common words",
              ].map((tip, i) => (
                <motion.div
                  key={tip}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 size={12} className="text-emerald-400/60" />
                  <span className="text-sm text-white/60">{tip}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 border border-white/10 rounded-xl p-5"
          >
            <p className="text-xs text-white/30 mb-1">🔐 Security note</p>
            <p className="text-sm text-white/50">
              Never share your password. We'll never ask for it via email.
            </p>
          </motion.div>
        </div>

        <p className="relative z-10 text-xs text-white/30">
          Protected by 256-bit encryption
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-12 py-12">
        <div className="max-w-md w-full mx-auto">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-zinc-950 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm" />
            </div>
            <span className="text-zinc-900 text-sm font-medium tracking-widest uppercase">StayDirect</span>
          </div>

          <Suspense fallback={
            <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center">
              <Loader2 size={20} className="animate-spin text-zinc-400 mx-auto" />
              <p className="text-xs text-zinc-400 mt-3">Loading...</p>
            </div>
          }>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}