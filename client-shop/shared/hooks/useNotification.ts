'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'

export type NotificationType = 'SPRITE_READY' | 'SPRITE_REJECTED' | 'SPRITE_ERROR'

export interface Notification {
  id: string
  type: NotificationType
  spriteId: string
  spriteName?: string
  confidence?: number
  timestamp: number
}

export function useNotification() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const esRef = useRef<EventSource | null>(null)

  const dismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const dismissAll = useCallback(() => setNotifications([]), [])

  useEffect(() => {
    if (!user) return

    const es = new EventSource('/api/v1/sse/connect', { withCredentials: true })
    esRef.current = es

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)

        const notification: Notification = {
          id: crypto.randomUUID(),
          type: data.type,
          spriteId: data.spriteId,
          spriteName: data.spriteName,
          confidence: data.confidence,
          timestamp: Date.now(),
        }
        setNotifications(prev => [notification, ...prev])
        setTimeout(() => dismiss(notification.id), 6000)

        if (data.type === 'SPRITE_READY') {
          window.dispatchEvent(new CustomEvent('sprite:ready', { detail: { spriteId: data.spriteId } }))
        }
        if (data.type === 'SPRITE_REJECTED') {
          window.dispatchEvent(new CustomEvent('sprite:rejected', { detail: { spriteId: data.spriteId } }))
        }
      } catch {
        // ignore
      }
    }

    es.onerror = () => {
      es.close()
      esRef.current = null
    }

    return () => {
      es.close()
      esRef.current = null
    }
  }, [user, dismiss])

  return { notifications, dismiss, dismissAll }
}