// app/(dashboard)/dashboard/layout.tsx
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <DashboardSidebar user={user} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader user={user} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 animate-fade-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
