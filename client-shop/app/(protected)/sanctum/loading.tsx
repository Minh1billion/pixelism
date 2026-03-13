import { RuneSeparator } from '@/shared/components/ui/RuneSeparator'

export default function Loading () {
  return (
    <main className='relative bg-neutral-950 text-white min-h-screen overflow-hidden'>
      {/* Hero skeleton */}
      <section className='relative overflow-hidden'>
        <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16'>
          <div className='inline-flex items-center gap-2 bg-green-950/50 border border-green-400/20 px-4 py-2 rounded-full mb-8'>
            <div className='w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse' />
            <span className='text-green-300 text-xs tracking-[0.25em] uppercase'>
              The Sanctum
            </span>
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

      {/* Grid skeleton */}
      <section className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-24 -mt-4'>
        <div className='flex items-center justify-between mb-6 flex-wrap gap-3'>
          <div className='h-10 w-52 rounded-xl bg-neutral-900 border border-neutral-800 animate-pulse' />
        </div>
        <div className='mb-6 h-10 w-full rounded-xl bg-neutral-900 border border-neutral-800 animate-pulse' />
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 gap-y-6'>
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className='rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 animate-pulse'
            >
              <div className='aspect-square w-full bg-neutral-800' />
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
