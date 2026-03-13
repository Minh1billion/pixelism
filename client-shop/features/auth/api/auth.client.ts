import { api } from "@/shared/lib/axios";
import type {
    SendOtpRequest,
    RegisterRequest,
    LoginRequest,
    ResetPasswordRequest,
    AuthResponse
} from "@/features/auth/types/auth.types";
import type { ApiResponse } from "@/shared/types/shared.types";

export class AuthService {

    static async sendRegistrationOtp(email: string): Promise<void> {
        try {
            const response = await api.post<ApiResponse<string>>(
                "/auth/register/send-otp",
                { email } as SendOtpRequest
            );
            if (!response.data.success) throw new Error(response.data.message);
        } catch (error: any) {
            throw new Error(error.response?.data?.message ?? error.message);
        }
    }

    static async sendResetPasswordOtp(email: string): Promise<void> {
        try {
            const response = await api.post<ApiResponse<string>>(
                "/auth/reset-password/send-otp",
                { email } as SendOtpRequest
            );
            if (!response.data.success) throw new Error(response.data.message);
        } catch (error: any) {
            throw new Error(error.response?.data?.message ?? error.message);
        }
    }

    static async register(data: RegisterRequest): Promise<void> {
        try {
            const response = await api.post<ApiResponse<AuthResponse["user"]>>(
                "/auth/register",
                data
            );
            if (!response.data.success) throw new Error(response.data.message);
            if (response.data.data) {
                localStorage.setItem("user", JSON.stringify(response.data.data));
            }
        } catch (error: any) {
            throw new Error(error.response?.data?.message ?? error.message);
        }
    }

    static async login(data: LoginRequest): Promise<void> {
        try {
            const response = await api.post<ApiResponse<AuthResponse["user"]>>(
                "/auth/login",
                data
            );
            if (!response.data.success) throw new Error(response.data.message);
            if (response.data.data) {
                localStorage.setItem("user", JSON.stringify(response.data.data));
            }
        } catch (error: any) {
            throw new Error(error.response?.data?.message ?? error.message);
        }
    }

    static async resetPassword(data: ResetPasswordRequest): Promise<void> {
        try {
            const response = await api.post<ApiResponse<AuthResponse["user"]>>(
                "/auth/reset-password",
                data
            );
            if (!response.data.success) throw new Error(response.data.message);
            if (response.data.data) {
                localStorage.setItem("user", JSON.stringify(response.data.data));
            }
        } catch (error: any) {
            throw new Error(error.response?.data?.message ?? error.message);
        }
    }

    static async setupPassword(password: string): Promise<void> {
        try {
            const response = await api.post<ApiResponse<AuthResponse["user"]>>(
                "/auth/setup-password",
                { password }
            );
            if (!response.data.success) throw new Error(response.data.message);
            if (response.data.data) {
                localStorage.setItem("user", JSON.stringify(response.data.data));
            }
        } catch (error: any) {
            throw new Error(error.response?.data?.message ?? error.message);
        }
    }

    static async logout(): Promise<void> {
        try {
            await api.post("/auth/logout");
        } finally {
            localStorage.removeItem("user");
        }
    }

    static getCurrentUser(): AuthResponse["user"] | null {
        if (typeof window === "undefined") return null;
        const userStr = localStorage.getItem("user");
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    }

    static async fetchCurrentUser(): Promise<AuthResponse["user"]> {
        try {
            const response = await api.get<ApiResponse<AuthResponse["user"]>>("/auth/me");
            if (!response.data.success || !response.data.data) {
                throw new Error(response.data.message ?? "Failed to fetch user");
            }
            localStorage.setItem("user", JSON.stringify(response.data.data));
            return response.data.data;
        } catch (error: any) {
            localStorage.removeItem("user");
            throw new Error(error.response?.data?.message ?? error.message);
        }
    }

    static isAuthenticated(): boolean {
        return this.getCurrentUser() !== null;
    }

    static async refreshUserData(): Promise<void> {
        try {
            const response = await api.get<ApiResponse<AuthResponse["user"]>>("/auth/me");
            if (response.data.success && response.data.data) {
                localStorage.setItem("user", JSON.stringify(response.data.data));
            }
        } catch (error: any) {
            localStorage.removeItem("user");
            throw new Error(error.response?.data?.message ?? error.message);
        }
    }
}