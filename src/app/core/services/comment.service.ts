import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CommentResponse, CommentsResponse, CreateCommentDto, CreateReplyDto } from '../models/comment.model';
import { Identifier } from '../models/strapi-type.model';

@Injectable({
    providedIn: 'root'
})
export class CommentService {
    private apiUrl = `${environment.apiUrl}/api/comments`;

    constructor(private http: HttpClient) { }

    /**
     * Get all comments with populated relations
     */
    getComments(): Observable<CommentsResponse> {
        return this.http.get<CommentsResponse>(`${this.apiUrl}?populate=*`);
    }
    /**
     * Get comments with pagination
     * @param page The page number to retrieve
     * @param pageSize The number of comments per page
     * @returns Observable of paginated comments response
     */
    getCommentsWithPagination(page: number = 1, pageSize: number = 10): Observable<CommentsResponse> {
        return this.http.get<CommentsResponse>(
            `${this.apiUrl}?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
        );
    }
    /**
     * Get a specific comment by ID
     * @param commentId The ID of the comment to retrieve
     * @returns Observable of comment response
     */
    getCommentsByPostId(postId: Identifier): Observable<CommentsResponse> {
        return this.http.get<CommentsResponse>(`${this.apiUrl}?from_post=${postId}&populate=from_user&populate=media`);
    }

    /**
     * Get comments by post ID with pagination
     * @param postId The ID of the post to retrieve comments for
     * @param page The page number to retrieve
     * @param pageSize The number of comments per page
     * @returns Observable of paginated comments response
     */
    getCommentsByPostIdWithPagination(postId: Identifier, page: number = 1, pageSize: number = 10): Observable<CommentsResponse> {
        return this.http.get<CommentsResponse>(`${this.apiUrl}?from_post=${postId}&populate=from_user&populate=media&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
    }
    /**
     * Get a specific comment by ID with populated relations
     */
    getCommentById(commentId: Identifier): Observable<CommentResponse> {
        return this.http.get<CommentResponse>(`${this.apiUrl}/${commentId}?populate=*`);
    }

    /**
     * Create a new comment
     */
    createComment(comment: CreateCommentDto): Observable<CommentResponse> {
        return this.http.post<CommentResponse>(this.apiUrl, comment);
    }

    /**
     * Create a reply to a comment
     * @param reply The reply data to post
     * @returns Observable of comment response
     */
    createReply(reply: CreateReplyDto): Observable<CommentResponse> {
        return this.http.post<CommentResponse>(this.apiUrl, reply);
    }

    /**
     * Get replies for a specific comment
     * @param commentId The parent comment ID
     * @returns Observable of comments response containing replies
     */
    getRepliesByCommentId(commentId: Identifier): Observable<CommentsResponse> {
        return this.http.get<CommentsResponse>(`${this.apiUrl}?parent=${commentId}&populate=from_user&populate=media`);
    }

    /**
     * Get replies for a specific comment with pagination
     * @param commentId The parent comment ID
     * @param page The page number to retrieve
     * @param pageSize The number of replies per page
     * @returns Observable of paginated comments response
     */
    getRepliesByCommentIdWithPagination(commentId: Identifier, page: number = 1, pageSize: number = 10): Observable<CommentsResponse> {
        return this.http.get<CommentsResponse>(`${this.apiUrl}?parent=${commentId}&populate=from_user&populate=media&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
    }

    /**
     * Update an existing comment
     */
    updateComment(commentId: Identifier, comment: CreateCommentDto): Observable<CommentResponse> {
        return this.http.put<CommentResponse>(`${this.apiUrl}/${commentId}`, comment);
    }
    /**
     * Upvote a comment
     * @param commentId The ID of the comment to upvote
     * @returns Observable of comment response
     */
    upvoteComment(commentId: Identifier): Observable<CommentResponse> {
        return this.http.post<CommentResponse>(`${this.apiUrl}/${commentId}/upvote`, {});
    }

    /**
     * Downvote a comment
     * @param commentId The ID of the comment to downvote
     * @returns Observable of comment response
     */
    downvoteComment(commentId: Identifier): Observable<CommentResponse> {
        return this.http.post<CommentResponse>(`${this.apiUrl}/${commentId}/downvote`, {});
    }

    /**
     * Remove vote from a comment
     * @param commentId The ID of the comment to remove vote from
     * @returns Observable of comment response
     */
    removeVoteFromComment(commentId: Identifier): Observable<CommentResponse> {
        return this.http.delete<CommentResponse>(`${this.apiUrl}/${commentId}/vote`);
    }
    /**
     * Delete a comment
     */
    deleteComment(commentId: Identifier): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${commentId}`);
    }
}