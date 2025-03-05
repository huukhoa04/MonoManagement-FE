import { Media, PaginationMeta } from "./strapi-media.model";
import { User } from "./user.model";
import { Comment } from "./comment.model";
export interface Post {
    id: number;
    content: string;
    upvote: number;
    medias?: Media[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    poster: User;
    comments?: Comment[];
}

export interface PostResponse {
    data: Post;
    meta: any;
}

export interface PostsResponse {
    data: Post[];
    meta: PaginationMeta;
}

export interface CreatePostDto {
    data: {
        content: string;
        medias?: string[];
        poster: string;
    };
}
