// app/(auth)/signup/page.tsx
'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Hotel, Mail, Lock, User, Loader2, Eye, EyeOff, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signupAction } from '@/actions/auth-actions'
import { toast } from 'sonner'

export default function SignupPage() {
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await signupAction(formData)
      if (result?.error) {
        toast.error(result.error)
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-200">
              <Hotel className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">StayDirect</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-100 p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
            <p className="mt-1 text-sm text-slate-500">Start accepting direct bookings today</p>
          </div>

          {/* Benefits */}
          <div className="mb-6 space-y-2">
            {['Free 14-day trial', 'No credit card required', 'Setup in under 3 minutes'].map((b) => (
              <div key={b} className="flex items-center gap-2 text-sm text-slate-600">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100">
                  <Check className="h-2.5 w-2.5 text-emerald-600" />
                </div>
                {b}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  className="pl-10"
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@yourhotel.com"
                  className="pl-10"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  className="pl-10 pr-10"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="brand"
              size="lg"
              className="w-full mt-2"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create free account'
              )}
            </Button>
          </form>

          <p className="mt-4 text-xs text-center text-slate-400">
            By creating an account, you agree to our{' '}
            <Link href="#" className="underline hover:text-slate-600">Terms</Link>
            {' '}and{' '}
            <Link href="#" className="underline hover:text-slate-600">Privacy Policy</Link>
          </p>

          <div className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-violet-600 hover:text-violet-700">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
