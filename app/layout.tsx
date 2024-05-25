import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '../components/made/Nav'
import { Toaster } from '@/components/ui/sonner'
import SessionWrapper from '@/components/made/SessionWrapper'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Minify',
  description: 'Generate minified urls',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SessionWrapper>
      <html lang='en'>
        <body className={inter.variable}>
          <Navbar />
          {children}
          <Toaster />
        </body>
      </html>
    </SessionWrapper>
  )
}
