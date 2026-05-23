import React from "react";
import { C, F, r } from "@/lib/theme";

// ─── Smiley logo ───
export function Mark({ size = 32 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: r(size * 0.3),
        background: C.sky,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 24 24">
        <rect x="5" y="5" width="5" height="5" rx={r(1.5)} fill={C.yellow} />
        <rect x="14" y="5" width="5" height="5" rx={r(1.5)} fill={C.yellow} />
        <path d="M5 14 Q 12 21 19 14" stroke={C.yellow} strokeWidth="3.2" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}

// ─── Decorative triangle (Playful vibe) ───
export function Deco({
  size = 24,
  rotate = 0,
  color,
  style = {},
}: {
  size?: number;
  rotate?: number;
  color?: string;
  style?: React.CSSProperties;
}) {
  const c = color || C.yellow;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ transform: `rotate(${rotate}deg)`, ...style }}>
      <path d="M12 2 L22 20 L2 20 Z" fill={c} />
    </svg>
  );
}

export function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
      <div style={{ flex: 1, height: 8, background: C.line, borderRadius: 999, overflow: "hidden" }}>
        <div
          style={{
            width: `${(current / total) * 100}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${C.yellow}, ${C.yellowDeep})`,
            borderRadius: 999,
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <div style={{ fontSize: 12, fontWeight: 800, color: C.ink2, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
        {current}/{total}
      </div>
    </div>
  );
}

export function AIBubble({ text }: { text: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        marginBottom: 18,
        padding: "12px 14px",
        background: C.skySoft,
        borderRadius: r(14),
        border: `1px solid ${C.line}`,
      }}
    >
      <Mark size={32} />
      <div style={{ flex: 1, lineHeight: 1.45 }}>
        <div style={{ fontSize: 10.5, fontWeight: 800, color: C.skyDeep, letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 2 }}>
          BSya AI
        </div>
        <div style={{ fontSize: 13, color: C.ink2, fontWeight: 600 }}>{text}</div>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div
      style={{
        borderRadius: r(18),
        padding: "20px 24px",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(100deg, ${C.sky} 0%, ${C.skyDeep} 100%)`,
        color: C.white,
        flexShrink: 0,
      }}
    >
      <Deco size={42} rotate={18} color="rgba(255,217,61,0.85)" style={{ position: "absolute", right: 28, top: 14 }} />
      <Deco size={22} rotate={-22} color="rgba(255,255,255,0.3)" style={{ position: "absolute", right: 90, bottom: 16 }} />
      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.3 }}>{title}</div>
      <div style={{ fontSize: 13, opacity: 0.92, fontWeight: 500, marginTop: 4 }}>{subtitle}</div>
    </div>
  );
}

export function Chip({
  active,
  multi,
  children,
  onClick,
}: {
  active?: boolean;
  multi?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "14px 16px",
        background: active ? C.sky : C.white,
        color: active ? C.white : C.ink,
        border: `1.5px solid ${active ? C.sky : C.line}`,
        borderRadius: r(14),
        fontFamily: F,
        fontSize: 14,
        fontWeight: 700,
        textAlign: "left",
        cursor: "pointer",
        transition: "all 0.15s",
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
      }}
    >
      <span
        style={{
          width: 20,
          height: 20,
          flexShrink: 0,
          borderRadius: multi ? r(5) : "50%",
          border: `2px solid ${active ? C.white : C.line}`,
          background: active ? C.white : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {active &&
          (multi ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.sky} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5 9-11" />
            </svg>
          ) : (
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.sky }} />
          ))}
      </span>
      <span style={{ flex: 1 }}>{children}</span>
    </button>
  );
}
