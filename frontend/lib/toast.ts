// Lightweight toast: fire a global event; <Toaster/> (mounted once) renders them.
export type ToastKind = "ok" | "info";

export function toast(message: string, kind: ToastKind = "ok") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("bsya-toast", { detail: { message, kind } }));
}
