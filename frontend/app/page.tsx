"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Mark } from "@/components/ui";
import { Ic } from "@/components/icons";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Sparkles } from "@/components/ui/sparkles";
import { TextGenerate } from "@/components/ui/text-generate";
import { getProfile, isLoggedIn } from "@/lib/profile";

const FEATURES = [
  { ic: "chart", title: "Laporan Keuangan", desc: "Laba rugi, neraca, arus kas & SAK EMKM otomatis dari mutasi." },
  { ic: "calc", title: "Pajak AI", desc: "PPh Final UMKM 0.5% terhitung otomatis, plus asisten pajak." },
  { ic: "users", title: "Supplier & Customer", desc: "Kelola jaringan & temukan supplier hemat lewat AI Match." },
  { ic: "megaphone", title: "Iklan AI", desc: "Deskripsikan produk, AI buatkan materi iklan dalam detik." },
  { ic: "wallet", title: "Permodalan", desc: "Plafon pre-approved syariah dari skor kelayakan bisnismu." },
  { ic: "spark", title: "Onboarding AI", desc: "Dipandu BSya AI — dashboard menyesuaikan tipe usahamu." },
];

export default function Landing() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(isLoggedIn() && !!getProfile());
  }, []);

  const cta = authed ? { href: "/dashboard", label: "Buka Dashboard" } : { href: "/login", label: "Masuk ke akun" };

  return (
    <main className="min-h-screen bg-bg font-sans text-ink">
      {/* Hero */}
      <AuroraBackground className="min-h-[88vh] bg-ink">
        <Sparkles className="z-0" count={50} />
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Mark size={72} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold tracking-wide text-white backdrop-blur"
          >
            ✨ SUPER APP UMKM · BCA SYARIAH
          </motion.div>

          <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">
            <TextGenerate words="Kelola seluruh bisnismu" />
            <br />
            <span className="text-yellow">
              <TextGenerate words="dalam satu aplikasi." />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-5 max-w-xl text-base font-medium text-white/80 sm:text-lg"
          >
            Keuangan, pajak, supplier, iklan, dan permodalan — semuanya dibantu AI. Dibuat khusus untuk pelaku UMKM Indonesia.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <Link href={cta.href} className="group inline-flex items-center gap-2 rounded-full bg-yellow px-7 py-3.5 text-sm font-extrabold text-ink shadow-[0_8px_30px_rgba(255,217,61,0.35)] transition hover:scale-[1.03]">
              {cta.label}
              <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-yellow transition group-hover:translate-x-0.5">→</span>
            </Link>
            <a href="#fitur" className="rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10">
              Lihat fitur
            </a>
          </motion.div>
        </div>
      </AuroraBackground>

      {/* Features */}
      <section id="fitur" className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <div className="text-xs font-extrabold uppercase tracking-widest text-skydeep">Semua dalam satu tempat</div>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-4xl">Enam modul untuk UMKM naik kelas</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-medium text-ink2">
            Dari pencatatan harian sampai akses modal — tidak perlu lagi lompat-lompat aplikasi.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group rounded-3xl border border-line bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(11,39,64,0.1)]"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-skysoft">{Ic[f.ic](22, "#0E92C2")}</div>
              <div className="mt-4 text-lg font-extrabold tracking-tight text-ink">{f.title}</div>
              <div className="mt-1.5 text-sm font-medium leading-relaxed text-ink2">{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky to-skydeep px-8 py-16 text-center text-white">
          <Sparkles count={30} color="#ffffff" />
          <div className="relative z-10">
            <h3 className="text-3xl font-black tracking-tight sm:text-4xl">Siap kelola bisnismu lebih rapi?</h3>
            <p className="mx-auto mt-3 max-w-xl text-sm font-medium text-white/85">
              Mulai gratis dalam 2 menit — BSya AI akan menyiapkan dashboard sesuai usahamu.
            </p>
            <Link href={cta.href} className="mt-8 inline-flex items-center gap-2 rounded-full bg-yellow px-8 py-4 text-sm font-extrabold text-ink shadow-lg transition hover:scale-[1.03]">
              {cta.label}
              <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-yellow">→</span>
            </Link>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-5xl items-center justify-center gap-2 text-xs font-semibold text-muted">
          <Mark size={20} /> BSya Grow · Konsep prototipe · BCA Syariah
        </div>
      </section>
    </main>
  );
}
