"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { DesktopNavigator } from "./navbar/DesktopNavigator";
import { MobileNavigator } from "./navbar/MobileNavigator";
import { HiMenu, HiX } from "react-icons/hi";

function AvatarImage({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false);
  return (
    <Image
      src={errored ? "/placeholder.png" : src}
      alt={alt}
      fill
      className="object-cover"
      onError={() => setErrored(true)}
    />
  );
}

function Avatar({ src, alt }: { src?: string | null; alt: string }) {
  return (
    <div className="relative shrink-0 overflow-hidden rounded-full border border-green-400/40 bg-green-950 ring-1 ring-green-400/10 ring-offset-1 ring-offset-neutral-950 transition-all duration-300 w-7 h-7">
      <AvatarImage key={src ?? "placeholder"} src={src || "/placeholder.png"} alt={alt} />
      <div className="absolute inset-0 rounded-full bg-linear-to-br from-green-300/10 to-transparent pointer-events-none" />
    </div>
  );
}

export function Header() {
  const { user } = useAuth();
  const { logout, loading: logoutLoading } = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const avatar = <Avatar src={user?.avatarUrl} alt={user?.username ?? "Wanderer"} />;

  return (
    <header
      className={`sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-md border-b border-green-400/10 transition-all duration-300 ease-in-out ${
        scrolled ? "shadow-lg shadow-black/40" : ""
      }`}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-green-400/30 to-transparent pointer-events-none" />

      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 transition-all duration-300 ease-in-out ${
          scrolled ? "h-10" : "h-14"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div
            className={`bg-white/5 rounded-md border border-green-400/20 group-hover:border-green-400/40 transition-all duration-300 overflow-hidden ${
              scrolled ? "w-6 h-6 p-px" : "w-7 h-7 p-0.5"
            }`}
          >
            <Image
              src="/pixelism.webp"
              alt="Pixelism"
              width={28}
              height={28}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col leading-none">
            <span
              className={`text-white font-black tracking-tight transition-all duration-300 ${
                scrolled ? "text-xs sm:text-sm" : "text-sm sm:text-base"
              }`}
            >
              PIXELISM
            </span>
            {!scrolled && (
              <span className="text-green-400/50 text-[9px] tracking-[0.2em] uppercase font-medium hidden sm:block">
                ⚔ Realm of Pixels ⚔
              </span>
            )}
          </div>
        </Link>

        {/* Right: user + logout */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-px h-4 bg-neutral-800" />
            {avatar}
            <div className="flex flex-col leading-none">
              <span
                className={`font-medium text-white leading-none whitespace-nowrap max-w-45 truncate transition-all duration-300 ${
                  scrolled ? "text-xs" : "text-sm"
                }`}
              >
                {user?.username ?? "Wanderer"}
              </span>
              {!scrolled && (
                <span className="text-green-400/50 text-[9px] tracking-wide">Adventurer</span>
              )}
            </div>
            <button
              onClick={logout}
              disabled={logoutLoading}
              className={`text-neutral-400 hover:text-amber-300 border border-neutral-800 hover:border-amber-400/30 px-3 rounded-lg transition-all disabled:opacity-40 whitespace-nowrap ${
                scrolled ? "text-[10px] py-0.5" : "text-xs py-1"
              }`}
            >
              {logoutLoading ? "Departing..." : "Depart"}
            </button>
          </div>

          <div className="sm:hidden flex items-center gap-1.5">
            <button
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-neutral-800 text-neutral-400 hover:text-green-400 hover:border-green-400/30 transition-all"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <HiX className="w-4 h-4" /> : <HiMenu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop nav bar */}
      <div
        className={`hidden sm:block border-t border-neutral-800/50 overflow-hidden transition-all duration-300 ease-in-out ${
          scrolled ? "max-h-0 opacity-0 border-transparent" : "max-h-32 opacity-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <DesktopNavigator />
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <MobileNavigator
          onClose={() => setMenuOpen(false)}
          avatar={avatar}
        />
      )}
    </header>
  );
}