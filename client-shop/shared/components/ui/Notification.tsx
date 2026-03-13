'use client'

import { useNotification } from '@/shared/hooks/useNotification'
import type { Notification } from '@/shared/types/shared.types';

function NotificationToast({ n, onDismiss }: { n: Notification; onDismiss: () => void }) {
  const isReady    = n.type === 'SPRITE_READY'
  const isRejected = n.type === 'SPRITE_REJECTED'

  const icon    = isReady ? '✦' : isRejected ? '✕' : '⚠'
  const title   = isReady
    ? 'Relic forged!'
    : isRejected
    ? 'Relic rejected'
    : 'Forge failed'
  const message = isReady
    ? `"${n.spriteName}" bound to the realm (${((n.confidence ?? 0) * 100).toFixed(0)}% pixel art)`
    : isRejected
    ? `"${n.spriteName}" is not pixel art (${((1 - (n.confidence ?? 0)) * 100).toFixed(0)}% confidence)`
    : 'Something went wrong during forging'

  const colors = isReady
    ? 'border-green-500/40 bg-green-950/60'
    : isRejected
    ? 'border-red-500/40 bg-red-950/60'
    : 'border-amber-500/40 bg-amber-950/60'

  const iconColor = isReady
    ? 'text-green-400'
    : isRejected
    ? 'text-red-400'
    : 'text-amber-400'

  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm shadow-xl ${colors} animate-in slide-in-from-right-4 duration-300`}>
      <span className={`text-sm mt-0.5 shrink-0 ${iconColor}`}>{icon}</span>
      <div className='flex-1 min-w-0'>
        <p className='text-white text-sm font-semibold leading-none mb-1'>{title}</p>
        <p className='text-neutral-400 text-xs leading-relaxed'>{message}</p>
      </div>
      <button
        onClick={onDismiss}
        className='text-neutral-600 hover:text-neutral-300 transition-colors text-xs shrink-0 mt-0.5'
      >
        ✕
      </button>
    </div>
  )
}

export function NotificationStack() {
  const { notifications, dismiss } = useNotification()

  if (!notifications.length) return null

  return (
    <div className='fixed bottom-6 left-6 z-50 flex flex-col gap-2 w-80 max-w-[calc(100vw-3rem)]'>
      {notifications.map(n => (
        <NotificationToast key={n.id} n={n} onDismiss={() => dismiss(n.id)} />
      ))}
    </div>
  )
}