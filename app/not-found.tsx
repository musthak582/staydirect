// app/not-found.tsx
import Link from 'next/link'
import { Hotel, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 mx-auto mb-6">
          <Hotel className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-6xl font-black text-slate-200 mb-4">404</h1>
        <h2 className="text-xl font-bold text-slate-900">Page not found</h2>
        <p className="mt-2 text-slate-500 max-w-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="mt-6 inline-block">
          <Button variant="brand" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  )
}
