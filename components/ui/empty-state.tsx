"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ElementType;
  action?: {
    label: string;
    href: string;
    icon?: React.ElementType;
  };
  className?: string;
}

export function EmptyState({ 
  title, 
  description, 
  icon: Icon, 
  action,
  className 
}: EmptyStateProps) {
  return (
    <div className={cn(
      "relative bg-white border border-zinc-200 rounded-2xl p-12 text-center overflow-hidden group",
      className
    )}>
      {/* Dot pattern background */}
      <div 
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: "radial-gradient(circle, #d4d4d8 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }} 
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-white/90" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="w-20 h-20 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-zinc-900 transition-all duration-300">
          {Icon ? (
            <Icon size={32} className="text-zinc-500 group-hover:text-white transition-colors duration-300" />
          ) : (
            <div className="w-10 h-10 border-2 border-zinc-300 rounded-lg" />
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">{title}</h3>
        <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-8">{description}</p>
        
        {action && (
          <Link href={action.href}>
            <Button className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest uppercase h-12 px-8 gap-2 group/btn">
              {action.icon && <action.icon size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />}
              {action.label}
              <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}