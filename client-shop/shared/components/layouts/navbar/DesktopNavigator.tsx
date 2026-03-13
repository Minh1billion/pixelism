"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "./nav-link";

function RuneDivider() {
  return (
    <span className="text-green-400/20 text-[10px] select-none tracking-widest px-1">✦</span>
  );
}

export function DesktopNavigator() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-0.5 h-24 overflow-x-auto no-scrollbar">
      {NAV_LINKS.map((link, i) => {
        const isActive = pathname === link.href;
        return (
          <div key={link.href} className="flex items-center">
            {i > 0 && <RuneDivider />}
            <Link
              href={link.href}
              title={link.hint}
              className={`group flex items-center gap-1.5 px-3 h-7 rounded-md text-xs font-medium whitespace-nowrap transition-all relative ${
                isActive
                  ? "bg-green-400/10 text-green-400 border border-green-400/20"
                  : "text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Image
                src={link.icon}
                alt=""
                width={64}
                height={64}
                className={`object-contain shrink-0 transition-opacity duration-200 ${
                  isActive ? "opacity-100" : "opacity-50 group-hover:opacity-80"
                }`}
                style={{ imageRendering: "pixelated" }}
              />
              {link.label}
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-green-400 ml-0.5 animate-pulse" />
              )}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}