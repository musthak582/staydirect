"use client"; // Add this at the top

import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Grid Background Component - this can stay as is (no interactive elements)
export function GridBackground({ className }: { className?: string }) {
  return (
    <div
      className={cn("fixed inset-0 pointer-events-none", className)}
      style={{
        backgroundImage: "radial-gradient(circle, #d4d4d8 1px, transparent 1px)",
        backgroundSize: "32px 32px"
      }}
    />
  );
}

// Section Header Component
export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="space-y-1">
        <p className="text-xs tracking-widest uppercase text-zinc-400">{title}</p>
        {subtitle && (
          <p className="text-sm text-zinc-600">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

// Metric Card Component - Accept icon as string and render dynamically
export function MetricCard({
  label,
  value,
  trend,
  icon,
  className,
}: {
  label: string;
  value: string | number;
  trend?: { value: number; positive: boolean };
  icon?: string; // Change from React.ElementType to string
  className?: string;
}) {
  // Map icon strings to actual components
  const getIcon = () => {
    switch (icon) {
      case "dollar":
        return <DollarSign size={14} className="text-zinc-600" />;
      case "calendar":
        return <CalendarCheck size={14} className="text-zinc-600" />;
      case "trending":
        return <TrendingUp size={14} className="text-zinc-600" />;
      case "users":
        return <Users size={14} className="text-zinc-600" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn("bg-white border border-zinc-200 rounded-xl p-6 hover:border-zinc-400 transition-all duration-200", className)}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs tracking-widest uppercase text-zinc-400">{label}</p>
        <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
          {getIcon()}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-semibold tracking-tight text-zinc-900">{value}</p>
        {trend && (
          <span className={cn(
            "text-xs font-medium",
            trend.positive ? "text-emerald-600" : "text-red-600"
          )}>
            {trend.positive ? "+" : "-"}{trend.value}%
          </span>
        )}
      </div>
    </div>
  );
}

// Glass Card Component
export function GlassCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(
      "bg-white/80 backdrop-blur-sm border border-zinc-200 rounded-xl overflow-hidden",
      className
    )}>
      {children}
    </div>
  );
}

// Status Badge Component
export function StatusBadge({ status }: { status: "PENDING" | "CONFIRMED" | "CANCELLED" }) {
  const config = {
    PENDING: {
      label: "Pending",
      className: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500"
    },
    CONFIRMED: {
      label: "Confirmed",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500"
    },
    CANCELLED: {
      label: "Cancelled",
      className: "bg-zinc-50 text-zinc-500 border-zinc-200",
      dot: "bg-zinc-400"
    },
  };

  const { label, className, dot } = config[status];

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs tracking-widest uppercase",
      className
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full", dot)} />
      {label}
    </span>
  );
}

// Quick Action Button
export function QuickActionButton({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon?: string; // Change from React.ElementType to string
}) {
  // Map icon strings to actual components
  const getIcon = () => {
    switch (icon) {
      case "external":
        return <ExternalLink size={12} className="text-zinc-400 group-hover:text-zinc-900 transition-colors" />;
      case "building":
        return <Building2 size={12} className="text-zinc-400 group-hover:text-zinc-900 transition-colors" />;
      case "plus":
        return <Plus size={12} className="text-zinc-400 group-hover:text-zinc-900 transition-colors" />;
      default:
        return null;
    }
  };

  return (
    <Link
      href={href}
      className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-xs tracking-widest uppercase text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all group"
    >
      <span className="flex items-center gap-2">
        {getIcon()}
        {label}
      </span>
      <ArrowRight size={11} className="text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}

// Import icons at the bottom to avoid circular dependencies
import { 
  DollarSign, 
  CalendarCheck, 
  TrendingUp, 
  Users, 
  ExternalLink, 
  Building2, 
  Plus 
} from "lucide-react";