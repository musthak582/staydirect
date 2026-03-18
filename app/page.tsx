"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  BarChart3, 
  ChevronRight,
  Hotel,
  DollarSign,
  Globe,
  CalendarCheck,
  Star,
  Users,
  Sparkles,
  CheckCircle,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-mono">
      {/* Dot grid background */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #d4d4d8 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }} 
      />

      {/* Nav */}
      <nav className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled 
          ? 'bg-white/80 backdrop-blur-md border-b border-zinc-200 py-3' 
          : 'bg-transparent py-5'
        }
      `}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-zinc-950 rounded-lg flex items-center justify-center transition-all group-hover:rounded-xl group-hover:scale-105">
              <div className="w-4 h-4 bg-white rounded-sm group-hover:rotate-12 transition-transform" />
            </div>
            <span className="text-zinc-900 text-sm font-medium tracking-widest uppercase">
              StayDirect
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-xs tracking-widest uppercase text-zinc-400">
            <a href="#features" className="hover:text-zinc-900 transition-colors relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-zinc-900 group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#how-it-works" className="hover:text-zinc-900 transition-colors relative group">
              How it works
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-zinc-900 group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#pricing" className="hover:text-zinc-900 transition-colors relative group">
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-zinc-900 group-hover:w-full transition-all duration-300" />
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" className="text-xs tracking-widest uppercase text-zinc-500 hover:text-zinc-900 h-9 px-4">
                Sign in
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest uppercase h-9 px-5 gap-1.5 group">
                Get started <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center">
          {/* Animated badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="border-zinc-300 text-zinc-500 text-xs tracking-widest uppercase gap-2 mb-8 h-8 font-normal hover:border-zinc-400 transition-colors">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Save 15-30% on every booking
            </Badge>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-semibold tracking-tighter leading-none text-zinc-900 max-w-4xl mx-auto mb-6"
          >
            Your own booking site.
            <br />
            <span className="relative">
              <span className="italic font-light text-zinc-400">zero</span>
              <span className="absolute -bottom-2 left-0 w-full h-px bg-zinc-200" />
            </span>
            <span className="text-zinc-900"> commission.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-zinc-500 max-w-2xl mx-auto text-sm leading-relaxed mb-10"
          >
            Stop paying 15-30% to OTAs. Get your own professional booking website in minutes. 
            Accept direct bookings, manage rooms, and keep every dollar.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link href="/sign-up">
              <Button className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest uppercase h-14 px-10 gap-2 group text-base">
                Start your 14-day free trial
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" className="border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 text-xs tracking-widest uppercase h-14 px-10 gap-2">
                Watch demo <ChevronRight size={14} />
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
          >
            {[
              { value: "$12k", label: "Avg. annual savings", icon: DollarSign },
              { value: "5min", label: "Setup time", icon: Zap },
              { value: "100%", label: "Direct bookings", icon: Globe },
              { value: "24/7", label: "Support", icon: Users },
            ].map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                  <stat.icon size={16} className="text-zinc-600 group-hover:text-white transition-colors" />
                </div>
                <p className="text-xl font-semibold text-zinc-900">{stat.value}</p>
                <p className="text-xs tracking-widest uppercase text-zinc-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="relative py-24 px-6 border-t border-zinc-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-zinc-300 text-zinc-500 text-xs tracking-widest uppercase mb-4">
              The problem
            </Badge>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter text-zinc-900 mb-4">
              OTAs take <span className="text-red-500">15-30%</span> of every booking
            </h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">
              While you do all the work, Booking.com and Expedia take a massive cut. 
              It's time to take back control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <X size={16} className="text-red-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-red-900">Traditional OTAs</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-red-700">
                    <span className="w-1 h-1 bg-red-400 rounded-full" />
                    15-30% commission on every booking
                  </li>
                  <li className="flex items-center gap-2 text-sm text-red-700">
                    <span className="w-1 h-1 bg-red-400 rounded-full" />
                    Your customers belong to them
                  </li>
                  <li className="flex items-center gap-2 text-sm text-red-700">
                    <span className="w-1 h-1 bg-red-400 rounded-full" />
                    Limited control over your brand
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <CheckCircle size={16} className="text-emerald-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-emerald-900">StayDirect</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-emerald-700">
                    <span className="w-1 h-1 bg-emerald-400 rounded-full" />
                    0% commission. Keep every dollar
                  </li>
                  <li className="flex items-center gap-2 text-sm text-emerald-700">
                    <span className="w-1 h-1 bg-emerald-400 rounded-full" />
                    Build direct relationships with guests
                  </li>
                  <li className="flex items-center gap-2 text-sm text-emerald-700">
                    <span className="w-1 h-1 bg-emerald-400 rounded-full" />
                    Your brand, your rules, your site
                  </li>
                </ul>
              </div>

              {/* Savings calculator */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
                <p className="text-xs tracking-widest uppercase text-zinc-400 mb-2">Annual savings calculator</p>
                <p className="text-3xl font-semibold text-zinc-900 mb-2">$12,000+</p>
                <p className="text-xs text-zinc-500">Based on 50 bookings/year at $200/night</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-6 bg-zinc-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-zinc-300 text-zinc-500 text-xs tracking-widest uppercase mb-4">
              Everything you need
            </Badge>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter text-zinc-900 mb-4">
              Run your hotel like a pro
            </h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">
              Professional tools that are actually easy to use. No technical skills required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Globe,
                title: "Your own website",
                desc: "Get a beautiful, mobile-friendly booking site at hotelname.staydirect.com",
                features: ["Custom domain support", "Mobile responsive", "SEO optimized"]
              },
              {
                icon: CalendarCheck,
                title: "Smart booking engine",
                desc: "Real-time availability, instant confirmations, and automated emails",
                features: ["Availability calendar", "Prevent double bookings", "Email notifications"]
              },
              {
                icon: DollarSign,
                title: "Direct payments",
                desc: "Accept payments directly with Stripe. No commission, just small transaction fees.",
                features: ["Credit cards", "Deposits", "Instant payouts"]
              },
              {
                icon: Hotel,
                title: "Room management",
                desc: "Easily manage rooms, pricing, and availability from one dashboard",
                features: ["Bulk updates", "Seasonal pricing", "Photo gallery"]
              },
              {
                icon: BarChart3,
                title: "Analytics",
                desc: "Understand your business with clear insights and reports",
                features: ["Revenue reports", "Occupancy rates", "Booking trends"]
              },
              {
                icon: Shield,
                title: "Secure & reliable",
                desc: "Enterprise-grade security with 99.9% uptime. Your data is safe with us.",
                features: ["SSL encryption", "Daily backups", "GDPR compliant"]
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-zinc-200 rounded-xl p-6 hover:border-zinc-400 hover:shadow-lg transition-all group"
              >
                <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                  <feature.icon size={18} className="text-zinc-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 mb-2">{feature.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed mb-4">{feature.desc}</p>
                <ul className="space-y-1.5">
                  {feature.features.map((item) => (
                    <li key={item} className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <CheckCircle size={10} className="text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-zinc-300 text-zinc-500 text-xs tracking-widest uppercase mb-4">
              Simple setup
            </Badge>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter text-zinc-900 mb-4">
              Get live in minutes
            </h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">
              Three simple steps to start accepting direct bookings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create your profile",
                desc: "Add your hotel name, location, and beautiful photos.",
                icon: Hotel
              },
              {
                step: "02",
                title: "Add your rooms",
                desc: "List each room with pricing, capacity, and amenities.",
                icon: Users
              },
              {
                step: "03",
                title: "Start booking",
                desc: "Share your unique link and watch bookings roll in.",
                icon: Sparkles
              }
            ].map((step) => (
              <div key={step.step} className="text-center group">
                <div className="relative inline-block mb-6">
                  <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center group-hover:bg-zinc-900 transition-colors mx-auto">
                    <step.icon size={24} className="text-zinc-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-zinc-900 text-white rounded-full flex items-center justify-center text-xs font-mono">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 mb-2">{step.title}</h3>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Preview */}
          <div className="mt-16 bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10">
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <span className="ml-2 text-xs text-white/30 tracking-widest">grand-hotel.staydirect.com</span>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl" />
                <div>
                  <div className="h-4 w-32 bg-white/20 rounded mb-2" />
                  <div className="h-3 w-24 bg-white/10 rounded" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-24 bg-white/10 rounded-xl" />
                <div className="h-24 bg-white/10 rounded-xl" />
                <div className="h-24 bg-white/10 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative py-24 px-6 bg-zinc-50/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-zinc-300 text-zinc-500 text-xs tracking-widest uppercase mb-4">
              Simple pricing
            </Badge>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter text-zinc-900 mb-4">
              Pay only when you succeed
            </h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">
              No setup fees. No monthly minimums. Just a small fee on bookings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free Trial */}
            <div className="bg-white border border-zinc-200 rounded-xl p-6 hover:border-zinc-400 transition-all">
              <p className="text-xs tracking-widest uppercase text-zinc-400 mb-4">Start free</p>
              <p className="text-3xl font-semibold text-zinc-900 mb-2">$0</p>
              <p className="text-xs text-zinc-500 mb-6">14-day trial · No credit card</p>
              <ul className="space-y-3 mb-6">
                {["Full access to all features", "Test with your own rooms", "Cancel anytime"].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-xs text-zinc-600">
                    <CheckCircle size={12} className="text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up">
                <Button className="w-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest uppercase h-11">
                  Start trial
                </Button>
              </Link>
            </div>

            {/* Growth */}
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 relative transform scale-105 shadow-xl">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs tracking-widest uppercase px-3 py-1 rounded-full">
                Most popular
              </div>
              <p className="text-xs tracking-widest uppercase text-zinc-400 mb-4">Growth</p>
              <p className="text-3xl font-semibold text-white mb-2">1%</p>
              <p className="text-xs text-zinc-400 mb-6">per booking + Stripe fees</p>
              <ul className="space-y-3 mb-6">
                {[
                  "Everything in Free",
                  "Priority support",
                  "Advanced analytics",
                  "Custom domain",
                  "Bulk email tools"
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-xs text-zinc-300">
                    <CheckCircle size={12} className="text-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up">
                <Button className="w-full bg-white text-zinc-900 hover:bg-zinc-100 text-xs tracking-widest uppercase h-11">
                  Get started
                </Button>
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-white border border-zinc-200 rounded-xl p-6 hover:border-zinc-400 transition-all">
              <p className="text-xs tracking-widest uppercase text-zinc-400 mb-4">Enterprise</p>
              <p className="text-3xl font-semibold text-zinc-900 mb-2">Custom</p>
              <p className="text-xs text-zinc-500 mb-6">For large properties</p>
              <ul className="space-y-3 mb-6">
                {[
                  "Everything in Growth",
                  "API access",
                  "Channel manager",
                  "Dedicated account manager",
                  "Custom integrations"
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-xs text-zinc-600">
                    <CheckCircle size={12} className="text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/contact">
                <Button variant="outline" className="w-full border-zinc-200 text-zinc-600 hover:border-zinc-400 text-xs tracking-widest uppercase h-11">
                  Contact sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-zinc-300 text-zinc-500 text-xs tracking-widest uppercase mb-4">
              Trusted by hoteliers
            </Badge>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter text-zinc-900 mb-4">
              Loved by independent hotels
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                quote: "StayDirect helped us save over $15,000 in commission last year. The setup was incredibly easy and our guests love the simple booking process.",
                author: "Sarah Johnson",
                role: "Owner, Grand Hotel",
                rating: 5
              },
              {
                quote: "Finally, a booking system that's actually built for small hotels. No technical skills needed, and the support team is amazing.",
                author: "Michael Chen",
                role: "Manager, Oceanview Inn",
                rating: 5
              }
            ].map((testimonial) => (
              <div key={testimonial.author} className="bg-white border border-zinc-200 rounded-xl p-6 hover:border-zinc-400 transition-all">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-zinc-600 mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-zinc-600">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-900">{testimonial.author}</p>
                    <p className="text-xs text-zinc-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 px-6 border-t border-zinc-200">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="outline" className="border-zinc-300 text-zinc-500 text-xs tracking-widest uppercase mb-6">
            Start saving today
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter text-zinc-900 mb-6">
            Stop paying commission.
            <br />
            <span className="text-zinc-400">Start keeping more.</span>
          </h2>
          
          <p className="text-zinc-500 text-sm mb-10 max-w-xl mx-auto">
            Join hundreds of hotels already saving thousands with direct bookings.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up">
              <Button className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest uppercase h-14 px-10 gap-2 group text-base">
                Start your free trial
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-zinc-200 text-zinc-600 hover:border-zinc-400 text-xs tracking-widest uppercase h-14 px-10">
                Talk to sales
              </Button>
            </Link>
          </div>

          <p className="text-xs text-zinc-400 mt-6">
            No credit card required · 14-day free trial · Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-zinc-950 rounded-md flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-sm" />
                </div>
                <span className="text-xs text-zinc-900 tracking-widest uppercase font-medium">StayDirect</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The modern way for hotels to accept direct bookings. No commission. No technical skills required.
              </p>
            </div>
            
            <div>
              <h4 className="text-xs tracking-widest uppercase text-zinc-900 font-medium mb-4">Product</h4>
              <ul className="space-y-2">
                {["Features", "Pricing", "How it works", "FAQ"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs tracking-widest uppercase text-zinc-900 font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                {["About", "Blog", "Careers", "Contact"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs tracking-widest uppercase text-zinc-900 font-medium mb-4">Legal</h4>
              <ul className="space-y-2">
                {["Privacy", "Terms", "Security", "GDPR"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-200 flex items-center justify-between">
            <p className="text-xs text-zinc-400">© 2025 StayDirect. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-zinc-400">Powered by Stripe</span>
              <span className="text-xs text-zinc-300">·</span>
              <span className="text-xs text-zinc-400">99.9% uptime</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}