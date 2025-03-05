import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Post, PostResponse, PostsResponse, CreatePostDto } from '../models/post.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = `${environment.apiUrl}/api/posts`;

  constructor(private http: HttpClient) {}

  // Get all posts with pagination
  getPosts(page: number = 1, pageSize: number = 10): Observable<PostsResponse> {
    return this.http.get<PostsResponse>(
      `${this.apiUrl}?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=poster`
    );
  }
  
  // Get a specific post by ID
  getPostById(id: number): Observable<PostResponse> {
    return this.http.get<PostResponse>(`${this.apiUrl}/${id}?populate=poster`);
  }

  // Create a new post
  createPost(content: string, poster: string, medias?: string[]): Observable<PostResponse> {
    const postData: CreatePostDto = {
      data: {
        content,
        poster,
        medias
      }
    };
    return this.http.post<PostResponse>(this.apiUrl, postData);
  }

  // Update an existing post
  updatePost(id: number, postData: Partial<{ content: string, medias?: string[] }>): Observable<PostResponse> {
    return this.http.put<PostResponse>(`${this.apiUrl}/${id}`, { data: postData });
  }

  // Delete a post
  deletePost(id: number): Observable<PostResponse> {
    return this.http.delete<PostResponse>(`${this.apiUrl}/${id}`);
  }

  // Upvote a post
  upvotePost(id: number): Observable<PostResponse> {
    return this.http.put<PostResponse>(`${this.apiUrl}/${id}`, { 
      data: { upvote: { increment: 1 } } 
    });
  }

  // Search posts
  searchPosts(query: string, page: number = 1, pageSize: number = 10): Observable<PostsResponse> {
    return this.http.get<PostsResponse>(
      `${this.apiUrl}?filters[content][$containsi]=${query}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=poster`
    );
  }

}
