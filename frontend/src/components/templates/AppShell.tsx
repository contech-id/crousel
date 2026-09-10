import type { ReactNode } from 'react'

import { FooterSection } from '@/components/organisms/FooterSection'
import { StoreNavbar } from '@/components/organisms/StoreNavbar'

type AppShellProps = {
  children: ReactNode
  hideFooter?: boolean
}

export function AppShell({ children, hideFooter }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar />
      <main>{children}</main>
      {!hideFooter && <FooterSection />}
    </div>
  )
}
