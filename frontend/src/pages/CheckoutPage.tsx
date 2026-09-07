import { Check, ChevronDown, CreditCard, MapPin, Package, Truck } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { Button } from '@/components/atoms/ui/button'
import { AppShell } from '@/components/templates/AppShell'
import { formatPrice, priceToNumber, useCart } from '@/hooks/useCart'

type Location = {
  province: string
  cities: {
    name: string
    districts: { name: string; villages: string[] }[]
  }[]
}

const locations: Location[] = [
  {
    province: 'DKI Jakarta',
    cities: [
      { name: 'Jakarta Selatan', districts: [{ name: 'Kebayoran Baru', villages: ['Senayan', 'Selong'] }, { name: 'Tebet', villages: ['Tebet Barat', 'Tebet Timur'] }] },
      { name: 'Jakarta Barat', districts: [{ name: 'Kebon Jeruk', villages: ['Kebon Jeruk', 'Sukabumi Utara'] }] },
    ],
  },
  {
    province: 'Jawa Barat',
    cities: [
      { name: 'Kota Bandung', districts: [{ name: 'Coblong', villages: ['Dago', 'Lebak Gede'] }, { name: 'Sukajadi', villages: ['Pasteur', 'Sukabungah'] }] },
      { name: 'Kabupaten Bogor', districts: [{ name: 'Cibinong', villages: ['Cibinong', 'Nanggewer'] }] },
    ],
  },
  {
    province: 'Jawa Timur',
    cities: [
      { name: 'Surabaya', districts: [{ name: 'Wonokromo', villages: ['Darmo', 'Sawunggaling'] }, { name: 'Sukolilo', villages: ['Keputih', 'Gebang Putih'] }] },
      { name: 'Malang', districts: [{ name: 'Klojen', villages: ['Oro-Oro Dowo', 'Rampal Celaket'] }] },
    ],
  },
]

const shippingMethods = [
  { id: 'jnt', name: 'J&T Express', detail: 'Estimasi 2–4 hari', price: 18000 },
  { id: 'jne', name: 'JNE REG', detail: 'Estimasi 2–5 hari', price: 16000 },
  { id: 'sicepat', name: 'SiCepat REG', detail: 'Estimasi 2–4 hari', price: 15000 },
  { id: 'pickup', name: 'Ambil di toko Crousel', detail: 'Siap diambil hari ini', price: 0 },
]

const paymentMethods = [
  { id: 'va-bca', name: 'Virtual Account BCA', detail: 'Konfirmasi otomatis' },
  { id: 'va-mandiri', name: 'Virtual Account Mandiri', detail: 'Konfirmasi otomatis' },
  { id: 'ewallet', name: 'E-wallet', detail: 'GoPay, OVO, DANA, ShopeePay' },
  { id: 'qris', name: 'QRIS', detail: 'Scan dengan aplikasi pilihanmu' },
  { id: 'cod', name: 'COD', detail: 'Bayar saat paket diterima' },
]

const inputClassName = 'h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30'
const demoOrderNumber = 'CRS-240905'

export function CheckoutPage() {
  const { items, subtotal } = useCart()
  const [province, setProvince] = useState('')
  const [city, setCity] = useState('')
  const [district, setDistrict] = useState('')
  const [village, setVillage] = useState('')
  const [shippingId, setShippingId] = useState(shippingMethods[0].id)
  const [paymentId, setPaymentId] = useState(paymentMethods[0].id)
  const [voucher, setVoucher] = useState('')
  const [discount, setDiscount] = useState(0)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const selectedProvince = locations.find((item) => item.province === province)
  const selectedCity = selectedProvince?.cities.find((item) => item.name === city)
  const selectedDistrict = selectedCity?.districts.find((item) => item.name === district)
  const selectedShipping = shippingMethods.find((item) => item.id === shippingId) ?? shippingMethods[0]
  const total = subtotal + selectedShipping.price - discount

  const canSubmit = Boolean(
    items.length > 0 && province && city && district && village && paymentId && shippingId,
  )

  const handleProvinceChange = (value: string) => {
    setProvince(value)
    setCity('')
    setDistrict('')
    setVillage('')
  }

  const handleCityChange = (value: string) => {
    setCity(value)
    setDistrict('')
    setVillage('')
  }

  const handleDistrictChange = (value: string) => {
    setDistrict(value)
    setVillage('')
  }

  const handleVoucher = () => {
    setDiscount(voucher.trim().toUpperCase() === 'CROUSEL10' ? Math.round(subtotal * 0.1) : 0)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return
    window.localStorage.setItem('crousel-orders', JSON.stringify([{ id: demoOrderNumber, date: new Date().toLocaleDateString('id-ID'), total, status: 'Menunggu pembayaran' }]))
    void fetch(`${import.meta.env.VITE_API_URL}/notifications/events`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ type: 'new_order', title: 'Pesanan baru', message: `Pesanan ${demoOrderNumber} menunggu diproses.` }) }).catch(() => undefined)
    setOrderPlaced(true)
  }

  if (orderPlaced) {
    return (
      <AppShell>
        <section className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:py-28">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-secondary/25">
            <Check aria-hidden="true" className="size-7" />
          </span>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">Pesanan berhasil dibuat</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Terima kasih sudah memilih Crousel.</h1>
          <p className="mt-4 leading-7 text-muted-foreground">Nomor pesananmu <strong className="text-foreground">{demoOrderNumber}</strong>. Tim kami akan segera menghubungi melalui WhatsApp untuk konfirmasi pembayaran dan pengiriman.</p>
          <Button variant="secondary" className="mt-8 rounded-full" asChild><a href="/">Kembali ke beranda</a></Button>
        </section>
      </AppShell>
    )
  }

  if (items.length === 0) {
    return (
      <AppShell>
        <section className="mx-auto max-w-[90rem] px-4 py-20 text-center sm:px-6 lg:px-8">
          <Package aria-hidden="true" className="mx-auto size-10 text-muted-foreground" />
          <h1 className="mt-5 text-3xl font-black tracking-tight">Belum ada pesanan untuk checkout</h1>
          <p className="mt-3 text-sm text-muted-foreground">Tambahkan produk ke keranjang terlebih dahulu.</p>
          <Button variant="secondary" className="mt-6 rounded-full" asChild><a href="/belanja">Lihat katalog</a></Button>
        </section>
      </AppShell>
    )
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
            <a href="/keranjang" className="text-sm font-semibold text-muted-foreground hover:text-foreground">Kembali ke keranjang</a>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
            <div className="space-y-6">
              <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-secondary/25"><MapPin aria-hidden="true" className="size-4" /></span>
                  <div><h2 className="font-bold">Alamat pengiriman</h2><p className="text-xs text-muted-foreground">Pastikan detail alamatmu sudah benar.</p></div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-medium">Nama lengkap<input required name="name" className={`${inputClassName} mt-2`} placeholder="Nama penerima" /></label>
                  <label className="text-sm font-medium">Nomor WhatsApp<input required name="whatsapp" type="tel" className={`${inputClassName} mt-2`} placeholder="+62 812 3456 7890" /></label>
                  <SelectField label="Provinsi" value={province} onChange={handleProvinceChange} options={locations.map((item) => item.province)} />
                  <SelectField label="Kota/Kabupaten" value={city} onChange={handleCityChange} options={selectedProvince?.cities.map((item) => item.name) ?? []} disabled={!province} />
                  <SelectField label="Kecamatan" value={district} onChange={handleDistrictChange} options={selectedCity?.districts.map((item) => item.name) ?? []} disabled={!city} />
                  <SelectField label="Desa/Kelurahan" value={village} onChange={setVillage} options={selectedDistrict?.villages ?? []} disabled={!district} />
                  <label className="text-sm font-medium">Kode pos<input required name="postalCode" inputMode="numeric" className={`${inputClassName} mt-2`} placeholder="12345" /></label>
                  <label className="text-sm font-medium sm:col-span-2">Alamat lengkap<textarea required name="address" rows={3} className="mt-2 w-full resize-none rounded-xl border border-input bg-background px-3 py-3 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30" placeholder="Nama jalan, nomor rumah, patokan" /></label>
                </div>
              </section>

              <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-secondary/25"><Truck aria-hidden="true" className="size-4" /></span><div><h2 className="font-bold">Metode pengiriman</h2><p className="text-xs text-muted-foreground">Pilih layanan yang paling sesuai.</p></div></div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {shippingMethods.map((method) => <OptionButton key={method.id} selected={shippingId === method.id} onClick={() => setShippingId(method.id)} title={method.name} detail={method.detail} trailing={method.price === 0 ? 'Gratis' : formatPrice(method.price)} />)}
                </div>
              </section>

              <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-secondary/25"><CreditCard aria-hidden="true" className="size-4" /></span><div><h2 className="font-bold">Metode pembayaran</h2><p className="text-xs text-muted-foreground">Semua transaksi diproses dengan aman.</p></div></div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {paymentMethods.map((method) => <OptionButton key={method.id} selected={paymentId === method.id} onClick={() => setPaymentId(method.id)} title={method.name} detail={method.detail} />)}
                </div>
              </section>
            </div>

            <aside className="rounded-2xl border border-border bg-card p-5 sm:p-6 lg:sticky lg:top-28">
              <h2 className="text-lg font-bold">Pesanan kamu</h2>
              <div className="mt-5 space-y-4">
                {items.map((item) => <div key={item.id} className="flex gap-3"><img src={item.product.images[0]} alt={item.product.name} className="size-14 rounded-lg object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.product.name} <span className="font-normal text-muted-foreground">× {item.quantity}</span></p><p className="mt-1 text-xs text-muted-foreground">Ukuran {item.size} · {item.color}</p><p className="mt-1 text-xs font-semibold">{formatPrice(priceToNumber(item.product.price) * item.quantity)}</p></div></div>)}
              </div>
              <div className="mt-6 flex gap-2"><input value={voucher} onChange={(event) => setVoucher(event.target.value)} className={`${inputClassName} h-10`} placeholder="Kode voucher" /><Button type="button" variant="outline" className="h-10 rounded-xl px-3" onClick={handleVoucher}>Pakai</Button></div>
              {voucher && <p className={`mt-2 text-xs ${discount > 0 ? 'text-emerald-600' : 'text-destructive'}`}>{discount > 0 ? 'Voucher CROUSEL10 berhasil digunakan.' : 'Kode voucher belum valid.'}</p>}
              <div className="my-5 border-t border-border" />
              <div className="space-y-3 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Pengiriman</span><span>{selectedShipping.price === 0 ? 'Gratis' : formatPrice(selectedShipping.price)}</span></div>{discount > 0 && <div className="flex justify-between text-emerald-600"><span>Diskon voucher</span><span>− {formatPrice(discount)}</span></div>}</div>
              <div className="my-5 border-t border-border" /><div className="flex justify-between"><span className="font-bold">Total</span><span className="text-xl font-black">{formatPrice(total)}</span></div>
              <Button type="submit" variant="secondary" size="lg" className="mt-6 w-full rounded-full" disabled={!canSubmit}>Buat pesanan</Button>
              {!canSubmit && <p className="mt-3 text-center text-[11px] leading-4 text-muted-foreground">Lengkapi alamat pengiriman untuk membuat pesanan.</p>}
            </aside>
          </div>
        </section>
      </form>
    </AppShell>
  )
}

type SelectFieldProps = { label: string; value: string; options: string[]; onChange: (value: string) => void; disabled?: boolean }

function SelectField({ label, value, options, onChange, disabled = false }: SelectFieldProps) {
  return <label className="relative text-sm font-medium">{label}<select required value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} className={`${inputClassName} mt-2 appearance-none pr-9 disabled:cursor-not-allowed disabled:opacity-50`}><option value="">Pilih {label.toLowerCase()}</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select><ChevronDown aria-hidden="true" className="pointer-events-none absolute bottom-3 right-3 size-4 text-muted-foreground" /></label>
}

type OptionButtonProps = { selected: boolean; onClick: () => void; title: string; detail: string; trailing?: string }

function OptionButton({ selected, onClick, title, detail, trailing }: OptionButtonProps) {
  return <button type="button" aria-pressed={selected} onClick={onClick} className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${selected ? 'border-foreground bg-muted' : 'border-border hover:bg-accent'}`}><span className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${selected ? 'border-foreground bg-foreground text-background' : 'border-muted-foreground/50'}`}>{selected && <Check aria-hidden="true" className="size-3" />}</span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{title}</span><span className="mt-0.5 block text-[11px] text-muted-foreground">{detail}</span></span>{trailing && <span className="shrink-0 text-xs font-semibold">{trailing}</span>}</button>
}
