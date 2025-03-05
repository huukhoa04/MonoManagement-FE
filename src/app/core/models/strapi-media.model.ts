export interface ImageFormat {
    name: string;
    hash: string;
    ext: string;
    mime: string;
    path: null | string;
    width: number;
    height: number;
    size: number;
    sizeInBytes: number;
    url: string;
}

export interface Media {
    id: number;
    documentId: string;
    name: string;
    alternativeText: null | string;
    caption: null | string;
    width: number;
    height: number;
    formats: Record<string, ImageFormat>;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: null | string;
    provider: string;
    provider_metadata: null | any; // Replace `any` with a specific type if provider_metadata has a known structure
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export interface PaginationParams {
    page?: number;
    pageSize?: number;
    sort?: string;
}

export interface PaginationMeta {
    pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
    };
}