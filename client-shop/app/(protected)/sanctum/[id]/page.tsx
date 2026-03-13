import { ArrowLeft } from "lucide-react";
import { GiScrollUnfurled } from "react-icons/gi";
import { serverGetSprite } from "@/features/sprite/api/sprite.server";
import { RelicImage } from "@/features/sprite/components/details/RelicImage";
import { RelicInfo } from "@/features/sprite/components/details/RelicInfo";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RelicDetailPage({ params }: Props) {
  const { id } = await params;
  const sprite = await serverGetSprite(id);

  if (!sprite) {
    return (
      <main className="relative bg-neutral-950 text-white min-h-screen overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-24">
          <Link
            href="/sanctum"
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-green-300 text-sm transition-colors duration-200 mb-10 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Sanctum
          </Link>

          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4">
              <GiScrollUnfurled className="w-7 h-7 text-neutral-600" />
            </div>
            <p className="text-neutral-400 font-semibold">Relic not found</p>
            <Link
              href="/sanctum"
              className="mt-6 px-5 py-2.5 border border-neutral-800 hover:border-green-400/40 rounded-xl text-sm text-neutral-400 hover:text-green-300 transition-all duration-200"
            >
              ← Return to Sanctum
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative bg-neutral-950 text-white min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-150 h-150 bg-green-400/3 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-24">
        <Link
          href="/sanctum"
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-green-300 text-sm transition-colors duration-200 mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Sanctum
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <RelicImage imageUrl={sprite.imageUrl} name={sprite.name} />
          <RelicInfo sprite={sprite} />
        </div>
      </div>
    </main>
  );
}