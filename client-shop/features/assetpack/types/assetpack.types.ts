export interface SpriteInfo {
    id: string;
    name: string;
    imageUrl: string;
}

export interface AssetPackRequest {
    name: string;
    description: string;
    price: number;
    spriteIds: string[];
}

export interface AssetPackResponse {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    spriteCount: number;
    sprites: SpriteInfo[];
    categoryIds: string[];
    categoryNames: string[];
    createdBy: string;
    createdAt: string;
}

export interface AssetPackFilterRequest {
    keyword?: string;
    categoryIds?: string[];
    minPrice?: number;
    maxPrice?: number;
    sortBy?: "price" | "createdAt";
    sortOrder?: "asc" | "desc";
}