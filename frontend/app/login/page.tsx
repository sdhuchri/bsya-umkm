"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { Mark } from "@/components/ui";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { getProfile, setLoggedIn } from "@/lib/profile";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoggedIn(true); // simulated login
    router.replace(getProfile() ? "/dashboard" : "/onboarding");
  };

  return (
    <AuroraBackground className="min-h-screen bg-ink px-5 py-10 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 w-full max-w-[420px] rounded-[26px] border border-white/10 bg-white p-9 shadow-[0_30px_70px_rgba(0,0,0,0.35)]"
      >
        <Link href="/" className="mb-7 flex items-center gap-3">
          <Mark size={46} />
          <div>
            <div className="text-[22px] font-black tracking-tight text-ink">
              BSya <span className="text-yellowdeep">Grow</span>
            </div>
            <div className="text-[10.5px] font-bold uppercase tracking-wider text-muted">Super App · Powered by AI</div>
          </div>
        </Link>

        <h1 className="text-2xl font-black tracking-tight text-ink">Masuk ke akunmu</h1>
        <p className="mb-6 mt-1.5 text-[13.5px] font-semibold text-ink2">Kelola keuangan, pajak, dan modal usahamu dalam satu tempat.</p>

        <form onSubmit={submit} className="flex flex-col gap-3.5">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-extrabold text-ink2">Nomor HP / Email</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0812xxxxxxx" className="rounded-xl border-[1.5px] border-line bg-white px-4 py-3 text-sm font-bold text-ink outline-none transition focus:border-sky" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-extrabold text-ink2">PIN / Password</span>
            <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="••••••" className="rounded-xl border-[1.5px] border-line bg-white px-4 py-3 text-sm font-bold text-ink outline-none transition focus:border-sky" />
          </label>

          <button type="submit" className="group mt-2 flex items-center justify-center gap-2 rounded-full bg-ink py-4 text-[15px] font-extrabold text-white shadow-[0_8px_20px_rgba(11,39,64,0.18)] transition hover:scale-[1.01]">
            Masuk
            <span className="grid h-6 w-6 place-items-center rounded-full bg-yellow text-sm font-black text-ink transition group-hover:translate-x-0.5">→</span>
          </button>
        </form>

        <p className="mt-[18px] text-center text-[11.5px] font-semibold leading-relaxed text-muted">
          Mode prototipe — login disimulasikan. Cukup tekan <b className="text-ink2">Masuk</b> untuk mencoba.
        </p>
      </motion.div>
    </AuroraBackground>
  );
}
