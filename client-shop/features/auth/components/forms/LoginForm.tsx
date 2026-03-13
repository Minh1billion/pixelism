"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { getRuntimeConfig } from '@/shared/lib/runtime-config'

interface LoginFormProps {
  onSwitchToSignup: () => void;
  onSwitchToReset: () => void;
}

export default function LoginForm({ onSwitchToSignup, onSwitchToReset }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoogleLogin = () => {
    const { backendUrl } = getRuntimeConfig()
    window.location.href = `${backendUrl}/oauth2/authorization/google`
  }

  const handleGithubLogin = () => {
    const { backendUrl } = getRuntimeConfig()
    window.location.href = `${backendUrl}/oauth2/authorization/github`
  }

  return (
    <div className="w-full rounded-3xl bg-zinc-900/90 border border-green-400/20 p-8 backdrop-blur-sm shadow-[0_0_30px_rgba(34,197,94,0.15)]">
      <form onSubmit={handleSubmit}>
        <h1 className="mb-8 text-center text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]">
          Return, Adventurer.
        </h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/40 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="mb-2 block text-sm text-green-400">Adventurer&apos;s Mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={loading}
            className="w-full rounded-lg bg-zinc-800 border border-green-400/40 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/40 focus:outline-none transition-all"
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm text-green-400">Sacred Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            required
            disabled={loading}
            className="w-full rounded-lg bg-zinc-800 border border-green-400/40 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/40 focus:outline-none transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mb-4 w-full rounded-lg bg-green-500 py-2.5 font-bold text-black transition hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? "UNLOCKING..." : "UNSEAL THE GATE"}
        </button>

        <div className="mb-6 text-center">
          <button type="button" onClick={onSwitchToReset} className="text-sm text-green-400 hover:text-green-300 transition">
            Lost your sacred rune?
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-green-400/20" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-zinc-900 px-4 text-green-400">OR</span>
          </div>
        </div>

        <div className="mb-6 flex gap-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-green-400/20 bg-zinc-800 py-2.5 text-white transition hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FcGoogle size={20} />
          </button>
          <button
            type="button"
            onClick={handleGithubLogin}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-green-400/20 bg-zinc-800 py-2.5 text-white transition hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaGithub size={20} />
          </button>
        </div>

        <p className="text-center text-sm text-zinc-400">
          New to this realm? Begin your journey.{" "}
          <button type="button" onClick={onSwitchToSignup} className="text-green-400 hover:text-green-300 transition">
            Create Your Legend
          </button>
        </p>
      </form>
    </div>
  );
}