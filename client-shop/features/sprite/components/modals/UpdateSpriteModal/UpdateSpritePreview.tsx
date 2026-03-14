'use client'

import Image from 'next/image'
import { Globe, Lock } from 'lucide-react'
import type { SpriteUpdateItem } from '@/features/sprite/hooks/useUpdatingSprite'

interface UpdateSpritePreviewProps {
  item: SpriteUpdateItem
}

export function UpdateSpritePreview({ item }: UpdateSpritePreviewProps) {
  const displayName = item.name.trim() || 'Unnamed Relic'

  return (
    <div className='flex flex-col items-center gap-3'>
      <p className='text-xs font-semibold text-neutral-500 uppercase tracking-wider'>Preview</p>

      <div className='relative w-full max-w-55' style={{ aspectRatio: '1 / 1' }}>
        {/* 0. Background */}
        <Image
          src='/sprite-card/themes/forest-theme.png'
          alt=''
          fill
          draggable={false}
          className='object-contain select-none pointer-events-none'
          style={{ imageRendering: 'pixelated' }}
        />

        {/* 1. Sprite image */}
        <div
          className='absolute overflow-hidden'
          style={{ top: '18%', left: '13%', width: '74%', height: '60%' }}
        >
          <img
            src={item.preview}
            alt={displayName}
            className='w-full h-full object-contain'
            style={{
              imageRendering: 'pixelated',
              filter:
                'drop-shadow(0 0 1px #000) drop-shadow(0 0 1px #000) drop-shadow(0 0 1px #000)',
            }}
          />
        </div>

        {/* 2. Slot frame */}
        <Image
          src='/sprite-card/sprite-body.png'
          alt=''
          fill
          draggable={false}
          className='object-contain select-none pointer-events-none'
          style={{ imageRendering: 'pixelated' }}
        />

        {/* 3. Title banner */}
        <Image
          src='/sprite-card/title-banner.png'
          alt=''
          fill
          draggable={false}
          className='object-contain select-none pointer-events-none'
          style={{ imageRendering: 'pixelated' }}
        />

        {/* 4. Name */}
        <div
          className='absolute pointer-events-none'
          style={{ top: '3%', left: '15%', width: '70%', height: '12%' }}
        >
          <p
            className='w-full h-full flex items-center justify-center font-bold text-neutral-200'
            style={{
              fontSize: 'clamp(0.48rem, 1.3vw, 0.68rem)',
              textShadow: '0 1px 4px rgba(0,0,0,0.95)',
              WebkitMaskImage: 'linear-gradient(to right, white 70%, transparent 100%)',
              maskImage: 'linear-gradient(to right, white 70%, transparent 100%)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            {displayName}
          </p>
        </div>

        {/* 5. Visibility badge */}
        <div
          className='absolute pointer-events-none'
          style={{ bottom: '6%', left: '10%', width: '80%' }}
        >
          <div className='flex items-center justify-center'>
            {item.isPublic ? (
              <span
                className='flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-400/15 border border-green-400/30 text-green-300'
                style={{ fontSize: 'clamp(0.38rem, 1vw, 0.55rem)' }}
              >
                <Globe
                  style={{
                    width: 'clamp(0.4rem, 0.9vw, 0.55rem)',
                    height: 'clamp(0.4rem, 0.9vw, 0.55rem)',
                  }}
                />
                Public
              </span>
            ) : (
              <span
                className='flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-800/80 border border-neutral-700 text-neutral-400'
                style={{ fontSize: 'clamp(0.38rem, 1vw, 0.55rem)' }}
              >
                <Lock
                  style={{
                    width: 'clamp(0.4rem, 0.9vw, 0.55rem)',
                    height: 'clamp(0.4rem, 0.9vw, 0.55rem)',
                  }}
                />
                Private
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Live indicator */}
      <div className='flex items-center gap-1.5'>
        <span className='w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse' />
        <span className='text-xs text-neutral-600'>Live preview</span>
      </div>
    </div>
  )
}