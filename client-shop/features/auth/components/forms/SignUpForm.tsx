"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegister } from "@/features/auth/hooks/useRegister";

interface SignUpFormProps {
  onSwitchToLogin: () => void;
}

export default function SignUpForm({ onSwitchToLogin }: SignUpFormProps) {
  const [step, setStep] = useState<"email" | "verify">("email");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const { sendOtp, register, loading, error } = useRegister();
  const router = useRouter();

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendOtp(email);
      setStep("verify");
    } catch (err: any) {
      const message: string = err?.message ?? "";
      if (message.startsWith("OAUTH_ACCOUNT_EXISTS:")) {
        const providers = message.replace("OAUTH_ACCOUNT_EXISTS:", "");
        const friendlyMessage = encodeURIComponent(
          `This email is already linked to ${providers}. Please sign in using that method.`
        );
        router.push(`/?message=${friendlyMessage}`);
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ email, username, fullName, password, confirmPassword, otp });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full rounded-3xl bg-zinc-900/90 border border-green-400/20 p-8 backdrop-blur-sm shadow-[0_0_30px_rgba(34,197,94,0.15)]">
      <h1 className="mb-8 text-center text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]">
        Forge Your Legend
      </h1>

      {error && !error.startsWith("OAUTH_ACCOUNT_EXISTS") && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/40 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {step === "email" && (
        <form onSubmit={handleSendEmail}>
          <div className="mb-4">
            <label className="mb-2 block text-sm text-green-400">Guild Mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hero@realm.com"
              required
              disabled={loading}
              className="w-full rounded-lg bg-zinc-800 border border-green-400/40 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/40 focus:outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green-500 py-2.5 font-bold text-black transition hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed mb-4 shadow-lg"
          >
            {loading ? "SUMMONING..." : "Summon the Arcane Seal"}
          </button>

          <p className="text-center text-sm text-zinc-400">
            Already sworn to the realm?{" "}
            <button type="button" onClick={onSwitchToLogin} className="text-green-400 hover:text-green-300 transition">
              Return to the Gate
            </button>
          </p>
        </form>
      )}

      {step === "verify" && (
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="mb-2 block text-sm text-green-400">Hero Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="shadowblade"
              required
              disabled={loading}
              className="w-full rounded-lg bg-zinc-800 border border-green-400/40 px-4 py-2.5 text-white"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm text-green-400">True Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Arin Nightfall"
              required
              disabled={loading}
              className="w-full rounded-lg bg-zinc-800 border border-green-400/40 px-4 py-2.5 text-white"
            />
          </div>

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
              className="w-full rounded-lg bg-zinc-800 border border-green-400/40 px-4 py-2.5 text-white"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm text-green-400">Confirm Sacred Rune</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••"
              required
              disabled={loading}
              className="w-full rounded-lg bg-zinc-800 border border-green-400/40 px-4 py-2.5 text-white"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm text-green-400">Arcane Seal</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              required
              disabled={loading}
              className="w-full rounded-lg bg-zinc-800 border border-green-400/40 px-4 py-2.5 text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green-500 py-2.5 font-bold text-black transition hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed mb-4 shadow-lg"
          >
            {loading ? "FORGING..." : "Forge My Legend"}
          </button>

          <p className="text-center text-sm text-zinc-400">
            Already sworn to the realm?{" "}
            <button type="button" onClick={onSwitchToLogin} className="text-green-400 hover:text-green-300 transition">
              Return to the Gate
            </button>
          </p>
        </form>
      )}
    </div>
  );
}