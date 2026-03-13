'use client'

import { useEffect } from 'react'
import { loadRuntimeConfig } from '@/shared/lib/runtime-config'

export function RuntimeConfigLoader() {
  useEffect(() => {
    loadRuntimeConfig()
  }, [])

  return null
}