import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/atoms/ui/button";
import { AppShell } from "@/components/templates/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { WhatsappInput } from "@/components/molecules/WhatsappInput";

function navigate(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function RegisterPage() {
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.length < 6) return setError("Password minimal 6 karakter.");
    if (password !== confirmation) return setError("Konfirmasi password belum sama.");
    await register({ fullName: fullName.trim(), email: email.trim(), phone: phone.trim(), password });
    navigate("/profil");
  };
  return (
    <AppShell>
      <section className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">Akun Crousel</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">Buat akun baru</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Simpan detail pengiriman dan nikmati checkout yang lebih cepat.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <label className="relative text-sm font-medium">
              Nama lengkap
              <input
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                placeholder="Nama lengkap"
              />
            </label>
            <label className="relative text-sm font-medium">
              Email
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                placeholder="Alamat email"
              />
            </label>
            <label className="text-sm font-medium">
              Nomor WhatsApp
              <WhatsappInput required value={phone} onChange={setPhone} className="mt-2 h-12" />
            </label>
            <label className="text-sm font-medium">
              Password
              <input
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                className="h-12 w-full rounded-xl border border-input bg-background px-4 pr-12 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                placeholder="Minimal 6 karakter"
              />
              <button type="button" aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"} onClick={() => setShowPassword((value) => !value)} className="absolute right-0 top-7 flex h-12 w-12 items-center justify-center text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
              </button>
            </label>
            <label className="relative text-sm font-medium">
              Konfirmasi password
              <input
                required
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                type={showConfirmation ? "text" : "password"}
                className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 pr-12 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                placeholder="Ulangi password"
              />
              <button type="button" aria-label={showConfirmation ? "Sembunyikan password" : "Tampilkan password"} onClick={() => setShowConfirmation((value) => !value)} className="absolute right-0 top-7 flex h-12 w-12 items-center justify-center text-muted-foreground hover:text-foreground">
                {showConfirmation ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
              </button>
            </label>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <Button type="submit" variant="secondary" size="lg" className="mt-2 w-full rounded-full">
              Daftar sekarang <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <a href="/login" className="font-semibold text-foreground hover:underline">
              Masuk
            </a>
          </p>
        </div>
      </section>
    </AppShell>
  );
}
