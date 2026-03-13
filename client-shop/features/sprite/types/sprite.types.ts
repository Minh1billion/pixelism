export interface SpriteRequest {
    name: string;
    categoryIds: string[];
    isPublic: boolean;
}

export interface SpriteListResponse {
    id: string;
    name: string;
    slug: string;
    imageUrl: string;
    isPublic: boolean;
    createdAt: string;
    deletedAt?: string | null;
}

export interface SpriteResponse {
    id: string;
    name: string;
    slug: string;
    imageUrl: string;
    categoryIds: string[];
    categoryNames: string[];
    isPublic: boolean;
    createdBy: string;
    createdAt: string;
}

export interface SpriteFilterRequest {
    categoryIds?: string[];
    keyword?: string;
    sortOrder?: 'asc' | 'desc';
}