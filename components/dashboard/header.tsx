// components/dashboard/header.tsx
'use client'

import { Bell, Search, Menu } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getInitials } from '@/lib/utils'

interface HeaderProps {
  user: {
    name: string
    email: string
  }
}

export function DashboardHeader({ user }: HeaderProps) {
  return (
    <header className="flex h-16 items-center gap-4 border-b border-slate-100 bg-white px-6">
      {/* Mobile menu */}
      <Button variant="ghost" size="icon" className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search */}
      <div className="relative flex-1 max-w-md hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search bookings, rooms..."
          className="pl-9 bg-slate-50 border-slate-200 focus:bg-white"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4 text-slate-600" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-violet-600" />
        </Button>

        {/* User avatar */}
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
