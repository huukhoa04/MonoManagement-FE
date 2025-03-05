import { Post } from "./post.model";
import { Media } from "./strapi-type.model";
import { Comment } from "./comment.model";
export interface User {
    id?: number;
    documentId?: string;
    username: string;
    email: string;
    provider?: string;
    confirmed?: boolean;
    blocked?: boolean;
    password?: string; // Only for signup
    avatar?: Media; // for data retrieving
    posts?: Post[];
    comments?: Comment[];
}