import { Check, Clock, Copy, CreditCard, Info } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/atoms/ui/button";
import { AppShell } from "@/components/templates/AppShell";
import { formatPrice } from "@/hooks/useCart";

export function PaymentPage() {
  const [order, setOrder] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [vaNumber, setVaNumber] = useState("");

  useEffect(() => {
    const previousOrders = JSON.parse(window.localStorage.getItem("crousel-orders") || "[]");
    if (previousOrders.length > 0) {
      const latestOrder = previousOrders[0];
      setOrder(latestOrder);
      
      const isVA = latestOrder.payment.toLowerCase().includes("virtual account");
      if (isVA) {
        // Generate a random but deterministic VA number based on order ID
        const hash = latestOrder.id.split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
        setVaNumber(`8077${hash.toString().padStart(8, "0").slice(0, 8)}`);
      }
    }
  }, []);

  if (!order) {
    return (
      <AppShell>
        <section className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:py-28">
          <h1 className="text-2xl font-bold">Tidak ada pesanan aktif</h1>
          <Button variant="secondary" className="mt-6 rounded-full" asChild>
            <a href="/">Kembali ke beranda</a>
          </Button>
        </section>
      </AppShell>
    );
  }

  const isVA = order.payment.toLowerCase().includes("virtual account");
  const isCOD = order.payment.toLowerCase().includes("cod");
  
  // Calculate deadline (24 hours from now)
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 1);

  const handleCopy = () => {
    if (vaNumber) {
      navigator.clipboard.writeText(vaNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AppShell hideFooter>
      <section className="mx-auto min-h-screen max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="space-y-6">
          {!isCOD && (
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-destructive">
                <Clock className="size-4" />
                Batas Waktu Pembayaran
              </div>
              <p className="mt-2 text-xl font-bold">
                {deadline.toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                pukul{" "}
                {deadline.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="bg-muted/50 p-5 sm:p-6 border-b border-border">
              <h2 className="font-bold flex items-center gap-2">
                <CreditCard className="size-5" />
                Informasi Pembayaran
              </h2>
            </div>
            <div className="p-5 sm:p-6 space-y-5">
              <div className={`grid grid-cols-1 ${isVA ? "sm:grid-cols-2 gap-8" : "gap-5"}`}>
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status Pembayaran</span>
                    <span className="inline-flex items-center rounded-full bg-secondary/20 px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Metode Pembayaran</span>
                    <span className="font-medium text-sm">{order.payment}</span>
                  </div>
                </div>

                {isVA && (
                  <div>
                    <span className="text-sm text-muted-foreground block mb-2">Nomor Virtual Account</span>
                    <div className="flex items-center justify-between bg-muted rounded-xl p-3 border border-border">
                      <span className="text-lg font-bold tracking-wider">{vaNumber}</span>
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                      >
                        {copied ? (
                          <>
                            <Check className="size-4 text-emerald-600" />
                            <span className="text-emerald-600">Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="size-4" />
                            Salin
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="my-5 border-t border-border" />
              <div className="flex justify-between items-center">
                <span className="font-bold">Total Pembayaran</span>
                <span className="text-2xl font-black text-black">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="bg-muted/50 p-5 sm:p-6 border-b border-border">
              <h2 className="font-bold">Detail Pesanan</h2>
            </div>
            <div className="p-5 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block">ID Pesanan</span>
                  <span className="text-sm font-medium">{order.id}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Tanggal Pesanan</span>
                  <span className="text-sm font-medium">{order.date}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Produk</span>
                  <span className="text-sm font-medium leading-relaxed">{order.products}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Jumlah Item</span>
                  <span className="text-sm font-medium">{order.items} barang</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl bg-secondary/10 p-4 flex gap-3 text-sm text-secondary-foreground border border-secondary/20">
            <Info className="size-5 shrink-0" />
            <p>
              {isCOD 
                ? "Tim kami akan segera menghubungi melalui WhatsApp untuk konfirmasi pengiriman." 
                : "Setelah pembayaran berhasil, pesananmu akan segera kami proses. Konfirmasi pembayaran dilakukan secara otomatis."}
            </p>
          </div>

          <div className="pt-4 flex gap-4 flex-col sm:flex-row">
            <Button variant="secondary" className="flex-1 rounded-full" asChild>
              <a href="/profil">Selesai</a>
            </Button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
