"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const getPages = (): (number | "...")[] => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i);
        if (page <= 3) return [0, 1, 2, 3, 4, "...", totalPages - 1];
        if (page >= totalPages - 4) return [0, "...", totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1];
        return [0, "...", page - 1, page, page + 1, "...", totalPages - 1];
    };

    return (
        <div className="flex items-center justify-center gap-1 mt-10">
            <PageBtn onClick={() => onPageChange(page - 1)} disabled={page === 0}>
                <ChevronLeft size={12} />
            </PageBtn>

            {getPages().map((p, i) =>
                p === "..." ? (
                    <span key={`e-${i}`} className="w-8 text-center text-green-500/25 text-[10px] select-none">
                        ···
                    </span>
                ) : (
                    <PageBtn key={p} onClick={() => onPageChange(p as number)} active={p === page}>
                        {(p as number) + 1}
                    </PageBtn>
                )
            )}

            <PageBtn onClick={() => onPageChange(page + 1)} disabled={page === totalPages - 1}>
                <ChevronRight size={12} />
            </PageBtn>
        </div>
    );
}

function PageBtn({
    children,
    onClick,
    disabled,
    active,
}: {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    active?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={[
                "w-8 h-8 flex items-center justify-center text-[10px] border transition-all duration-150 select-none",
                active
                    ? "bg-green-500/15 border-green-500/60 text-green-300"
                    : "bg-[#080f08] border-[#1e3320] text-green-500/50 hover:border-green-500/40 hover:text-green-300 hover:bg-[#0b150b]",
                disabled ? "opacity-25 cursor-not-allowed pointer-events-none" : "cursor-pointer",
            ].join(" ")}
        >
            {children}
        </button>
    );
}