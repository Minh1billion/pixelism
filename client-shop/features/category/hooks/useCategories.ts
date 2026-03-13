'use client'

import { CategoryService } from '@/features/category/api/category.client'
import { CategoryResponse } from '@/features/category/types/category.types'
import { useEffect, useRef, useState } from 'react'

let cachedCategories: CategoryResponse[] | null = null
let fetchPromise: Promise<CategoryResponse[]> | null = null

export function useCategories() {
  const [categories, setCategories] = useState<CategoryResponse[]>(
    cachedCategories ?? []
  )
  const [loading, setLoading] = useState(cachedCategories === null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (cachedCategories !== null) {
      setCategories(cachedCategories)
      setLoading(false)
      return
    }

    if (fetchPromise) {
      fetchPromise
        .then(data => {
          setCategories(data)
          setLoading(false)
        })
        .catch(err => {
          setError(err.message)
          setLoading(false)
        })
      return
    }

    fetchPromise = CategoryService.getAll()

    fetchPromise
      .then(data => {
        cachedCategories = data ?? []
        setCategories(cachedCategories)
        setLoading(false)
      })
      .catch(err => {
        fetchPromise = null 
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const refresh = () => {
    cachedCategories = null
    fetchPromise = null
    setLoading(true)
    setError(null)

    fetchPromise = CategoryService.getAll()
    fetchPromise
      .then(data => {
        cachedCategories = data ?? []
        setCategories(cachedCategories)
        setLoading(false)
      })
      .catch(err => {
        fetchPromise = null
        setError(err.message)
        setLoading(false)
      })
  }

  return { categories, loading, error, refresh }
}