import { ArrowRight, LockKeyhole, Phone } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { Button } from '@/components/atoms/ui/button'
import { AppShell } from '@/components/templates/AppShell'
import { useAuth } from '@/hooks/useAuth'

function navigate(path: string) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function LoginPage() {
  const { login } = useAuth()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const redirect = new URLSearchParams(window.location.search).get('redirect') || '/profil'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!await login(phone.trim(), password)) {
      setError('Nomor WhatsApp atau password belum sesuai.')
      return
    }
    navigate(redirect)
  }

  return (
    <AppShell>
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-[90rem] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="hidden rounded-3xl bg-foreground p-10 text-background lg:block"><p className="text-xs font-bold uppercase tracking-[0.22em] text-background/60">Selamat datang kembali</p><h1 className="mt-5 text-5xl font-black tracking-tight">Langkah nyaman dimulai dari sini.</h1><p className="mt-5 max-w-sm leading-7 text-background/65">Masuk untuk melanjutkan belanja dan mengelola pesanan Crousel-mu.</p></div>
        <div className="mx-auto w-full max-w-md"><p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">Akun Crousel</p><h1 className="mt-3 text-4xl font-black tracking-tight">Masuk</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Gunakan nomor WhatsApp dan password untuk melanjutkan.</p><form onSubmit={handleSubmit} className="mt-8 space-y-5"><label className="block text-sm font-medium">Nomor WhatsApp<input required value={phone} onChange={(event) => setPhone(event.target.value)} type="tel" placeholder="+62 812 3456 7890" className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30" /></label><label className="block text-sm font-medium">Password<input required value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Masukkan password" className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30" /></label>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button type="submit" variant="secondary" size="lg" className="w-full rounded-full">Masuk <ArrowRight aria-hidden="true" className="size-4" /></Button></form><p className="mt-6 text-center text-sm text-muted-foreground">Belum punya akun? <a href="/daftar" className="font-semibold text-foreground hover:underline">Daftar sekarang</a></p><div className="mt-8 flex justify-center gap-4 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1"><Phone aria-hidden="true" className="size-3.5" /> Aman dan praktis</span><span className="inline-flex items-center gap-1"><LockKeyhole aria-hidden="true" className="size-3.5" /> Data terlindungi</span></div></div>
      </section>
    </AppShell>
  )
}
