import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Media, PaginationMeta, PaginationParams } from '../models/strapi-media.model';



// Pagination Interfaces


export interface FilesResponse {
    data: Media[];
    meta: PaginationMeta;
}

export interface SingleFileResponse {
    data: Media;
}

@Injectable({
    providedIn: 'root'
})
export class FileService {
    private readonly baseUrl = `${environment.baseUrl}/api/upload`;

    constructor(private http: HttpClient) {}

    /**
     * Get all files with pagination
     */
    getFiles(params?: PaginationParams): Observable<FilesResponse> {
        let httpParams = new HttpParams();
        
        if (params) {
            if (params.page) httpParams = httpParams.set('pagination[page]', params.page.toString());
            if (params.pageSize) httpParams = httpParams.set('pagination[pageSize]', params.pageSize.toString());
            if (params.sort) httpParams = httpParams.set('sort', params.sort);
        }

        return this.http.get<FilesResponse>(`${this.baseUrl}/files`, { params: httpParams });
    }

    /**
     * Get a specific file by ID
     */
    getFileById(fileId: number): Observable<SingleFileResponse> {
        return this.http.get<SingleFileResponse>(`${this.baseUrl}/files/${fileId}`);
    }

    /**
     * Upload one or multiple files
     */
    uploadFiles(files: File[], ref?: string, refId?: number, field?: string): Observable<Media[]> {
        const formData = new FormData();
        
        // Append each file to the form data
        files.forEach(file => {
            formData.append('files', file);
        });

        // Append optional relation data
        if (ref) formData.append('ref', ref);
        if (refId) formData.append('refId', refId.toString());
        if (field) formData.append('field', field);

        return this.http.post<Media[]>(`${this.baseUrl}`, formData);
    }
}