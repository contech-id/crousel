import { Check, LoaderCircle, MapPin, Package, Truck } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/atoms/ui/button";
import { AppShell } from "@/components/templates/AppShell";
import { formatPrice, priceToNumber, useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { loadMidtransSnap } from "@/lib/midtrans";

type ShippingMethod = { id: string; name: string; detail: string; price: number; courier?: string; service?: string };
type ShippingApiRow = { name?: string; code?: string; service?: string; description?: string; cost?: number | string; etd?: string };
const pickupMethod: ShippingMethod = {
  id: "pickup",
  courier: "pickup",
  service: "pickup",
  name: "Ambil di toko Crousel",
  detail: "Siap diambil hari ini",
  price: 0,
};

function navigateToPayment(orderId: string) {
  window.history.pushState({}, "", `/pembayaran?order_id=${encodeURIComponent(orderId)}`);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [shippingId, setShippingId] = useState("pickup");
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([pickupMethod]);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState("");
  const [enabledCouriers, setEnabledCouriers] = useState<string[]>([]);
  const [shippingConfigLoading, setShippingConfigLoading] = useState(true);
  const [creatingPayment, setCreatingPayment] = useState(false);
  const idempotencyKey = useRef<string | null>(null);

  const selectedShipping = shippingMethods.find((item) => item.id === shippingId) ?? pickupMethod;
  const total = subtotal + selectedShipping.price;
  const totalWeight = items.reduce((sum, item) => sum + (item.product.weight ?? 500) * item.quantity, 0);
  const hasSavedAddress = Boolean(user?.province && user?.city && user?.district && user?.village && user?.address && user?.districtId);
  // Checkout never loads RajaOngkir location lists. The saved district ID from
  // the backend is enough to calculate shipping costs.
  const districtForShipping = user?.districtId || "";

  useEffect(() => {
    if (!hasSavedAddress) {
      return;
    }
    const controller = new AbortController();
    fetch(`${import.meta.env.VITE_API_URL}/shipping/methods`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = (await response.json().catch(() => ({}))) as { data?: Array<{ code?: string }> };
        if (!response.ok) throw new Error("Konfigurasi metode pengiriman gagal dimuat.");
        setEnabledCouriers((payload.data ?? []).map((method) => method.code).filter((code): code is string => Boolean(code)));
      })
      .catch((error) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) setShippingError(error instanceof Error ? error.message : "Konfigurasi metode pengiriman gagal dimuat.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setShippingConfigLoading(false);
      });
    return () => controller.abort();
  }, [hasSavedAddress]);

  useEffect(() => {
    if (!hasSavedAddress || shippingConfigLoading || !districtForShipping || items.length === 0) return;
    const controller = new AbortController();
    const loadShippingCosts = async () => {
      setShippingLoading(true);
      setShippingError("");
      setShippingMethods([pickupMethod]);
      setShippingId(pickupMethod.id);
      if (enabledCouriers.length === 0) {
        setShippingError("Belum ada metode pengiriman yang diaktifkan oleh admin.");
        setShippingLoading(false);
        return;
      }
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/shipping/cost`, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            destination: Number(districtForShipping),
            weight: totalWeight,
            courier: enabledCouriers.join(":"),
            price: "lowest",
          }),
        });
        const payload = (await response.json().catch(() => ({}))) as { data?: ShippingApiRow[]; message?: string };
        if (!response.ok) throw new Error(payload.message || "Ongkos kirim gagal dimuat.");
        const rates: ShippingMethod[] = (Array.isArray(payload.data) ? payload.data : [])
          .filter((row) => Number(row.cost) >= 0 && row.code && row.service)
          .map((row) => ({
            id: `${row.code}-${row.service}`,
            courier: row.code ?? "",
            service: row.service ?? "",
            name: `${row.name || row.code?.toUpperCase()} ${row.service}`,
            detail: row.etd ? `Estimasi ${row.etd}` : row.description || "Layanan pengiriman",
            price: Number(row.cost),
          }));
        setShippingMethods([...rates, pickupMethod]);
        setShippingId(rates[0]?.id || pickupMethod.id);
        if (!rates.length) setShippingError("Belum ada layanan kurir untuk alamat ini.");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setShippingError(error instanceof Error ? error.message : "Ongkos kirim gagal dimuat.");
      } finally {
        if (!controller.signal.aborted) setShippingLoading(false);
      }
    };
    void loadShippingCosts();
    return () => controller.abort();
  }, [districtForShipping, enabledCouriers, hasSavedAddress, items, shippingConfigLoading, totalWeight]);

  const canSubmit = Boolean(items.length > 0 && hasSavedAddress && shippingId && !shippingLoading && !creatingPayment);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    setCreatingPayment(true);
    setShippingError("");
    idempotencyKey.current ??= typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    try {
      const token = window.localStorage.getItem("crousel-api-token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/checkout/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          items: items.map((item) => ({
            product_id: item.product.id,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
          })),
          shipping: {
            courier: selectedShipping.courier ?? "pickup",
            service: selectedShipping.service ?? "pickup",
            cost: selectedShipping.price,
          },
          idempotency_key: idempotencyKey.current,
        }),
      });
      const result = await response.json() as { data?: { order_id?: string; snap_token?: string }; message?: string };
      if (!response.ok || !result.data?.order_id || !result.data.snap_token) throw new Error(result.message || "Gagal membuat transaksi pembayaran.");
      clearCart();
      const snap = await loadMidtransSnap();
      window.localStorage.setItem("crousel-last-order-id", result.data.order_id);
      snap.pay(result.data.snap_token, {
        onSuccess: () => navigateToPayment(result.data?.order_id ?? ""),
        onPending: () => navigateToPayment(result.data?.order_id ?? ""),
        onError: () => navigateToPayment(result.data?.order_id ?? ""),
        onClose: () => navigateToPayment(result.data?.order_id ?? ""),
      });
    } catch (error) {
      setShippingError(error instanceof Error ? error.message : "Gagal membuat transaksi pembayaran.");
    } finally {
      setCreatingPayment(false);
    }
  };

  if (items.length === 0) {
    return (
      <AppShell>
        <section className="mx-auto max-w-[90rem] px-4 py-20 text-center sm:px-6 lg:px-8">
          <Package aria-hidden="true" className="mx-auto size-10 text-muted-foreground" />
          <h1 className="mt-5 text-3xl font-black tracking-tight">Belum ada pesanan untuk checkout</h1>
          <p className="mt-3 text-sm text-muted-foreground">Tambahkan produk ke keranjang terlebih dahulu.</p>
          <Button variant="secondary" className="mt-6 rounded-full" asChild>
            <a href="/belanja">Lihat katalog</a>
          </Button>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <form onSubmit={handleSubmit}>
        <section className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">Crousel checkout</p>
              <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-6xl">Selesaikan pesananmu</h1>
            </div>
            <a href="/keranjang" className="text-sm font-semibold text-muted-foreground hover:text-foreground">
              Kembali ke keranjang
            </a>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
            <div className="space-y-6">
              <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-secondary/25">
                    <MapPin aria-hidden="true" className="size-4" />
                  </span>
                  <div>
                    <h2 className="font-bold">Alamat pengiriman</h2>
                    <p className="text-xs text-muted-foreground">Pastikan detail alamatmu sudah benar.</p>
                  </div>
                </div>
                {hasSavedAddress ? (
                  <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground">{user?.fullName}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{user?.phone}</p>
                        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{user?.address}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {user?.village}, {user?.district}, {user?.city}, {user?.province} {user?.postalCode}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="shrink-0 rounded-full" asChild>
                        <a href="/profil">Ubah alamat</a>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-center">
                    <p className="text-sm font-semibold">Alamat pengiriman belum diatur.</p>
                    <p className="mt-1 text-xs text-muted-foreground">Atur alamat di profil terlebih dahulu agar ongkos kirim dan checkout dapat dihitung.</p>
                    <Button variant="secondary" className="mt-4 rounded-full" asChild>
                      <a href="/profil">Atur alamat</a>
                    </Button>
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-secondary/25">
                    <Truck aria-hidden="true" className="size-4" />
                  </span>
                  <div>
                    <h2 className="font-bold">Metode pengiriman</h2>
                    <p className="text-xs text-muted-foreground">Pilih layanan yang paling sesuai.</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {shippingLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground sm:col-span-2">
                      <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> Menghitung ongkos kirim...
                    </div>
                  ) : (
                    shippingMethods.map((method) => (
                      <OptionButton
                        key={method.id}
                        selected={shippingId === method.id}
                        onClick={() => setShippingId(method.id)}
                        title={method.name}
                        detail={method.detail}
                        trailing={method.price === 0 ? "Gratis" : formatPrice(method.price)}
                      />
                    ))
                  )}
                </div>
                {shippingError && <p className="mt-3 text-xs text-destructive">{shippingError}</p>}
              </section>

            </div>

            <aside className="rounded-2xl border border-border bg-card p-5 sm:p-6 lg:sticky lg:top-28">
              <h2 className="text-lg font-bold">Pesanan kamu</h2>
              <div className="mt-5 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="size-14 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {item.product.name} <span className="font-normal text-muted-foreground">× {item.quantity}</span>
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Ukuran {item.size} · {item.color}
                      </p>
                      <p className="mt-1 text-xs font-semibold">
                        {formatPrice(priceToNumber(item.product.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="my-5 border-t border-border" />
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pengiriman</span>
                  <span>{selectedShipping.price === 0 ? "Gratis" : formatPrice(selectedShipping.price)}</span>
                </div>
              </div>
              <div className="my-5 border-t border-border" />
              <div className="flex justify-between">
                <span className="font-bold">Total</span>
                <span className="text-xl font-black">{formatPrice(total)}</span>
              </div>
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="mt-6 w-full rounded-full"
                disabled={!canSubmit}
              >
                {creatingPayment ? "Membuat transaksi..." : "Buat pesanan & bayar"}
              </Button>
              {!canSubmit && (
                <p className="mt-3 text-center text-[11px] leading-4 text-muted-foreground">
                  Lengkapi alamat pengiriman untuk membuat pesanan.
                </p>
              )}
            </aside>
          </div>
        </section>
      </form>
    </AppShell>
  );
}

type OptionButtonProps = { selected: boolean; onClick: () => void; title: string; detail: string; trailing?: string };

function OptionButton({ selected, onClick, title, detail, trailing }: OptionButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${selected ? "border-foreground bg-muted" : "border-border hover:bg-accent"}`}
    >
      <span
        className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${selected ? "border-foreground bg-foreground text-background" : "border-muted-foreground/50"}`}
      >
        {selected && <Check aria-hidden="true" className="size-3" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{title}</span>
        <span className="mt-0.5 block text-[11px] text-muted-foreground">{detail}</span>
      </span>
      {trailing && <span className="shrink-0 text-xs font-semibold">{trailing}</span>}
    </button>
  );
}
