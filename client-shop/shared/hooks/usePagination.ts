"use client";

import { useCallback, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function usePagination(initialPage = 0, initialSize = 12) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const page = parseInt(searchParams.get("page") ?? String(initialPage), 10);
    const size = initialSize;

    const routerRef = useRef(router);
    const pathnameRef = useRef(pathname);
    const searchParamsRef = useRef(searchParams);
    const isMounted = useRef(false);

    useEffect(() => {
        routerRef.current = router;
        pathnameRef.current = pathname;
        searchParamsRef.current = searchParams;
    });

    const goToPage = useCallback((p: number) => {
        const params = new URLSearchParams(searchParamsRef.current.toString());
        if (p === 0) {
            params.delete("page");
        } else {
            params.set("page", String(p));
        }
        const qs = params.toString();
        const url = qs ? `${pathnameRef.current}?${qs}` : pathnameRef.current;
        routerRef.current.replace(url, { scroll: false });
    }, []);

    const reset = useCallback(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }
        goToPage(0);
    }, [goToPage]);

    return { page, size, goToPage, reset };
}