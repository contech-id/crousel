import { CheckCircle2, Package } from "lucide-react";

import { Button } from "@/components/atoms/ui/button";
import { AppShell } from "@/components/templates/AppShell";

export function PaymentSuccessPage() {
  return (
    <AppShell hideFooter>
      <section className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-12">
          <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 aria-hidden="true" className="size-10" />
          </span>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">Crousel</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Pembayaran berhasil</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">
            Pesananmu sudah tercatat. Kamu dapat melihat detail dan status pesanan dari menu Pesanan Saya.
          </p>
          <Button variant="secondary" className="mt-8 w-full rounded-full" asChild>
            <a href="/profil?tab=orders">
              <Package aria-hidden="true" className="size-4" />
              Selesai
            </a>
          </Button>
        </div>
      </section>
    </AppShell>
  );
}
