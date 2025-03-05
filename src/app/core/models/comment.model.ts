import { Post } from "./post.model";
import { Identifier, Media } from "./strapi-type.model";
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
    parent?: Comment;
    replies?: Comment[];
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
        from_post: Identifier;
        from_user: Identifier;
    };
}

export interface CreateReplyDto {
    data: {
        content: string;
        from_post: Identifier;
        from_user: Identifier;
        parent: Identifier;
    }
}