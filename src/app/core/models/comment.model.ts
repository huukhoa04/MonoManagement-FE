import { Post } from "./post.model";
import { Media } from "./strapi-media.model";
import { User } from "./user.model";

export interface Comment{
    id: number;
    documentId: string;
    content: string;
    upvote: number;
    media?: Media;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    from_user: User;
    from_post: Post;
}

export interface CommentResponse {
    data: Comment;
    meta: any;
}

export interface CommentsResponse {
    data: Comment[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

export interface CreateCommentDto {
    data: {
        content: string;
        from_post: string;
        from_user: string;
    };
}