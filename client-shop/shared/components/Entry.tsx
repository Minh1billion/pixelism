"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthContext } from "@/features/auth/context/AuthContext";
import LoginForm from "@/features/auth/components/forms/LoginForm";
import SignUpForm from "@/features/auth/components/forms/SignUpForm";
import ResetPasswordForm from "@/features/auth/components/forms/ResetPasswordForm";
import SetupPasswordForm from "@/features/auth/components/forms/SetupPasswordForm";

type Mode = "login" | "signup" | "reset" | "setup-password";

function EntryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthContext();

  const modeParam = searchParams.get("mode") as Mode | null;
  const providerParam = searchParams.get("provider") ?? undefined;
  const message = searchParams.get("message");

  const [mode, setMode] = useState<Mode>(modeParam ?? "login");

  const isSetupPassword = modeParam === "setup-password";
  const resolvedMode: Mode | null = isSetupPassword
    ? isAuthenticated ? "setup-password" : null
    : mode;

  useEffect(() => {
    if (!isSetupPassword) return;
    if (loading) return;
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isSetupPassword, isAuthenticated, loading, router]);

  if (loading && isSetupPassword) return null;
  if (resolvedMode === null) return null;

  return (
    <div className="flex min-h-screen">
      <div className="relative w-1/2 hidden md:block overflow-hidden">
        <Image
          src="/bg-entry-img.webp"
          alt="Pixel background"
          fill
          className="absolute inset-0 object-cover scale-105"
          priority
        />
        <div className="absolute inset-0 bg-green-900/30" />
        <div className="absolute inset-0 flex flex-col justify-center px-10 lg:px-16 xl:px-20">
          <div className="inline-flex items-center gap-2 bg-green-950/50 backdrop-blur-sm px-4 py-2 rounded-full w-fit mb-6 border border-green-400/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0" />
            <span className="text-green-200 text-xs lg:text-sm font-medium tracking-wider">
              FOR GAME CREATORS
            </span>
          </div>

          <div className="flex items-center gap-3 lg:gap-4 mb-6">
            <div className="relative w-12 h-12 lg:w-16 lg:h-16 bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-green-400/20 shrink-0">
              <Image
                src="/pixelism.webp"
                alt="Pixelism Logo"
                width={64}
                height={64}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-black text-white tracking-tight leading-none drop-shadow-lg">
              PIXELISM
            </h1>
          </div>

          <div className="h-1.5 w-24 bg-green-400 rounded-full" />

          <div className="mt-8 lg:mt-10 bg-green-950/30 backdrop-blur-md px-5 lg:px-6 py-4 lg:py-5 rounded-2xl border border-green-400/10 max-w-lg">
            <p className="text-green-50 text-base lg:text-lg leading-relaxed font-light">
              A curated pixel art gallery where you discover, collect and
              integrate sprites seamlessly into your games.
            </p>
            <p className="text-green-300 text-sm lg:text-base mt-3 font-medium">
              Built for creators. Designed for enthusiasts.
            </p>
          </div>

          <div className="flex gap-6 lg:gap-8 mt-10 lg:mt-12">
            {[
              { value: "Diverse", label: "Sprites" },
              { value: "Mostly", label: "Free" },
              { value: "Affordable", label: "Pricing" },
            ].map((item) => (
              <div key={item.label} className="text-left">
                <div className="text-xl lg:text-3xl font-bold text-white">{item.value}</div>
                <div className="text-green-300 text-xs lg:text-sm mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-neutral-950 p-6 sm:p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8 md:hidden">
            <div className="relative w-8 h-8 bg-white/5 rounded-lg p-1 border border-green-400/20">
              <Image
                src="/pixelism.webp"
                alt="Pixelism"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-white font-black tracking-tight text-lg">PIXELISM</span>
          </div>

          {message && (
            <div className="mb-6 rounded-lg bg-green-500/10 border border-green-400/30 p-3 text-sm text-green-300 text-center">
              {decodeURIComponent(message)}
            </div>
          )}

          {resolvedMode === "login" && (
            <LoginForm
              onSwitchToSignup={() => setMode("signup")}
              onSwitchToReset={() => setMode("reset")}
            />
          )}
          {resolvedMode === "signup" && (
            <SignUpForm onSwitchToLogin={() => setMode("login")} />
          )}
          {resolvedMode === "reset" && (
            <ResetPasswordForm onSwitchToLogin={() => setMode("login")} />
          )}
          {resolvedMode === "setup-password" && (
            <SetupPasswordForm providerName={providerParam} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function Entry() {
  return (
    <Suspense fallback={null}>
      <EntryContent />
    </Suspense>
  );
}