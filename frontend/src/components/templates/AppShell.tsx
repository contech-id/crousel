import type { ReactNode } from 'react'

import { FooterSection } from '@/components/organisms/FooterSection'
import { StoreNavbar } from '@/components/organisms/StoreNavbar'

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar />
      <main>{children}</main>
      <FooterSection />
    </div>
  )
}
