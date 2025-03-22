"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-24 h-24",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        {/* Outer capsule with gradient */}
        <div 
          className={cn(
            "relative rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center",
            sizeClasses[size],
            "animate-pulse duration-[4000ms]"
          )}
        >
          {/* Inner capsule */}
          <div 
            className={cn(
              "rounded-full bg-primary/30 absolute",
              size === "sm" ? "w-6 h-6" : size === "md" ? "w-10 h-10" : "w-20 h-20",
            )}
          >
            {/* Shine effect */}
            <div 
              className={cn(
                "absolute rounded-full bg-white/40 blur-[1px]", 
                size === "sm" ? "w-2 h-2 top-1 left-1" : 
                size === "md" ? "w-3 h-3 top-1.5 left-1.5" : 
                "w-6 h-6 top-3 left-3"
              )}
            />
          </div>
          
          {/* Clock symbol */}
          <div 
            className={cn(
              "rounded-full border-2 border-background absolute flex items-center justify-center",
              size === "sm" ? "w-4 h-4" : size === "md" ? "w-6 h-6" : "w-12 h-12",
            )}
          >
            {/* Clock hands */}
            <div 
              className={cn(
                "absolute bg-background rounded-full",
                size === "sm" ? "w-0.5 h-1.5" : size === "md" ? "w-0.5 h-2" : "w-1 h-4",
                "origin-bottom animate-spin duration-[10000ms]"
              )}
              style={{ 
                transformOrigin: "bottom", 
                bottom: "50%",
              }}
            />
            <div 
              className={cn(
                "absolute bg-background rounded-full",
                size === "sm" ? "w-0.5 h-1" : size === "md" ? "w-0.5 h-1.5" : "w-1 h-3",
                "origin-bottom animate-spin duration-[60000ms]"
              )}
              style={{ 
                transformOrigin: "bottom", 
                bottom: "50%",
              }}
            />
            
            {/* Center dot */}
            <div 
              className={cn(
                "absolute rounded-full bg-background",
                size === "sm" ? "w-0.5 h-0.5" : size === "md" ? "w-1 h-1" : "w-1.5 h-1.5",
              )}
            />
          </div>
          
          {/* Lock icon */}
          <div 
            className={cn(
              "absolute",
              size === "sm" ? "bottom-0 right-0" : size === "md" ? "bottom-0 right-0" : "bottom-1 right-1",
            )}
          >
            <div 
              className={cn(
                "bg-background rounded-full flex items-center justify-center",
                size === "sm" ? "w-3 h-3" : size === "md" ? "w-5 h-5" : "w-8 h-8",
              )}
            >
              <Lock 
                className={cn(
                  "text-primary",
                  size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-5 h-5",
                )} 
              />
            </div>
          </div>
        </div>
        
        {/* Glow effect behind logo */}
        <div 
          className={cn(
            "absolute rounded-full bg-primary/20 blur-xl -z-10",
            size === "sm" ? "w-8 h-8 -top-1 -left-1" : 
            size === "md" ? "w-14 h-14 -top-1 -left-1" : 
            "w-28 h-28 -top-2 -left-2"
          )}
        />
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={cn("font-bold tracking-tight", textSizeClasses[size])}>
            TimeCapsule
          </span>
          {size === "lg" && (
            <span className="text-xs text-muted-foreground mt-0.5">
              Securely encrypt your memories
            </span>
          )}
        </div>
      )}
    </div>
  );
} 