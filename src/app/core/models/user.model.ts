export interface User {
    id?: number;
    documentId?: string;
    username: string;
    email: string;
    provider?: string;
    confirmed?: boolean;
    blocked?: boolean;
    password?: string; // Only for signup
    avatar?: Avatar; // for data retrieving
}

interface ImageFormat {
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

interface Avatar {
    id: number;
    documentId: string;
    name: string;
    alternativeText: null | string;
    caption: null | string;
    width: number;
    height: number;
    formats: {
        thumbnail: ImageFormat;
        small: ImageFormat;
        large: ImageFormat;
        medium: ImageFormat;
    };
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