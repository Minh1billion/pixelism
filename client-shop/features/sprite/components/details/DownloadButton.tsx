"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

interface DownloadButtonProps {
  imageUrl: string;
  slug: string;
}

export function DownloadButton({ imageUrl, slug }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const params = new URLSearchParams({
        url: imageUrl,
        filename: `${slug}.png`,
      });

      const res = await fetch(`/api/download?${params}`);
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${slug}.png`;
      link.click();

      URL.revokeObjectURL(objectUrl);
    } catch {
      // fallback: open in new tab
      window.open(imageUrl, "_blank");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center justify-center gap-2.5 px-8 py-4 bg-green-400 text-neutral-950 font-bold rounded-xl hover:bg-green-300 active:scale-[0.98] transition-all duration-200 text-base shadow-[0_0_30px_0_rgba(74,222,128,0.2)] hover:shadow-[0_0_40px_0_rgba(74,222,128,0.35)] disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Download className="w-5 h-5" />
      )}
      {loading ? "Downloading…" : "Download Relic"}
    </button>
  );
}