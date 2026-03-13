"use client";

import { useState } from "react";
import { useResetPassword } from "@/features/auth/hooks/useResetPassword";

interface ResetPasswordFormProps {
  onSwitchToLogin: () => void;
}

export default function ResetPasswordForm({ onSwitchToLogin }: ResetPasswordFormProps) {
  const [step, setStep] = useState<"email" | "verify">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { sendOtp, resetPassword, loading, error } = useResetPassword();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendOtp(email);
      setStep("verify");
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword({ email, otp, newPassword, confirmPassword });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full rounded-3xl bg-zinc-900/90 border border-green-400/20 p-8 backdrop-blur-sm shadow-[0_0_30px_rgba(34,197,94,0.15)]">
      <h1 className="mb-8 text-center text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]">
        Reforge Your Sacred Rune
      </h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/40 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {step === "email" && (
        <form onSubmit={handleSendOtp}>
          <div className="mb-6">
            <label className="mb-2 block text-sm text-green-400">Guild Mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full rounded-lg bg-zinc-800 border border-green-400/40 px-4 py-2.5 text-white"
            />
            <p className="mt-2 text-xs text-zinc-400">
              A mystical Arcane Seal will be sent to your Guild Mail.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mb-4 w-full rounded-lg bg-green-500 py-2.5 font-bold text-black transition hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "SUMMONING..." : "Summon the Arcane Seal"}
          </button>

          <p className="text-center text-sm text-zinc-400">
            Remember your Sacred Rune?{" "}
            <button type="button" onClick={onSwitchToLogin} className="text-green-400 hover:text-green-300 transition">
              Return to the Gate
            </button>
          </p>
        </form>
      )}

      {step === "verify" && (
        <form onSubmit={handleResetPassword}>
          <div className="mb-4">
            <label className="mb-2 block text-sm text-green-400">Arcane Seal</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              disabled={loading}
              className="w-full rounded-lg bg-zinc-800 border border-green-400/40 px-4 py-2.5 text-white"
            />
            <p className="mt-2 text-xs text-zinc-400">
              Check your Guild Mail for the 6-digit Arcane Seal.
            </p>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm text-green-400">New Sacred Rune</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
              className="w-full rounded-lg bg-zinc-800 border border-green-400/40 px-4 py-2.5 text-white"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm text-green-400">Confirm Sacred Rune</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full rounded-lg bg-zinc-800 border border-green-400/40 px-4 py-2.5 text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mb-4 w-full rounded-lg bg-green-500 py-2.5 font-bold text-black transition hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "REFORGING..." : "Reforge My Rune"}
          </button>

          <div className="mb-4 text-center">
            <button
              type="button"
              onClick={() => setStep("email")}
              disabled={loading}
              className="text-sm text-green-400 hover:text-green-300 transition"
            >
              Did the seal fade? Summon it again.
            </button>
          </div>

          <p className="text-center text-sm text-zinc-400">
            Remember your Sacred Rune?{" "}
            <button type="button" onClick={onSwitchToLogin} className="text-green-400 hover:text-green-300 transition">
              Return to the Gate
            </button>
          </p>
        </form>
      )}
    </div>
  );
}