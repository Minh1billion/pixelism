export interface UserListResponse {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl: string | null;
  role: "USER" | "ADMIN";
  isVerified: boolean;
  createdAt: string;
}

export interface UserFilterRequest {
  keyword?: string;
  role?: "USER" | "ADMIN";
}