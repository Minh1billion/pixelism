"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/features/auth/context/AuthContext";
import Entry from "@/shared/components/Entry";
import { Suspense } from "react";

function PageContent() {
    const { isAuthenticated, loading } = useAuthContext();
    const router = useRouter();
    const searchParams = useSearchParams();

    const mode = searchParams.get("mode");
    const isSetupPassword = mode === "setup-password";

    useEffect(() => {
        if (loading) return;

        if (isSetupPassword) return;

        if (isAuthenticated) {
            router.replace("/kingdom");
        }
    }, [isAuthenticated, loading, isSetupPassword, router]);

    if (loading) return null;

    if (isSetupPassword) return <Entry />;

    if (!isAuthenticated) return <Entry />;

    return null;
}

export default function Page() {
    return (
        <Suspense fallback={null}>
            <PageContent />
        </Suspense>
    );
}