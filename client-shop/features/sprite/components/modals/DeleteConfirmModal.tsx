"use client";

import Image from "next/image";

interface DeleteConfirmModalProps {
  open: boolean;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({ open, loading, onConfirm, onCancel }: DeleteConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      <div className="relative z-10 w-full max-w-sm mx-4 bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex flex-col items-center gap-4 px-6 pt-8 pb-6 text-center">
          <Image
            src="/ui-icons/banishing.png"
            alt=""
            width={64}
            height={64}
            className="object-contain"
            style={{ imageRendering: "pixelated" }}
          />

          <div>
            <h3 className="text-white font-bold text-base tracking-wide">Banish this relic?</h3>
            <p className="text-neutral-500 text-xs mt-1.5 leading-relaxed">
              The relic will be cast into the Void.
              <br />
              You may reclaim it from there.
            </p>
          </div>

          <div className="flex gap-2 w-full pt-1">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-white text-sm font-semibold transition-all duration-200 disabled:opacity-50"
            >
              Retreat
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/40 hover:bg-red-500/30 text-red-300 text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Banishing…" : "Banish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}