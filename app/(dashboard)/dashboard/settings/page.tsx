// app/(dashboard)/dashboard/settings/page.tsx
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Shield, Bell } from 'lucide-react'

export default async function SettingsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your account and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your personal account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Full name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input defaultValue={user.name} className="pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input defaultValue={user.email} type="email" className="pl-10" readOnly />
            </div>
          </div>
          <Button variant="brand" size="sm">Save changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Update your password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current password</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label>New password</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label>Confirm new password</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button variant="outline" size="sm">
            <Shield className="h-4 w-4" />
            Update password
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Your current plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-xl bg-violet-50 border border-violet-100 p-4">
            <div>
              <p className="font-semibold text-violet-900">Professional Plan</p>
              <p className="text-sm text-violet-700 mt-0.5">$79/month · Billed monthly</p>
            </div>
            <Badge className="bg-violet-600 text-white border-0">Active</Badge>
          </div>
          <div className="mt-4 flex gap-3">
            <Button variant="outline" size="sm">Manage billing</Button>
            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
              Cancel plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
