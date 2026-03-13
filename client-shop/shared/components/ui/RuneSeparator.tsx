export function RuneSeparator() {
    return (
        <div className="flex items-center gap-2 my-2">
            <div className="flex-1 h-px bg-linear-to-r from-transparent to-green-400/20" />
            <span className="text-green-400/30 text-[9px] tracking-[0.4em] select-none">ᚱᚢᚾᛖ</span>
            <div className="flex-1 h-px bg-linear-to-l from-transparent to-green-400/20" />
        </div>
    );
}