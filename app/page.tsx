// app/maintenance/page.tsx
// To activate: set IS_MAINTENANCE=true in your .env and add a check in middleware.ts
// Or just rename this to app/page.tsx temporarily

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Down for maintenance — StayDirect',
  description: 'StayDirect is currently undergoing scheduled maintenance. We\'ll be back shortly.',
}

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-12 font-sans">
      <div className="w-full max-w-[520px] bg-white border border-slate-100 rounded-2xl p-10 text-center shadow-sm">

        {/* Icon */}
        <div className="h-16 w-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-6">
          <svg
            className="h-7 w-7 text-slate-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-medium px-3 py-1 mb-5">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
          Scheduled maintenance
        </div>

        {/* Heading */}
        <h1 className="text-[22px] font-medium text-slate-900 mb-3">
          We&apos;ll be right back
        </h1>
        <p className="text-[15px] text-slate-500 leading-relaxed mb-8">
          StayDirect is undergoing scheduled maintenance to improve performance and
          reliability. We&apos;ll be back online shortly.
        </p>

        {/* ETA row */}
        <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 mb-6">
          <span className="text-[13px] text-slate-500">Estimated completion</span>
          <span className="text-[14px] font-medium text-slate-900">Today, 3:00 PM UTC</span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-6">
          <div className="h-full w-[72%] bg-blue-500 rounded-full" />
        </div>

        {/* Status list */}
        <div className="flex flex-col gap-2.5 mb-8 text-left">
          <StatusItem state="done"    label="Database backup" />
          <StatusItem state="done"    label="Schema migration" />
          <StatusItem state="active"  label="Deploying updates" />
          <StatusItem state="pending" label="Final checks & restart" />
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 mb-5" />

        {/* Footer links */}
        <div className="flex justify-center gap-5 text-[13px] text-slate-400">
          <a href="#" className="hover:text-slate-700 transition-colors">Status page</a>
          <a href="#" className="hover:text-slate-700 transition-colors">Contact support</a>
          <a href="#" className="hover:text-slate-700 transition-colors">@staydirect</a>
        </div>
      </div>
    </div>
  )
}

// ---- Sub-component ----
type StatusState = 'done' | 'active' | 'pending'

function StatusItem({ state, label }: { state: StatusState; label: string }) {
  return (
    <div className="flex items-center gap-2.5 text-[13px]">
      <div
        className={`h-[18px] w-[18px] rounded-full flex items-center justify-center shrink-0 ${
          state === 'done'
            ? 'bg-emerald-50'
            : state === 'active'
            ? 'bg-blue-50'
            : 'bg-slate-100'
        }`}
      >
        {state === 'done' ? (
          <svg className="h-2.5 w-2.5 text-emerald-600" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="2 6 5 9 10 3" />
          </svg>
        ) : state === 'active' ? (
          <svg className="h-2.5 w-2.5 text-blue-500" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="6" cy="6" r="3.5" />
          </svg>
        ) : (
          <svg className="h-2.5 w-2.5 text-slate-300" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="6" cy="6" r="3.5" />
          </svg>
        )}
      </div>
      <span
        className={
          state === 'done'
            ? 'text-slate-400 line-through'
            : state === 'active'
            ? 'text-slate-900 font-medium'
            : 'text-slate-400'
        }
      >
        {label}
      </span>
    </div>
  )
}
