import { Check, CreditCard, LoaderCircle, MapPin, Package, Truck } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/atoms/ui/button";
import { AppShell } from "@/components/templates/AppShell";
import { formatPrice, priceToNumber, useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { WhatsappInput } from "@/components/molecules/WhatsappInput";
import { LocationFields } from "@/components/molecules/LocationFields";
import { AddressPageSkeleton } from "@/components/organisms/AddressPageSkeleton";

type ShippingMethod = { id: string; name: string; detail: string; price: number; courier?: string };
type ShippingApiRow = { name?: string; code?: string; service?: string; description?: string; cost?: number | string; etd?: string };
const pickupMethod: ShippingMethod = {
  id: "pickup",
  courier: "pickup",
  name: "Ambil di toko Crousel",
  detail: "Siap diambil hari ini",
  price: 0,
};

const paymentMethods = [
  { id: "va-bca", name: "Virtual Account BCA", detail: "Konfirmasi otomatis" },
  { id: "va-mandiri", name: "Virtual Account Mandiri", detail: "Konfirmasi otomatis" },
  { id: "ewallet", name: "E-wallet", detail: "GoPay, OVO, DANA, ShopeePay" },
  { id: "qris", name: "QRIS", detail: "Scan dengan aplikasi pilihanmu" },
  { id: "cod", name: "COD", detail: "Bayar saat paket diterima" },
];

const inputClassName =
  "h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30";
const demoOrderNumber = "CRS-240905";

export function CheckoutPage() {
  const { items, subtotal } = useCart();
  const { user } = useAuth();
  const [recipientName, setRecipientName] = useState(() => user?.fullName ?? "");
  const [recipientWhatsapp, setRecipientWhatsapp] = useState(() => user?.phone ?? "");
  const [postalCode, setPostalCode] = useState(() => user?.postalCode ?? "");
  const [address, setAddress] = useState(() => user?.address ?? "");
  const [province, setProvince] = useState(() => user?.province ?? "");
  const [city, setCity] = useState(() => user?.city ?? "");
  const [district, setDistrict] = useState(() => user?.district ?? "");
  const [village, setVillage] = useState(() => user?.village ?? "");
  const [shippingId, setShippingId] = useState("pickup");
  const [paymentId, setPaymentId] = useState(paymentMethods[0].id);
  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useState(0);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [destinationDistrictId, setDestinationDistrictId] = useState("");
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([pickupMethod]);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState("");
  const [enabledCouriers, setEnabledCouriers] = useState<string[]>([]);
  const [shippingConfigLoading, setShippingConfigLoading] = useState(true);

  const selectedShipping = shippingMethods.find((item) => item.id === shippingId) ?? pickupMethod;
  const total = subtotal + selectedShipping.price - discount;
  // Product data belum memiliki field berat, jadi gunakan fallback 500 gram per item.
  const totalWeight = items.reduce((sum, item) => sum + 500 * item.quantity, 0);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (locationsLoading || shippingConfigLoading || !destinationDistrictId || items.length === 0) return;
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
            origin: Number(import.meta.env.VITE_RAJAONGKIR_ORIGIN_DISTRICT_ID || "1391"),
            destination: Number(destinationDistrictId),
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
  }, [destinationDistrictId, enabledCouriers, items, locationsLoading, shippingConfigLoading, totalWeight]);

  const canSubmit = Boolean(items.length > 0 && province && city && district && village && paymentId && shippingId && !shippingLoading);

  const handleProvinceChange = (value: string) => {
    setProvince(value);
    setCity("");
    setDistrict("");
    setVillage("");
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    setDistrict("");
    setVillage("");
  };

  const handleDistrictChange = (value: string) => {
    setDistrict(value);
    setVillage("");
  };

  const handleVoucher = () => {
    setDiscount(voucher.trim().toUpperCase() === "CROUSEL10" ? Math.round(subtotal * 0.1) : 0);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    const previousOrders = JSON.parse(window.localStorage.getItem("crousel-orders") || "[]");
    const localOrder = {
      id: demoOrderNumber,
      customer: recipientName,
      date: new Date().toLocaleDateString("id-ID"),
      products: items.map((item) => item.product.name).join(", "),
      items: items.reduce((sum, item) => sum + item.quantity, 0),
      payment: paymentMethods.find((method) => method.id === paymentId)?.name ?? paymentId,
      total,
      status: "Menunggu pembayaran",
    };
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          customer_name: recipientName,
          products: items.map((item) => item.product.name),
          item_count: localOrder.items,
          payment_method: localOrder.payment,
          total,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      localOrder.id = result.data.id;
    } catch {
      // Keep demo order ID
    }
    window.localStorage.setItem("crousel-orders", JSON.stringify([localOrder, ...previousOrders]));
    void fetch(`${import.meta.env.VITE_API_URL}/notifications/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        type: "new_order",
        title: "Pesanan baru",
        message: `Pesanan ${demoOrderNumber} menunggu diproses.`,
      }),
    }).catch(() => undefined);
    window.history.pushState({}, "", "/pembayaran");
    window.dispatchEvent(new PopStateEvent("popstate"));
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
      {locationsLoading && <AddressPageSkeleton variant="checkout" />}
      <div className={locationsLoading ? "hidden" : "contents"}>
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
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-medium">
                    Nama lengkap
                    <input
                      required
                      name="name"
                      value={recipientName}
                      onChange={(event) => setRecipientName(event.target.value)}
                      className={`${inputClassName} mt-2`}
                      placeholder="Nama penerima"
                    />
                  </label>
                  <label className="text-sm font-medium">
                    Nomor WhatsApp
                    <WhatsappInput
                      required
                      value={recipientWhatsapp}
                      onChange={setRecipientWhatsapp}
                      className="mt-2 h-11"
                    />
                  </label>
                  <LocationFields
                    province={province}
                    city={city}
                    district={district}
                    subdistrict={village}
                    onLoadingChange={setLocationsLoading}
                    onDistrictIdChange={setDestinationDistrictId}
                    onChange={(key, value) => {
                      if (key === "province") handleProvinceChange(value);
                      else if (key === "city") handleCityChange(value);
                      else if (key === "district") handleDistrictChange(value);
                      else setVillage(value);
                    }}
                  />
                  <label className="text-sm font-medium">
                    Kode pos
                    <input
                      required
                      name="postalCode"
                      inputMode="numeric"
                      value={postalCode}
                      onChange={(event) => setPostalCode(event.target.value)}
                      className={`${inputClassName} mt-2`}
                      placeholder="12345"
                    />
                  </label>
                  <label className="text-sm font-medium sm:col-span-2">
                    Alamat lengkap
                    <textarea
                      required
                      name="address"
                      rows={3}
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      className="mt-2 w-full resize-none rounded-xl border border-input bg-background px-3 py-3 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
                      placeholder="Nama jalan, nomor rumah, patokan"
                    />
                  </label>
                </div>
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

              <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-secondary/25">
                    <CreditCard aria-hidden="true" className="size-4" />
                  </span>
                  <div>
                    <h2 className="font-bold">Metode pembayaran</h2>
                    <p className="text-xs text-muted-foreground">Semua transaksi diproses dengan aman.</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {paymentMethods.map((method) => (
                    <OptionButton
                      key={method.id}
                      selected={paymentId === method.id}
                      onClick={() => setPaymentId(method.id)}
                      title={method.name}
                      detail={method.detail}
                    />
                  ))}
                </div>
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
              <div className="mt-6 flex gap-2">
                <input
                  value={voucher}
                  onChange={(event) => setVoucher(event.target.value)}
                  className={`${inputClassName} h-10`}
                  placeholder="Kode voucher"
                />
                <Button type="button" variant="outline" className="h-10 rounded-xl px-3" onClick={handleVoucher}>
                  Pakai
                </Button>
              </div>
              {voucher && (
                <p className={`mt-2 text-xs ${discount > 0 ? "text-emerald-600" : "text-destructive"}`}>
                  {discount > 0 ? "Voucher CROUSEL10 berhasil digunakan." : "Kode voucher belum valid."}
                </p>
              )}
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
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Diskon voucher</span>
                    <span>− {formatPrice(discount)}</span>
                  </div>
                )}
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
                Buat pesanan
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
      </div>
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
