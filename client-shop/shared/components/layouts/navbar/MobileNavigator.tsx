"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "./nav-link";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { RuneSeparator } from "@/shared/components/ui/RuneSeparator";

interface MobileNavigatorProps {
  onClose: () => void;
  avatar: React.ReactNode;
}

export function MobileNavigator({ onClose, avatar }: MobileNavigatorProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { logout, loading: logoutLoading } = useLogout();

  return (
    <div className="sm:hidden border-t border-neutral-800 bg-neutral-950 px-4 py-4">
      <div className="text-center mb-3">
        <p className="text-green-400/30 text-[10px] tracking-[0.3em] uppercase">
          ✦ Navigate the Realm ✦
        </p>
      </div>

      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-neutral-800">
        {avatar}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-white">{user?.username ?? "Wanderer"}</p>
          <p className="text-[10px] text-green-400/60 tracking-wide">Adventurer of the Realm</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`flex flex-col gap-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-green-400/10 text-green-400 border border-green-400/20"
                  : "text-neutral-400 bg-neutral-900 border border-neutral-800 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <Image
                  src={link.icon}
                  alt=""
                  width={42}
                  height={42}
                  className={`object-contain ${isActive ? "opacity-100" : "opacity-50"}`}
                  style={{ imageRendering: "pixelated" }}
                />
                {link.label}
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-green-400 ml-auto animate-pulse" />
                )}
              </div>
              <span className="text-[9px] text-neutral-600 leading-tight font-normal">
                {link.hint}
              </span>
            </Link>
          );
        })}
      </div>

      <button
        onClick={logout}
        disabled={logoutLoading}
        className="w-full text-sm text-neutral-400 hover:text-amber-300 border border-neutral-800 hover:border-amber-400/20 px-4 py-2.5 rounded-lg transition-all disabled:opacity-40 text-left"
      >
        {logoutLoading ? "⏳ Departing from the realm..." : "Depart from the Realm"}
      </button>

      <RuneSeparator />
    </div>
  );
}