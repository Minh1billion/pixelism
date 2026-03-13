export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PageResponse<T> {
    content: T[];
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;

    page?: {
        size: number;
        number: number;
        totalElements: number;
        totalPages: number;
    };
}

export type NotificationType = 'SPRITE_READY' | 'SPRITE_REJECTED' | 'SPRITE_ERROR'

export interface Notification {
  id: string
  type: NotificationType
  spriteId: string
  spriteName?: string
  confidence?: number
  timestamp: number
}