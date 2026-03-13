"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "../api/auth.client";
import { AuthValidators } from "../../../shared/utils/validators";
import { useAuthContext } from "../context/AuthContext";

interface SetupPasswordRequest {
  password: string;
  confirmPassword: string;
}

export const useSetupPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { refreshUser } = useAuthContext();

  const setupPassword = async (data: SetupPasswordRequest) => {
    setLoading(true);
    setError(null);

    const passwordError = AuthValidators.validatePassword(data.password);
    if (passwordError) { setError(passwordError); setLoading(false); return; }

    const matchError = AuthValidators.validatePasswordMatch(data.password, data.confirmPassword);
    if (matchError) { setError(matchError); setLoading(false); return; }

    try {
      await AuthService.setupPassword(data.password);
      refreshUser();
      router.push("/home");
    } catch (err: any) {
      setError(err.message || "Failed to set password");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { setupPassword, loading, error };
};