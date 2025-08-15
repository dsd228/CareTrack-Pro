'use client'

import { ThemeProvider } from '../lib/theme'
import Layout from '../components/Layout'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ThemeProvider>
      <Layout>
        {children}
      </Layout>
    </ThemeProvider>
  )
}