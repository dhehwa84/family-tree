import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Madzvamutse Family Tree APP',
  description: 'Developed by Simon Madzvamutse',
  generator: 'madzvamutsesimon@gmail.com',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      {/* Combine font class names here */}
      <body className={`${GeistSans.className} ${GeistMono.variable}`}>
        {children}
      </body>
    </html>
  )
}
