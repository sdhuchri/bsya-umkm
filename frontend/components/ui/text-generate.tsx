"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";

// Text Generate Effect (Aceternity-style) — words fade/blur in one by one.
export function TextGenerate({ words, className }: { words: string; className?: string }) {
  const arr = words.split(" ");
  return (
    <span className={cn(className)}>
      {arr.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </span>
  );
}
