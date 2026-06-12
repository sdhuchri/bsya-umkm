"use client";

import React from "react";
import { cn } from "@/lib/cn";

// Aurora background (Aceternity-style), self-contained with the BSya palette.
export function AuroraBackground({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("relative flex flex-col items-center justify-center overflow-hidden", className)}>
      <div
        className="pointer-events-none absolute -inset-[20px] opacity-55 blur-[40px] will-change-transform animate-aurora"
        style={{
          backgroundImage:
            "repeating-linear-gradient(100deg, #29b5e8 0%, #38bdf8 12%, #ffd93d 24%, #0e92c2 36%, #7dd3fc 48%)",
          backgroundSize: "200% 200%",
          backgroundPosition: "50% 50%",
        }}
      />
      <div
        className="pointer-events-none absolute -inset-[20px] opacity-40 blur-[60px] will-change-transform animate-aurora"
        style={{
          backgroundImage:
            "repeating-linear-gradient(60deg, transparent 0%, #ffd93d 20%, transparent 40%, #29b5e8 60%, transparent 80%)",
          backgroundSize: "180% 180%",
          backgroundPosition: "50% 50%",
          animationDirection: "reverse",
        }}
      />
      {children}
    </div>
  );
}
