import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function Loading() {
  return (
    <main className='relative bg-neutral-950 text-white min-h-screen overflow-hidden'>
      {/* Ambient glow */}
      <div className='pointer-events-none fixed inset-0 overflow-hidden' aria-hidden>
        <div className='absolute top-1/3 left-1/4 w-150 h-150 bg-green-400/3 rounded-full blur-[160px]' />
      </div>

      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-24'>
        {/* Back link */}
        <Link
          href='/sanctum'
          className='inline-flex items-center gap-2 text-neutral-500 hover:text-green-300 text-sm transition-colors duration-200 mb-10 group'
        >
          <ArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200' />
          Back to Sanctum
        </Link>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-start'>
          {/* Left — image skeleton */}
          <div className='flex flex-col gap-4'>
            <div className='aspect-square w-full max-w-md mx-auto rounded-2xl bg-neutral-900 border border-neutral-800 animate-pulse' />
            {/* Download button skeleton */}
            <div className='h-11 w-full max-w-md mx-auto rounded-xl bg-neutral-900 border border-neutral-800 animate-pulse' />
          </div>

          {/* Right — info skeleton */}
          <div className='flex flex-col gap-6 pt-2'>
            {/* Name */}
            <div className='h-10 w-3/4 rounded-xl bg-neutral-900 animate-pulse' />

            {/* Meta row */}
            <div className='flex items-center gap-3'>
              <div className='h-6 w-20 rounded-full bg-neutral-900 animate-pulse' />
              <div className='h-6 w-28 rounded-full bg-neutral-900 animate-pulse' />
            </div>

            {/* Separator */}
            <div className='h-px w-full bg-neutral-800' />

            {/* Categories label */}
            <div className='flex flex-col gap-3'>
              <div className='h-4 w-24 rounded bg-neutral-800 animate-pulse' />
              <div className='flex flex-wrap gap-2'>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className='h-7 w-20 rounded-full bg-neutral-900 border border-neutral-800 animate-pulse'
                  />
                ))}
              </div>
            </div>

            {/* Description / extra info */}
            <div className='flex flex-col gap-2 mt-2'>
              <div className='h-3.5 w-full rounded bg-neutral-900 animate-pulse' />
              <div className='h-3.5 w-5/6 rounded bg-neutral-900 animate-pulse' />
              <div className='h-3.5 w-4/6 rounded bg-neutral-900 animate-pulse' />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}