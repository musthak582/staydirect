// actions/auth-actions.ts
'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession, hashPassword, verifyPassword } from '@/lib/auth'
import { generateSlug } from '@/lib/utils'
import { z } from 'zod'

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type ActionResult = {
  success: boolean
  error?: string
  data?: unknown
}

export async function signupAction(formData: FormData): Promise<ActionResult> {
  const rawData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const validated = signupSchema.safeParse(rawData)
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message }
  }

  const { name, email, password } = validated.data

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return { success: false, error: 'Email already registered' }
  }

  const hashedPassword = await hashPassword(password)
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  })

  const session = await getSession()
  session.userId = user.id
  session.userEmail = user.email
  session.userName = user.name
  session.isLoggedIn = true
  await session.save()

  redirect('/dashboard')
}

export async function loginAction(formData: FormData): Promise<ActionResult> {
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const validated = loginSchema.safeParse(rawData)
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message }
  }

  const { email, password } = validated.data

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return { success: false, error: 'Invalid email or password' }
  }

  const isValid = await verifyPassword(password, user.password)
  if (!isValid) {
    return { success: false, error: 'Invalid email or password' }
  }

  const session = await getSession()
  session.userId = user.id
  session.userEmail = user.email
  session.userName = user.name
  session.isLoggedIn = true
  await session.save()

  redirect('/dashboard')
}

export async function logoutAction(): Promise<void> {
  const session = await getSession()
  session.destroy()
  redirect('/login')
}
