import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Comment, CommentResponse, CommentsResponse, CreateCommentDto } from '../models/comment.model';




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
    getCommentsByPostId(postId: number): Observable<CommentsResponse> {
        return this.http.get<CommentsResponse>(`${this.apiUrl}?from_post=${postId}&populate=from_user&populate=media`);
    }

    /**
     * Get comments by post ID with pagination
     * @param postId The ID of the post to retrieve comments for
     * @param page The page number to retrieve
     * @param pageSize The number of comments per page
     * @returns Observable of paginated comments response
     */
    getCommentsByPostIdWithPagination(postId: number, page: number = 1, pageSize: number = 10): Observable<CommentsResponse> {
        return this.http.get<CommentsResponse>(`${this.apiUrl}?from_post=${postId}&populate=from_user&populate=media&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
    }
    /**
     * Get a specific comment by ID with populated relations
     */
    getCommentById(commentId: number): Observable<CommentResponse> {
        return this.http.get<CommentResponse>(`${this.apiUrl}/${commentId}?populate=*`);
    }

    /**
     * Create a new comment
     */
    createComment(comment: CreateCommentDto): Observable<CommentResponse> {
        return this.http.post<CommentResponse>(this.apiUrl, comment);
    }

    /**
     * Update an existing comment
     */
    updateComment(commentId: number, comment: CreateCommentDto): Observable<CommentResponse> {
        return this.http.put<CommentResponse>(`${this.apiUrl}/${commentId}`, comment);
    }

    /**
     * Delete a comment
     */
    deleteComment(commentId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${commentId}`);
    }
}