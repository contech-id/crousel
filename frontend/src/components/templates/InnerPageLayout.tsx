import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'

import { AppShell } from '@/components/templates/AppShell'

type InnerPageLayoutProps = {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}

export function InnerPageLayout({ eyebrow, title, description, children }: InnerPageLayoutProps) {
  return (
    <AppShell>
      <div className="bg-muted/40" data-aos="fade-up" data-aos-duration="800">
        <div className="mx-auto max-w-[90rem] px-4 pb-14 pt-12 sm:px-6 lg:px-8 lg:pb-20 lg:pt-16">
          <a href="/" className="mb-10 inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground" data-aos="fade-up" data-aos-delay="100"><ArrowLeft aria-hidden="true" className="size-3.5" /> Kembali ke beranda</a>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground" data-aos="fade-up" data-aos-delay="200">{eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.05em] sm:text-4xl" data-aos="fade-up" data-aos-delay="300">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg" data-aos="fade-up" data-aos-delay="400">{description}</p>
        </div>
      </div>
      {children}
    </AppShell>
  )
}
