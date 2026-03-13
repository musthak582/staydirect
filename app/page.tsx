// app/maintenance/page.tsx
import type { Metadata } from 'next'
import { Hotel, Wrench } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Down for maintenance — StayDirect',
  description: "StayDirect is currently undergoing scheduled maintenance. We'll be back shortly.",
}

type StepState = 'done' | 'active' | 'pending'

const steps: { label: string; state: StepState }[] = [
  { label: 'Database backup complete', state: 'done'    },
  { label: 'Schema migration',         state: 'done'    },
  { label: 'Deploying updates',        state: 'active'  },
  { label: 'Final checks & restart',   state: 'pending' },
]

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">

      {/* Logo — matches your dashboard sidebar */}
      <div className="flex items-center gap-2 mb-10">
        <div className="h-[34px] w-[34px] rounded-[10px] bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
          <Hotel className="h-[18px] w-[18px] text-white" />
        </div>
        <span className="text-[18px] font-bold text-slate-900 tracking-tight">
          StayDirect
        </span>
      </div>

      {/* Card — matches your dashboard card style */}
      <div className="w-full max-w-[480px] bg-white border border-slate-200 rounded-2xl px-10 py-10 text-center">

        {/* Violet gradient icon — matches your dashboard icon pattern */}
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-200 flex items-center justify-center mx-auto mb-5">
          <Wrench className="h-7 w-7 text-white" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-medium px-3 py-1 mb-5">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
          Scheduled maintenance
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2.5">
          We&apos;ll be right back
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed mb-7">
          StayDirect is currently undergoing scheduled maintenance.
          We&apos;re making improvements to serve you better.
          Everything will be back shortly.
        </p>

        {/* ETA row — matches your dashboard info rows */}
        <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 mb-5">
          <span className="text-[13px] text-slate-500">Estimated completion</span>
          <span className="text-[13px] font-semibold text-slate-900">
            Today, 3:00 PM UTC
          </span>
        </div>

        {/* Progress bar — violet/indigo gradient matching your brand button */}
        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mb-6">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600"
            style={{ width: '68%' }}
          />
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-2.5 text-left mb-7">
          {steps.map(({ label, state }) => (
            <div key={label} className="flex items-center gap-2.5">
              <div
                className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${
                  state === 'done'
                    ? 'bg-emerald-50'
                    : state === 'active'
                    ? 'bg-violet-50'
                    : 'bg-slate-100'
                }`}
              >
                {state === 'done' && (
                  <svg
                    className="h-2.5 w-2.5 text-emerald-600"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="2 6 5 9 10 3" />
                  </svg>
                )}
                {state === 'active' && (
                  <svg
                    className="h-2.5 w-2.5 text-violet-600"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M6 2v2M6 8v2M2 6h2M8 6h2" />
                  </svg>
                )}
                {state === 'pending' && (
                  <svg
                    className="h-2.5 w-2.5 text-slate-300"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <circle cx="6" cy="6" r="3.5" />
                  </svg>
                )}
              </div>
              <span
                className={`text-[13px] ${
                  state === 'done'
                    ? 'text-slate-400 line-through'
                    : state === 'active'
                    ? 'text-slate-900 font-semibold'
                    : 'text-slate-400'
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 mb-5" />

        {/* Footer links */}
        <div className="flex justify-center gap-5">
          <a
            href="#"
            className="text-[13px] text-slate-400 hover:text-slate-700 transition-colors"
          >
            Status page
          </a>
          <a
            href="#"
            className="text-[13px] text-slate-400 hover:text-slate-700 transition-colors"
          >
            Contact support
          </a>
          <a
            href="#"
            className="text-[13px] text-slate-400 hover:text-slate-700 transition-colors"
          >
            @staydirect
          </a>
        </div>
      </div>

      {/* Bottom copyright */}
      <p className="mt-6 text-xs text-slate-400">
        © {new Date().getFullYear()} StayDirect. All rights reserved.
      </p>
    </div>
  )
}
