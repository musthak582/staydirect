// app/page.tsx
import Link from 'next/link'
import {
  ArrowRight,
  Check,
  Hotel,
  TrendingUp,
  Globe,
  CreditCard,
  BarChart3,
  Calendar,
  Star,
  Shield,
  Zap,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const features = [
  {
    icon: Globe,
    title: 'Instant Booking Website',
    description: 'Get a professional booking website in minutes. Your hotel.staydirect.com goes live instantly.',
    color: 'bg-violet-50 text-violet-600',
  },
  {
    icon: CreditCard,
    title: 'Zero Commission',
    description: 'Keep 100% of your booking revenue. No per-booking fees, just a simple monthly subscription.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Calendar,
    title: 'Availability Calendar',
    description: 'Real-time availability management prevents double bookings and keeps guests informed.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track bookings, revenue, and occupancy rates with beautiful visual dashboards.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Star,
    title: 'Guest Reviews',
    description: 'Collect and showcase authentic guest reviews to build trust and increase bookings.',
    color: 'bg-rose-50 text-rose-600',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Accept online payments securely. Multiple payment methods supported.',
    color: 'bg-indigo-50 text-indigo-600',
  },
]

const plans = [
  {
    name: 'Starter',
    price: 29,
    description: 'Perfect for small guesthouses',
    features: [
      'Up to 5 rooms',
      'Direct booking website',
      'Booking management',
      'Basic analytics',
      'Email support',
    ],
    cta: 'Start free trial',
    popular: false,
  },
  {
    name: 'Professional',
    price: 79,
    description: 'For growing hotels',
    features: [
      'Unlimited rooms',
      'Custom domain',
      'Advanced analytics',
      'Payment processing',
      'Review management',
      'Priority support',
      'Multi-language',
    ],
    cta: 'Start free trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 199,
    description: 'For hotel chains & resorts',
    features: [
      'Multiple properties',
      'White-label solution',
      'API access',
      'Custom integrations',
      'Dedicated manager',
      '99.9% SLA',
    ],
    cta: 'Contact sales',
    popular: false,
  },
]

const stats = [
  { value: '2,400+', label: 'Hotels using StayDirect' },
  { value: '$12M+', label: 'Saved in commissions' },
  { value: '98%', label: 'Customer satisfaction' },
  { value: '3 min', label: 'Average setup time' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
                <Hotel className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">StayDirect</span>
            </div>
            <div className="hidden items-center gap-8 md:flex">
              <Link href="#features" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Pricing
              </Link>
              <Link href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Docs
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link href="/signup">
                <Button variant="brand" size="sm">
                  Start free <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-violet-50 to-transparent rounded-b-full opacity-60" />
          <div className="absolute top-40 left-20 w-72 h-72 bg-violet-100 rounded-full blur-3xl opacity-30" />
          <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="mx-auto max-w-7xl px-6 text-center">
          <Badge variant="secondary" className="mb-6 inline-flex gap-1.5 px-4 py-1.5">
            <Zap className="h-3.5 w-3.5 text-violet-600" />
            <span className="text-violet-700 font-medium">Stop paying 15–30% OTA commissions</span>
          </Badge>

          <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
            Your hotel.{' '}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Your bookings.
            </span>
            <br />
            Your revenue.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 leading-relaxed">
            Build a professional direct booking website for your hotel in minutes.
            Accept reservations without paying Booking.com or Expedia their cut.
            Keep every dollar you earn.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button variant="brand" size="xl" className="gap-2">
                Create your booking site free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="xl">
                See how it works
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-sm text-slate-400">
            14-day free trial · No credit card required · Setup in 3 minutes
          </p>

          {/* Dashboard Preview */}
          <div className="mt-16 mx-auto max-w-5xl">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200 overflow-hidden">
              <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
                <div className="ml-4 flex-1 rounded-lg bg-slate-200 h-5 max-w-xs text-xs text-slate-500 flex items-center px-3">
                  dashboard.staydirect.io
                </div>
              </div>
              <div className="p-8 bg-slate-50 grid grid-cols-3 gap-4">
                {[
                  { label: 'Total Revenue', value: '$24,840', change: '+18%', color: 'text-emerald-600' },
                  { label: 'Total Bookings', value: '142', change: '+23%', color: 'text-violet-600' },
                  { label: 'Occupancy Rate', value: '76%', change: '+5%', color: 'text-blue-600' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
                    <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className={`mt-1 text-xs font-medium ${stat.color}`}>{stat.change} this month</p>
                  </div>
                ))}
                <div className="col-span-3 rounded-xl bg-white p-4 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-slate-900">Recent Bookings</p>
                    <Badge variant="secondary" className="text-xs">Live</Badge>
                  </div>
                  <div className="space-y-2">
                    {[
                      { guest: 'Sarah Johnson', room: 'Deluxe Ocean View', dates: 'Dec 24–28', status: 'Confirmed', amount: '$840' },
                      { guest: 'Marco Rossi', room: 'Standard Room', dates: 'Dec 26–30', status: 'Pending', amount: '$560' },
                      { guest: 'Emma Wilson', room: 'Suite Premium', dates: 'Jan 2–7', status: 'Confirmed', amount: '$1,250' },
                    ].map((booking) => (
                      <div key={booking.guest} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                        <div className="flex items-center gap-3">
                          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                            {booking.guest[0]}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-900">{booking.guest}</p>
                            <p className="text-xs text-slate-400">{booking.room} · {booking.dates}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-2 py-0.5 rounded-lg font-medium ${booking.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                            {booking.status}
                          </span>
                          <span className="text-xs font-semibold text-slate-900">{booking.amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-slate-900">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 text-violet-700">
              Everything you need
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900">
              Built for hospitality businesses
            </h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
              Everything you need to run your direct booking operation, from website to payment processing.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200"
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900">Get started in 3 steps</h2>
            <p className="mt-4 text-lg text-slate-500">Your booking site goes live in under 5 minutes</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Create your account',
                description: 'Sign up and set up your hotel profile with photos, description, and contact info.',
              },
              {
                step: '02',
                title: 'Add your rooms',
                description: 'List your rooms with prices, amenities, capacity, and beautiful photos.',
              },
              {
                step: '03',
                title: 'Share your booking link',
                description: 'Share yourhotel.staydirect.com and start receiving direct bookings immediately.',
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-black text-slate-100 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-slate-900 -mt-4">{item.title}</h3>
                <p className="mt-2 text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 text-violet-700">Simple pricing</Badge>
            <h2 className="text-4xl font-bold text-slate-900">Plans that grow with you</h2>
            <p className="mt-4 text-lg text-slate-500">
              All plans include a 14-day free trial. No credit card required.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-xl shadow-violet-200'
                    : 'bg-white border border-slate-200 shadow-sm'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-amber-400 text-amber-900 border-0 px-3 py-1">
                      Most popular
                    </Badge>
                  </div>
                )}
                <div>
                  <h3 className={`text-lg font-bold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mt-1 ${plan.popular ? 'text-violet-200' : 'text-slate-500'}`}>
                    {plan.description}
                  </p>
                </div>
                <div className="mt-6">
                  <span className={`text-5xl font-black ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                    ${plan.price}
                  </span>
                  <span className={`text-sm ml-1 ${plan.popular ? 'text-violet-200' : 'text-slate-500'}`}>
                    /month
                  </span>
                </div>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <Check className={`h-4 w-4 shrink-0 ${plan.popular ? 'text-violet-200' : 'text-emerald-500'}`} />
                      <span className={plan.popular ? 'text-violet-100' : 'text-slate-700'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link href="/signup">
                    <Button
                      className="w-full"
                      variant={plan.popular ? 'outline' : 'default'}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold text-white">
            Ready to take back your revenue?
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Join thousands of hotels already using StayDirect to accept bookings without commissions.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button variant="brand" size="xl">
                Start your free trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="text-sm text-slate-400">No credit card · 14-day trial · Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
                <Hotel className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold text-slate-900">StayDirect</span>
            </div>
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} StayDirect. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-slate-400 hover:text-slate-600">Privacy</Link>
              <Link href="#" className="text-sm text-slate-400 hover:text-slate-600">Terms</Link>
              <Link href="#" className="text-sm text-slate-400 hover:text-slate-600">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
