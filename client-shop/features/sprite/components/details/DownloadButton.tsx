"use client";

import { Download } from "lucide-react";

interface DownloadButtonProps {
  imageUrl: string;
  slug: string;
}

export function DownloadButton({ imageUrl, slug }: DownloadButtonProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${slug}.png`;
    link.target = "_blank";
    link.click();
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center justify-center gap-2.5 px-8 py-4 bg-green-400 text-neutral-950 font-bold rounded-xl hover:bg-green-300 active:scale-[0.98] transition-all duration-200 text-base shadow-[0_0_30px_0_rgba(74,222,128,0.2)] hover:shadow-[0_0_40px_0_rgba(74,222,128,0.35)]"
    >
      <Download className="w-5 h-5" />
      Download Relic
    </button>
  );
}