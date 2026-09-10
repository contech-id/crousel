import { Camera, Check, LogOut, MapPin, Package, Save, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/atoms/ui/button";
import { AppShell } from "@/components/templates/AppShell";
import { useAuth, type UserProfile } from "@/hooks/useAuth";
import { LocationFields } from "@/components/molecules/LocationFields";
import { WhatsappInput } from "@/components/molecules/WhatsappInput";

const emptyProfile: UserProfile = {
  fullName: "",
  phone: "",
  password: "",
  birthDate: "",
  gender: "",
  province: "",
  city: "",
  district: "",
  village: "",
  postalCode: "",
  address: "",
  avatarUrl: "",
};
const inputClass =
  "mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30";

export function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const [form, setForm] = useState<UserProfile>(() => user ?? emptyProfile);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orders] = useState<Array<{ id: string; date: string; total: number; status: string }>>(() => {
    try {
      return JSON.parse(window.localStorage.getItem("crousel-orders") || "[]") as Array<{
        id: string;
        date: string;
        total: number;
        status: string;
      }>;
    } catch {
      return [];
    }
  });
  const [activeTab, setActiveTab] = useState<"account" | "orders">("account");

  useEffect(
    () => () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    },
    [avatarPreview],
  );

  if (!user) {
    window.history.replaceState({}, "", "/login");
    window.dispatchEvent(new PopStateEvent("popstate"));
    return null;
  }
  const update = (key: keyof UserProfile, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };
  const handleAvatar = (file: File | undefined) => {
    if (!file) return;
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };
  const save = async () => {
    setSaving(true);
    const ok = await updateProfile(form, avatarFile);
    setSaving(false);
    if (!ok) return;
    setAvatarFile(null);
    setAvatarPreview("");
    setShowSuccess(true);
  };
  const signOut = () => {
    logout();
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };
  const displayedAvatar = avatarPreview || form.avatarUrl;

  return (
    <AppShell>
      <section className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">Akun Crousel</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-6xl">Profil saya</h1>
          </div>
          <Button variant="outline" className="cursor-pointer rounded-full" onClick={signOut}>
            <LogOut aria-hidden="true" className="size-4" /> Keluar
          </Button>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-[18rem_1fr]">
          <aside className="h-fit rounded-2xl border border-border bg-card p-6">
            <div className="relative mx-auto size-24 overflow-hidden rounded-full bg-secondary/25">
              {displayedAvatar ? (
                <img src={displayedAvatar} alt={form.fullName} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full items-center justify-center text-3xl font-black">
                  {form.fullName.charAt(0).toUpperCase()}
                </span>
              )}
              <span className="absolute bottom-1 right-1 flex size-7 items-center justify-center rounded-full bg-foreground text-background">
                <Camera aria-hidden="true" className="size-3.5" />
              </span>
            </div>
            <h2 className="mt-5 text-center text-lg font-bold">{form.fullName}</h2>
            <p className="mt-1 text-center text-xs text-muted-foreground">{form.phone}</p>
            <div className="mt-6 space-y-1 border-t border-border pt-5 text-sm">
              <button
                onClick={() => setActiveTab("account")}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${activeTab === "account" ? "bg-secondary text-secondary-foreground font-semibold" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}
              >
                <UserRound aria-hidden="true" className="size-4" /> Detail Akun
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${activeTab === "orders" ? "bg-secondary text-secondary-foreground font-semibold" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}
              >
                <Package aria-hidden="true" className="size-4" /> Pesanan Saya
              </button>
            </div>
          </aside>
          <div className="space-y-6">
            {activeTab === "account" && (
              <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
                <div>
                  <h2 className="text-lg font-bold">Detail akun</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Perbarui informasi pribadi dan alamatmu.</p>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Field label="Nama lengkap" value={form.fullName} onChange={(value) => update("fullName", value)} />
                  <label className="text-sm font-medium">
                    Nomor WhatsApp
                    <WhatsappInput
                      value={form.phone}
                      onChange={(value) => update("phone", value)}
                      className="mt-2 h-11"
                    />
                  </label>
                  <Field
                    label="Tanggal lahir"
                    value={form.birthDate}
                    onChange={(value) => update("birthDate", value)}
                    type="date"
                  />
                  <Select
                    label="Jenis kelamin"
                    value={form.gender}
                    options={["Perempuan", "Laki-laki", "Tidak ingin menyebutkan"]}
                    onChange={(value) => update("gender", value)}
                  />
                  <LocationFields
                    province={form.province}
                    city={form.city}
                    district={form.district}
                    subdistrict={form.village}
                    onChange={(key, value) =>
                      setForm((current) => {
                        if (key === "province")
                          return { ...current, province: value, city: "", district: "", village: "" };
                        if (key === "city") return { ...current, city: value, district: "", village: "" };
                        if (key === "district") return { ...current, district: value, village: "" };
                        return { ...current, village: value };
                      })
                    }
                  />
                  <Field label="Kode pos" value={form.postalCode} onChange={(value) => update("postalCode", value)} />
                  <label className="text-sm font-medium sm:col-span-2">
                    Foto profil
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={(event) => handleAvatar(event.target.files?.[0])}
                      className="mt-2 block w-full cursor-pointer rounded-xl border border-input bg-background px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:font-semibold"
                    />
                    {displayedAvatar && (
                      <img
                        src={displayedAvatar}
                        alt="Preview foto profil"
                        className="mt-3 size-24 rounded-xl object-cover"
                      />
                    )}
                  </label>
                  <label className="text-sm font-medium sm:col-span-2">
                    Alamat lengkap
                    <textarea
                      value={form.address}
                      onChange={(event) => update("address", event.target.value)}
                      rows={3}
                      className="mt-2 w-full resize-none rounded-xl border border-input bg-background px-3 py-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                      placeholder="Nama jalan, nomor rumah, patokan"
                    />
                  </label>
                </div>
                <Button
                  variant="secondary"
                  className="mt-6 cursor-pointer rounded-full"
                  onClick={() => void save()}
                  disabled={saving}
                >
                  <Save aria-hidden="true" className="size-4" /> {saving ? "Menyimpan..." : "Simpan perubahan"}
                </Button>
              </section>
            )}
            {activeTab === "orders" && (
              <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-secondary/25">
                    <Package aria-hidden="true" className="size-4" />
                  </span>
                  <div>
                    <h2 className="font-bold">Pesanan saya</h2>
                    <p className="mt-1 text-xs text-muted-foreground">Riwayat pesananmu.</p>
                  </div>
                </div>
                {orders.length ? (
                  <div className="mt-5 space-y-3">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4"
                      >
                        <div>
                          <p className="text-sm font-bold">{order.id}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {order.date} · {order.status}
                          </p>
                        </div>
                        <p className="text-sm font-semibold">Rp{new Intl.NumberFormat("id-ID").format(order.total)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-5 rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                    Belum ada riwayat pesanan.
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </section>
      {showSuccess && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 px-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowSuccess(false);
          }}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-center shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-success-title"
          >
            <button
              type="button"
              className="absolute right-4 top-4 cursor-pointer"
              onClick={() => setShowSuccess(false)}
              aria-label="Tutup"
            >
              <X className="size-4" />
            </button>
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Check aria-hidden="true" className="size-7" />
            </span>
            <h2 id="profile-success-title" className="mt-4 text-lg font-bold">
              Profil berhasil diperbarui
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">Perubahan data dan foto profil telah disimpan.</p>
            <Button
              variant="secondary"
              className="mt-5 cursor-pointer rounded-full"
              onClick={() => setShowSuccess(false)}
            >
              Tutup
            </Button>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="text-sm font-medium">
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} />
    </label>
  );
}
function Select({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="text-sm font-medium">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className={`${inputClass} disabled:opacity-50`}
      >
        <option value="">Pilih {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
