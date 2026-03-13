import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4">
      <div className="text-center">
        <div
          className="text-8xl font-black tracking-tighter mb-2 select-none"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          <span className="text-white">4</span>
          <span className="text-green-400">0</span>
          <span className="text-white">4</span>
        </div>

        <div className="flex justify-center mb-8">
          <div className="h-1 w-16 bg-green-400 rounded-full" />
        </div>

        <h2 className="text-lg font-semibold text-white mb-2">Page Not Found</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-xs mx-auto">
          This page doesn&apos;t exist or has been moved. Head back to the store.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-green-500 hover:bg-green-400 text-black transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to The Kingdom
        </Link>
      </div>
    </div>
  );
}