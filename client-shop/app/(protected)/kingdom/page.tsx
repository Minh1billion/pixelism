'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { GiCastle, GiScrollUnfurled } from 'react-icons/gi'
import { RuneSeparator } from '@/shared/components/ui/RuneSeparator'

export default function KingdomPage() {
  const router = useRouter()

  return (
    <main className="relative bg-neutral-950 text-white overflow-hidden">

      {/* Hero */}
      <section className="relative overflow-hidden">

        {/* FULL WIDTH BACKGROUND */}
        <div className="absolute inset-0 w-screen left-1/2 -translate-x-1/2">
          <Image
            src="/bg-kingdom-img.webp"
            alt="Pixel background"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-neutral-950/60" />
        </div>

        {/* CONTENT CONTAINER */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-green-950/50 border border-green-400/20 px-4 py-2 rounded-full mb-8">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-300 text-xs tracking-[0.25em] uppercase">
              Pixel Art Realm
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-none tracking-tight mb-6">
            Dive in the
            <br />
            <span className="text-green-400">fantasy realm.</span>
          </h1>

          <p className="text-neutral-300 text-base sm:text-lg max-w-xl leading-relaxed mb-6">
            Venture through thousands of hand-crafted pixel relics. Claim them
            individually or pledge allegiance for boundless access.
          </p>

          <RuneSeparator />

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={() => router.push('/bazaar')}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-green-400 text-neutral-950 font-bold rounded-xl hover:bg-green-300 transition-colors"
            >
              <GiCastle className="w-4 h-4" />
              Enter the Bazaar
            </button>

            <button
              onClick={() => router.push('/grimoire')}
              className="flex items-center justify-center gap-2 px-8 py-3 border border-neutral-700 hover:border-green-400/50 rounded-xl transition-colors"
            >
              <GiScrollUnfurled className="w-4 h-4 text-green-400/60" />
              Read the Grimoire
            </button>
          </div>

        </div>
      </section>
    </main>
  )
}