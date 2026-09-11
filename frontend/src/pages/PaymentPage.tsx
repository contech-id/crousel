import { CheckCircle2, Clock, CreditCard, Info, LoaderCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/atoms/ui/button";
import { AppShell } from "@/components/templates/AppShell";
import { formatPrice } from "@/hooks/useCart";

type OrderStatus = {
  id: string;
  total: number;
  payment_status: "pending" | "paid" | "failed" | "expired" | "cancelled";
  transaction_status?: string | null;
  payment?: string | null;
  items?: number;
  date?: string;
};

const labels: Record<OrderStatus["payment_status"], string> = {
  pending: "Menunggu pembayaran",
  paid: "Pembayaran berhasil",
  failed: "Pembayaran gagal",
  expired: "Pembayaran kedaluwarsa",
  cancelled: "Pembayaran dibatalkan",
};

export function PaymentPage() {
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [error, setError] = useState("");
  const orderId = new URLSearchParams(window.location.search).get("order_id") || window.localStorage.getItem("crousel-last-order-id");

  useEffect(() => {
    if (!orderId) return;
    let active = true;
    const load = async () => {
      try {
        const token = window.localStorage.getItem("crousel-api-token");
        const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/${encodeURIComponent(orderId)}`, {
          headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });
        const payload = await response.json() as { data?: OrderStatus; message?: string };
        if (!response.ok || !payload.data) throw new Error(payload.message || "Status order gagal dimuat.");
        if (active) setOrder(payload.data);
      } catch (reason) {
        if (active) setError(reason instanceof Error ? reason.message : "Status order gagal dimuat.");
      }
    };
    void load();
    const timer = window.setInterval(() => { if (order?.payment_status === "pending") void load(); }, 5000);
    return () => { active = false; window.clearInterval(timer); };
  }, [orderId, order?.payment_status]);

  if (!orderId || error) return <AppShell><section className="mx-auto max-w-2xl px-4 py-20 text-center"><p className="text-sm text-destructive">{error || "Tidak ada pesanan aktif."}</p><Button variant="secondary" className="mt-6 rounded-full" asChild><a href="/profil?tab=orders">Lihat pesanan saya</a></Button></section></AppShell>;
  if (!order) return <AppShell><section className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-4"><LoaderCircle className="size-6 animate-spin" /></section></AppShell>;

  const paid = order.payment_status === "paid";
  const failed = ["failed", "expired", "cancelled"].includes(order.payment_status);
  return (
    <AppShell hideFooter>
      <section className="mx-auto min-h-screen max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16"><div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          {paid ? <CheckCircle2 className="mx-auto size-12 text-emerald-600" /> : failed ? <XCircle className="mx-auto size-12 text-destructive" /> : <Clock className="mx-auto size-12 text-amber-600" />}
          <h1 className="mt-4 text-2xl font-black">{labels[order.payment_status]}</h1><p className="mt-2 text-sm text-muted-foreground">Order {order.id}</p><p className="mt-5 text-3xl font-black text-black">{formatPrice(order.total)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6"><div className="flex items-center gap-2"><CreditCard className="size-5" /><h2 className="font-bold">Detail transaksi</h2></div><div className="mt-5 grid gap-4 text-sm sm:grid-cols-2"><div><span className="text-xs text-muted-foreground">Status Midtrans</span><p className="font-medium">{order.transaction_status || "pending"}</p></div><div><span className="text-xs text-muted-foreground">Metode pembayaran</span><p className="font-medium">{order.payment || "Dipilih di Midtrans Snap"}</p></div><div><span className="text-xs text-muted-foreground">Jumlah item</span><p className="font-medium">{order.items || 0} barang</p></div><div><span className="text-xs text-muted-foreground">Tanggal</span><p className="font-medium">{order.date || "-"}</p></div></div></div>
        {!paid && <div className="flex gap-3 rounded-xl border border-secondary/20 bg-secondary/10 p-4 text-sm text-secondary-foreground"><Info className="size-5 shrink-0" /><p>Status akan diperbarui otomatis setelah webhook Midtrans diterima.</p></div>}
        <Button variant="secondary" className="w-full rounded-full" asChild><a href="/profil?tab=orders">Lihat pesanan saya</a></Button>
      </div></section>
    </AppShell>
  );
}
