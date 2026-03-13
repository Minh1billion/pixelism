"use client";

import { useEffect, useReducer, useCallback, useRef, useMemo } from "react";
import { SpriteService } from "@/features/sprite/api/sprite.client";
import { useDebounced } from "@/shared/hooks/useDebounced";
import type {
  SpriteFilterRequest,
  SpriteListResponse,
} from "@/features/sprite/types/sprite.types";
import type { PageResponse } from "@/shared/types/shared.types";

export type SpriteTab = "public" | "mine";

interface SpritesState {
  tab: SpriteTab;
  filters: SpriteFilterRequest;
  page: number;
  size: number;
  data: PageResponse<SpriteListResponse> | null;
  overrides: SpriteListResponse[];
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: "SWITCH_TAB"; tab: SpriteTab }
  | { type: "UPDATE_FILTERS"; partial: Partial<SpriteFilterRequest> }
  | { type: "GO_TO_PAGE"; page: number }
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; data: PageResponse<SpriteListResponse> }
  | { type: "FETCH_ERROR"; message: string }
  | { type: "PREPEND_SPRITES"; sprites: SpriteListResponse[] }
  | { type: "REMOVE_SPRITE"; id: string };

function reducer(state: SpritesState, action: Action): SpritesState {
  switch (action.type) {
    case "SWITCH_TAB":
      return {
        ...state,
        tab: action.tab,
        page: 0,
        filters: {},
        overrides: [],
        error: null,
      };

    case "UPDATE_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.partial },
        page: 0,
        overrides: [],
        error: null,
      };

    case "GO_TO_PAGE":
      return {
        ...state,
        page: action.page,
        overrides: [],
        error: null,
      };

    case "FETCH_START":
      return { ...state, loading: true, error: null };

    case "FETCH_SUCCESS":
      return { ...state, data: action.data, loading: false };

    case "FETCH_ERROR":
      return { ...state, error: action.message, loading: false };

    case "PREPEND_SPRITES":
      return {
        ...state,
        overrides: [...action.sprites, ...state.overrides],
      };

    case "REMOVE_SPRITE":
      return {
        ...state,
        overrides: state.overrides.filter((s) => s.id !== action.id),
        data: state.data
          ? {
              ...state.data,
              content: state.data.content.filter((s) => s.id !== action.id),
            }
          : state.data,
      };

    default:
      return state;
  }
}

interface UseSpritesOptions {
  initialData?: PageResponse<SpriteListResponse> | null;
}

export function useSprites({ initialData }: UseSpritesOptions = {}) {
  const [state, dispatch] = useReducer(reducer, {
    tab: "public",
    filters: {},
    page: 0,
    size: 42,
    data: initialData ?? null,
    overrides: [],
    loading: !initialData,
    error: null,
  });

  const debouncedSearch = useDebounced(state.filters.keyword ?? "", 400);

  const effectiveFilters = useMemo<SpriteFilterRequest>(() => ({
    ...state.filters,
    search: debouncedSearch || undefined,
  }), [state.filters, debouncedSearch]);

  const isHydrated = useRef(false);

  useEffect(() => {
    const isInitialPublicView =
      !isHydrated.current &&
      initialData != null &&
      state.tab === "public" &&
      state.page === 0;

    if (isInitialPublicView) {
      isHydrated.current = true;
      return;
    }

    isHydrated.current = true;

    let cancelled = false;

    dispatch({ type: "FETCH_START" });

    const fetchFn =
      state.tab === "mine"
        ? SpriteService.getMySprites(effectiveFilters, state.page, state.size)
        : SpriteService.getSprites(effectiveFilters, state.page, state.size);

    fetchFn
      .then((data) => {
        if (!cancelled) dispatch({ type: "FETCH_SUCCESS", data });
      })
      .catch((e: Error) => {
        if (!cancelled) dispatch({ type: "FETCH_ERROR", message: e.message });
      });

    return () => {
      cancelled = true;
    };
  }, [state.tab, effectiveFilters, state.page, state.size]);

  const baseContent = state.data?.content ?? [];
  const overrideIds = new Set(state.overrides.map((s) => s.id));
  const sprites = [
    ...state.overrides,
    ...baseContent.filter((s) => !overrideIds.has(s.id)),
  ];

  const prependSprites = useCallback(
    (sprites: SpriteListResponse[]) =>
      dispatch({ type: "PREPEND_SPRITES", sprites }),
    []
  );

  const removeSprite = useCallback(
    (id: string) => dispatch({ type: "REMOVE_SPRITE", id }),
    []
  );

  return {
    tab: state.tab,
    switchTab: (tab: SpriteTab) => dispatch({ type: "SWITCH_TAB", tab }),

    sprites,
    totalPages: state.data?.totalPages ?? 0,
    totalElements: state.data?.totalElements ?? 0,
    page: state.page,
    goToPage: (page: number) => dispatch({ type: "GO_TO_PAGE", page }),

    loading: state.loading,
    error: state.error,

    filters: state.filters,
    updateFilters: (partial: Partial<SpriteFilterRequest>) =>
      dispatch({ type: "UPDATE_FILTERS", partial }),

    prependSprites,
    removeSprite,
  };
}