import Image from 'next/image'
import { RuneSeparator } from '@/shared/components/ui/RuneSeparator'
import { SanctumClient } from '@/features/resource/components/SanctumClient'
import { serverGetResources } from '@/features/resource/api/resource.server'
import { serverGetCategories } from '@/features/category/api/category.server'
import type { CategoryResponse } from '@/features/category/types/category.types'

export const dynamic = 'force-dynamic'

const EMPTY_CATEGORIES: CategoryResponse[] = []

async function loadSanctumData() {
  const fetchStart = Date.now()

  const [resourcesResult, categoriesResult] = await Promise.allSettled([
    serverGetResources({}, 0, 42),
    serverGetCategories(),
  ])

  const serverDurationMs = Date.now() - fetchStart

  if (resourcesResult.status === 'rejected') {
    console.error('[SSR] serverGetResources failed:', resourcesResult.reason)
  }
  if (categoriesResult.status === 'rejected') {
    console.error('[SSR] serverGetCategories failed:', categoriesResult.reason)
  }

  return {
    initialResources:
      resourcesResult.status === 'fulfilled' ? resourcesResult.value : null,
    initialCategories:
      categoriesResult.status === 'fulfilled' ? categoriesResult.value : EMPTY_CATEGORIES,
    serverDurationMs,
  }
}

export default async function SanctumPage() {
  const { initialResources, initialCategories, serverDurationMs } = await loadSanctumData()

  return (
    <main className='relative bg-neutral-950 text-white min-h-screen overflow-hidden'>
      <section className='relative overflow-hidden'>
        <div className='absolute inset-0 w-screen left-1/2 -translate-x-1/2'>
          <Image
            src='/bg-sanctum-image.webp'
            alt='Sanctum background'
            fill
            priority
            sizes='100vw'
            className='object-cover'
          />
          <div className='absolute inset-0 bg-neutral-950/65' />
          <div className='absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-neutral-950 to-transparent' />
        </div>

        <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16'>
          <div className='inline-flex items-center gap-2 bg-green-950/50 border border-green-400/20 px-4 py-2 rounded-full mb-8'>
            <div className='w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse' />
            <span className='text-green-300 text-xs tracking-[0.25em] uppercase'>The Sanctum</span>
          </div>

          <h1 className='text-4xl sm:text-5xl md:text-7xl font-black leading-none tracking-tight mb-6'>
            Browse the
            <br />
            <span className='text-green-400'>pixel relics.</span>
          </h1>

          <p className='text-neutral-300 text-base sm:text-lg max-w-xl leading-relaxed mb-6'>
            Every sprite forged within the realm lives here. Search, filter, and
            claim the ones that call to you.
          </p>

          <RuneSeparator />
        </div>
      </section>

      <section className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-24 -mt-4'>
        <SanctumClient
          initialResources={initialResources}
          initialCategories={initialCategories}
          serverDurationMs={serverDurationMs}
        />
      </section>
    </main>
  )
}