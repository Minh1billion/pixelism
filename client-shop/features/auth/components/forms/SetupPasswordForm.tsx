"use client";

import { useState } from "react";
import { useSetupPassword } from "../../hooks/useSetupPassword";

interface SetupPasswordFormProps {
  providerName?: string; 
}

export default function SetupPasswordForm({ providerName }: SetupPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setupPassword, loading, error } = useSetupPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setupPassword({ password, confirmPassword });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full rounded-3xl bg-zinc-900/90 border border-green-400/20 p-8 backdrop-blur-sm shadow-[0_0_30px_rgba(34,197,94,0.15)]">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]">
          Forge Your Rune
        </h1>
        <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
          Your {providerName ? (
            <span className="text-green-400 font-medium">{providerName}</span>
          ) : "social"} account has been linked.
          <br />
          Set a password to enable local login as well.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/40 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="mb-2 block text-sm text-green-400">Sacred Rune</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            required
            minLength={6}
            disabled={loading}
            className="w-full rounded-lg bg-zinc-800 border border-green-400/40 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/40 focus:outline-none transition-all"
          />
        </div>

        <div className="mb-8">
          <label className="mb-2 block text-sm text-green-400">Confirm Sacred Rune</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••"
            required
            disabled={loading}
            className="w-full rounded-lg bg-zinc-800 border border-green-400/40 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/40 focus:outline-none transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-green-500 py-2.5 font-bold text-black transition hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? "FORGING..." : "SEAL THE RUNE"}
        </button>

        <p className="mt-4 text-center text-xs text-zinc-500">
          You can also set this later in your account settings.
        </p>
      </form>
    </div>
  );
}