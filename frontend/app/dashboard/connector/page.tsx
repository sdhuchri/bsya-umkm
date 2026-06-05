"use client";

import React, { useMemo, useState } from "react";
import { C, F, r } from "@/lib/theme";
import { PageHeader, Deco } from "@/components/ui";
import { Ic } from "@/components/icons";
import { toast } from "@/lib/toast";
import { Modal, PrimaryButton, fieldLabel, inputStyle } from "@/components/Modal";
import { useIsMobile } from "@/lib/useIsMobile";

type Status = "connected" | "available";

type Connector = {
  id: string;
  name: string;
  vendor: string;
  category: string;
  desc: string;
  color: string;
  status: Status;
  lastSync?: string;
  // MCP server descriptor
  mcp: { url: string; tools: string[] };
};

const INITIAL: Connector[] = [
  {
    id: "mekari",
    name: "Mekari Jurnal",
    vendor: "Mekari",
    category: "Akuntansi",
    desc: "Tarik jurnal, neraca, dan arus kas otomatis ke laporan keuangan.",
    color: "#1A6DFF",
    status: "connected",
    lastSync: "2 menit lalu",
    mcp: { url: "mcp://mekari.id/jurnal", tools: ["list_invoices", "get_balance_sheet", "create_journal", "list_cashflow"] },
  },
  {
    id: "accurate",
    name: "Accurate Online",
    vendor: "CPSSoft",
    category: "Akuntansi",
    desc: "Sinkronkan faktur, stok, dan piutang dari Accurate Online.",
    color: "#E23A3A",
    status: "connected",
    lastSync: "1 jam lalu",
    mcp: { url: "mcp://accurate.id/v4", tools: ["list_items", "get_receivables", "sync_invoices", "get_stock"] },
  },
  {
    id: "odoo",
    name: "Odoo ERP",
    vendor: "Odoo S.A.",
    category: "ERP",
    desc: "Hubungkan modul Sales, Inventory, dan Accounting dari Odoo.",
    color: "#714B67",
    status: "available",
    mcp: { url: "mcp://odoo.com/jsonrpc", tools: ["search_read", "create_order", "get_inventory", "post_invoice"] },
  },
  {
    id: "iseller",
    name: "iSeller POS",
    vendor: "iSeller",
    category: "Point of Sale",
    desc: "Impor transaksi penjualan & produk dari kasir iSeller secara real-time.",
    color: "#FF6B2C",
    status: "available",
    mcp: { url: "mcp://iseller.com/pos", tools: ["list_sales", "get_products", "daily_summary"] },
  },
  {
    id: "moka",
    name: "Moka POS",
    vendor: "GoTo",
    category: "Point of Sale",
    desc: "Tarik laporan penjualan harian dan katalog produk dari Moka.",
    color: "#00B6A9",
    status: "available",
    mcp: { url: "mcp://mokapos.com/v2", tools: ["list_transactions", "get_outlets", "get_catalog"] },
  },
  {
    id: "tokopedia",
    name: "Tokopedia Seller",
    vendor: "GoTo",
    category: "Marketplace",
    desc: "Sinkronkan pesanan, stok, dan resi dari toko Tokopedia-mu.",
    color: "#42B549",
    status: "available",
    mcp: { url: "mcp://tokopedia.com/seller", tools: ["list_orders", "update_stock", "get_finance"] },
  },
];

// What the AI agent can do once data is connected (agentic showcase).
const AGENT_SKILLS = [
  { ic: "chart", t: "Konsolidasi laporan", d: "Gabungkan data dari semua sumber jadi satu laporan keuangan." },
  { ic: "calc", t: "Hitung pajak otomatis", d: "Agent baca faktur tersambung lalu hitung PPN & PPh." },
  { ic: "spark", t: "Deteksi anomali", d: "Cek selisih stok & kas antar aplikasi secara proaktif." },
  { ic: "receipt", t: "Rekonsiliasi", d: "Cocokkan transaksi POS dengan jurnal akuntansi." },
];

export default function ConnectorPage() {
  const m = useIsMobile();
  const [connectors, setConnectors] = useState<Connector[]>(INITIAL);
  const [target, setTarget] = useState<Connector | null>(null);
  const [detail, setDetail] = useState<Connector | null>(null);

  const connectedCount = useMemo(() => connectors.filter((c) => c.status === "connected").length, [connectors]);
  const toolCount = useMemo(
    () => connectors.filter((c) => c.status === "connected").reduce((n, c) => n + c.mcp.tools.length, 0),
    [connectors]
  );

  const connect = (id: string) => {
    setConnectors((prev) => prev.map((c) => (c.id === id ? { ...c, status: "connected", lastSync: "baru saja" } : c)));
  };
  const disconnect = (id: string) => {
    setConnectors((prev) => prev.map((c) => (c.id === id ? { ...c, status: "available", lastSync: undefined } : c)));
    toast("Koneksi diputus.", "info");
  };

  return (
    <div style={{ flex: 1, padding: m ? 16 : 24, overflow: "auto", display: "flex", flexDirection: "column", gap: m ? 14 : 18 }}>
      <PageHeader title="Connector" subtitle="Hubungkan aplikasi bisnismu lewat MCP — biar AI Agent bekerja lintas sistem" />

      {/* ── Stat strip ── */}
      <div style={{ display: "grid", gridTemplateColumns: m ? "repeat(3,1fr)" : "repeat(3, 1fr)", gap: m ? 10 : 14 }}>
        <Stat label="Terhubung" value={`${connectedCount}`} sub="aplikasi aktif" />
        <Stat label="MCP Tools" value={`${toolCount}`} sub="tersedia untuk agent" />
        <Stat label="Protokol" value="MCP" sub="Model Context Protocol" />
      </div>

      {/* ── Agentic banner ── */}
      <div style={{ borderRadius: r(18), padding: m ? 18 : 22, color: C.white, position: "relative", overflow: "hidden", background: `linear-gradient(150deg, ${C.ink} 0%, ${C.skyDeep} 100%)` }}>
        <Deco size={60} rotate={20} color="rgba(255,217,61,0.25)" style={{ position: "absolute", right: -8, top: -12 }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.yellow, color: C.ink, fontSize: 10.5, fontWeight: 800, padding: "4px 10px", borderRadius: 999, marginBottom: 12, letterSpacing: 0.4 }}>
          {Ic.spark(13, C.ink)} AGENTIC
        </div>
        <div style={{ fontSize: m ? 16 : 18, fontWeight: 800, lineHeight: 1.3, marginBottom: 6, letterSpacing: -0.2, maxWidth: 560 }}>
          Setiap connector membuka MCP tools yang bisa dipakai AI Agent
        </div>
        <div style={{ fontSize: 12.5, lineHeight: 1.5, fontWeight: 600, opacity: 0.9, maxWidth: 560 }}>
          Hubungkan Mekari, Accurate, Odoo, atau iSeller — lalu cukup minta lewat <b>Tanya AI</b>. Agent akan memanggil tool yang tepat di aplikasi yang benar.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10, marginTop: 16 }}>
          {AGENT_SKILLS.map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: r(12), padding: 12 }}>
              <div style={{ marginBottom: 6 }}>{Ic[s.ic](18, C.yellow)}</div>
              <div style={{ fontSize: 12.5, fontWeight: 800, marginBottom: 2 }}>{s.t}</div>
              <div style={{ fontSize: 10.5, fontWeight: 600, opacity: 0.8, lineHeight: 1.4 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Connector grid ── */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, margin: "2px 2px 12px" }}>Aplikasi Tersedia</div>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(2, 1fr)", gap: m ? 12 : 14 }}>
          {connectors.map((c) => (
            <div key={c.id} style={{ background: C.white, borderRadius: r(16), padding: 18, border: `1px solid ${C.line}`, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: r(13), background: c.color, color: C.white, fontWeight: 800, fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {c.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 800 }}>{c.name}</div>
                    <StatusPill status={c.status} />
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginTop: 2 }}>{c.vendor} · {c.category}</div>
                </div>
              </div>

              <div style={{ fontSize: 12, color: C.ink2, fontWeight: 600, lineHeight: 1.45 }}>{c.desc}</div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10.5, fontWeight: 700, color: C.skyDeep, background: C.skySoft, padding: "4px 9px", borderRadius: 999 }}>
                  {Ic.plug(12, C.skyDeep)} {c.mcp.tools.length} MCP tools
                </span>
                {c.status === "connected" && (
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: C.muted }}>· sync {c.lastSync}</span>
                )}
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                {c.status === "connected" ? (
                  <>
                    <button onClick={() => setDetail(c)} style={btn(C.ink, C.white)}>Kelola</button>
                    <button onClick={() => disconnect(c.id)} style={btn(C.bg, C.ink2, C.line)}>Putuskan</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setTarget(c)} style={btn(C.sky, C.white)}>+ Hubungkan</button>
                    <button onClick={() => setDetail(c)} style={btn(C.bg, C.ink2, C.line)}>Detail</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConnectModal connector={target} onClose={() => setTarget(null)} onConnect={connect} />
      <DetailModal connector={detail} onClose={() => setDetail(null)} />
    </div>
  );
}

// ─── Subcomponents ───
function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div style={{ background: C.white, borderRadius: r(16), padding: 16, border: `1px solid ${C.line}` }}>
      <div style={{ fontSize: 10.5, color: C.muted, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: C.ink, marginTop: 4, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10.5, color: C.muted, fontWeight: 600, marginTop: 3 }}>{sub}</div>
    </div>
  );
}

function StatusPill({ status }: { status: Status }) {
  const on = status === "connected";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9.5, fontWeight: 800, padding: "2px 8px", borderRadius: 999, background: on ? "#E5F7EE" : C.bg, color: on ? C.ok : C.muted, textTransform: "uppercase", letterSpacing: 0.4 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: on ? C.ok : C.muted }} />
      {on ? "Terhubung" : "Tersedia"}
    </span>
  );
}

function btn(bg: string, color: string, border?: string): React.CSSProperties {
  return { flex: 1, background: bg, color, border: border ? `1px solid ${border}` : "none", padding: "9px 12px", borderRadius: r(999), fontSize: 12, fontWeight: 800, fontFamily: F, cursor: "pointer" };
}

function ConnectModal({ connector, onClose, onConnect }: { connector: Connector | null; onClose: () => void; onConnect: (id: string) => void }) {
  const [key, setKey] = useState("");
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);

  React.useEffect(() => {
    setKey("");
    setUrl(connector?.mcp.url ?? "");
  }, [connector]);

  if (!connector) return null;
  const valid = key.trim().length >= 6 && url.trim();

  const submit = () => {
    if (!valid || busy) return;
    setBusy(true);
    // Simulate MCP handshake (prototype — no real network).
    setTimeout(() => {
      onConnect(connector.id);
      setBusy(false);
      toast(`${connector.name} terhubung · ${connector.mcp.tools.length} MCP tools aktif.`, "ok");
      onClose();
    }, 900);
  };

  return (
    <Modal open={!!connector} onClose={onClose} title={`Hubungkan ${connector.name}`} subtitle="Masukkan kredensial untuk membuka MCP server aplikasi ini." width={480}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 12, background: C.bg, borderRadius: r(12), border: `1px solid ${C.line}` }}>
          <div style={{ width: 38, height: 38, borderRadius: r(11), background: connector.color, color: C.white, fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {connector.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 800 }}>{connector.vendor}</div>
            <div style={{ fontSize: 10.5, color: C.muted, fontWeight: 600 }}>{connector.category}</div>
          </div>
        </div>
        <div>
          <label style={fieldLabel}>MCP Server URL</label>
          <input style={inputStyle} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="mcp://..." />
        </div>
        <div>
          <label style={fieldLabel}>API Key / Access Token</label>
          <input style={inputStyle} type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Tempel API key dari aplikasi" />
          <div style={{ fontSize: 10.5, color: C.muted, fontWeight: 600, marginTop: 6 }}>Kredensial disimpan terenkripsi & hanya dipakai untuk handshake MCP.</div>
        </div>
        <PrimaryButton onClick={submit} disabled={!valid || busy}>
          {busy ? "Menghubungkan…" : "Hubungkan via MCP"}
        </PrimaryButton>
      </div>
    </Modal>
  );
}

function DetailModal({ connector, onClose }: { connector: Connector | null; onClose: () => void }) {
  if (!connector) return null;
  return (
    <Modal open={!!connector} onClose={onClose} title={connector.name} subtitle={`${connector.vendor} · ${connector.category}`} width={480}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ fontSize: 12.5, color: C.ink2, fontWeight: 600, lineHeight: 1.5 }}>{connector.desc}</div>
        <div>
          <label style={fieldLabel}>MCP Server</label>
          <div style={{ ...inputStyle, display: "flex", alignItems: "center", color: C.ink2, fontFamily: "monospace", fontSize: 12 }}>{connector.mcp.url}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: C.ink, marginBottom: 8 }}>MCP Tools yang diekspos</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {connector.mcp.tools.map((t) => (
              <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: C.skyDeep, background: C.skySoft, padding: "5px 10px", borderRadius: r(8), fontFamily: "monospace" }}>
                {Ic.spark(11, C.skyDeep)} {t}()
              </span>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 10.5, color: C.muted, fontWeight: 600, lineHeight: 1.5, background: C.bg, padding: 12, borderRadius: r(10), border: `1px solid ${C.line}` }}>
          Tools ini otomatis tersedia untuk AI Agent saat aplikasi terhubung. Agent memilih tool yang relevan ketika kamu bertanya lewat <b>Tanya AI</b>.
        </div>
      </div>
    </Modal>
  );
}
