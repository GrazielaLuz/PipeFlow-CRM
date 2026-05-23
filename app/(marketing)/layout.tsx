import type { Metadata } from 'next'
import { Navbar } from '@/components/marketing/navbar'
import { Footer } from '@/components/marketing/footer'

export const metadata: Metadata = {
  title: 'PipeFlow CRM — CRM simples para times de vendas',
  description:
    'Gerencie seus leads, acompanhe o pipeline e feche mais negócios com o PipeFlow CRM. Grátis para começar.',
  openGraph: {
    title: 'PipeFlow CRM — CRM simples para times de vendas',
    description:
      'Gerencie seus leads, acompanhe o pipeline e feche mais negócios com o PipeFlow CRM.',
    type: 'website',
  },
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
