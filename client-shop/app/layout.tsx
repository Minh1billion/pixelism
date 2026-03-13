import type { Metadata } from 'next'
import { Press_Start_2P } from 'next/font/google'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { RuntimeConfigLoader } from '@/shared/components/RuntimeConfigLoader'
import './globals.css'

const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pixel',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Pixelism',
  description:
    'A sprite gallery for your game development needs. Browse, download, and share pixel art sprites for free.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={pixelFont.variable}>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://lh3.googleusercontent.com" />
        <link rel="preconnect" href="https://lh3.githubusercontent.com" />
      </head>
      <body className="antialiased">
        <RuntimeConfigLoader />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}