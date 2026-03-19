'use client'

import { useEffect, useReducer, useCallback, useRef, useMemo } from 'react'
import { ResourceService } from '@/features/resource/api/resource.client'
import { usePagination } from '@/shared/hooks/usePagination'
import { useDebounced } from '@/shared/hooks/useDebounced'
import type { ResourceFilterRequest, ResourceListResponse } from '@/features/resource/types/resource.types'
import type { PageResponse } from '@/shared/types/shared.types'

interface ResourcesState {
  filters: ResourceFilterRequest
  data: PageResponse<ResourceListResponse> | null
  overrides: ResourceListResponse[]
  loading: boolean
  error: string | null
}

type Action =
  | { type: 'UPDATE_FILTERS'; partial: Partial<ResourceFilterRequest> }
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; data: PageResponse<ResourceListResponse> }
  | { type: 'FETCH_ERROR'; message: string }
  | { type: 'PREPEND_RESOURCES'; resources: ResourceListResponse[] }
  | { type: 'REMOVE_RESOURCE'; id: string }

function reducer(state: ResourcesState, action: Action): ResourcesState {
  switch (action.type) {
    case 'UPDATE_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.partial }, overrides: [], error: null }
    case 'FETCH_START':
      return { ...state, loading: true, error: null }
    case 'FETCH_SUCCESS':
      return { ...state, data: action.data, loading: false }
    case 'FETCH_ERROR':
      return { ...state, error: action.message, loading: false }
    case 'PREPEND_RESOURCES':
      return { ...state, overrides: [...action.resources, ...state.overrides] }
    case 'REMOVE_RESOURCE':
      return {
        ...state,
        overrides: state.overrides.filter((r) => r.id !== action.id),
        data: state.data
          ? { ...state.data, content: state.data.content.filter((r) => r.id !== action.id) }
          : state.data,
      }
    default:
      return state
  }
}

interface UseResourcesOptions {
  initialData?: PageResponse<ResourceListResponse> | null
  pageSize?: number
}

export function useResources({ initialData, pageSize = 42 }: UseResourcesOptions = {}) {
  const { page, size, goToPage, reset } = usePagination(0, pageSize)

  const [state, dispatch] = useReducer(reducer, {
    filters: {},
    data: initialData ?? null,
    overrides: [],
    loading: !initialData,
    error: null,
  })

  const debouncedKeyword = useDebounced(state.filters.keyword ?? '', 400)

  const effectiveFilters = useMemo<ResourceFilterRequest>(
    () => ({ ...state.filters, keyword: debouncedKeyword || undefined }),
    [state.filters, debouncedKeyword]
  )

  const isHydrated = useRef(false)

  useEffect(() => {
    const isInitialView = !isHydrated.current && initialData != null && page === 0
    if (isInitialView) {
      isHydrated.current = true
      return
    }
    isHydrated.current = true

    let cancelled = false
    dispatch({ type: 'FETCH_START' })

    ResourceService.getResources(effectiveFilters, page, size)
      .then((data) => { if (!cancelled) dispatch({ type: 'FETCH_SUCCESS', data }) })
      .catch((e: Error) => { if (!cancelled) dispatch({ type: 'FETCH_ERROR', message: e.message }) })

    return () => { cancelled = true }
  }, [effectiveFilters, page, size])

  const baseContent = state.data?.content ?? []
  const overrideIds = new Set(state.overrides.map((r) => r.id))
  const resources = [...state.overrides, ...baseContent.filter((r) => !overrideIds.has(r.id))]

  const updateFilters = useCallback(
    (partial: Partial<ResourceFilterRequest>) => {
      dispatch({ type: 'UPDATE_FILTERS', partial })
      reset()
    },
    [reset]
  )

  const prependResources = useCallback(
    (resources: ResourceListResponse[]) => dispatch({ type: 'PREPEND_RESOURCES', resources }),
    []
  )

  const removeResource = useCallback(
    (id: string) => dispatch({ type: 'REMOVE_RESOURCE', id }),
    []
  )

  return {
    resources,
    totalPages: state.data?.totalPages ?? 0,
    totalElements: state.data?.totalElements ?? 0,
    page,
    goToPage,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    updateFilters,
    prependResources,
    removeResource,
  }
}