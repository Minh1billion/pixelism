export interface CategoryResponse {
    id: string;
    name: string;
    slug: string;
    description: string;
    createdAt: string;
}

export interface CategoryRequest {
    name: string;
    description: string;
}