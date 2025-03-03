import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  me() {
    return this.http.get(`${this.apiUrl}/me?populate=avatar`)
    .pipe(map((response: any) => response as User));
  }
  
  fetchByPage(page: number, limit: number) {
    return this.http.get(`${this.apiUrl}?_page=${page}&_limit=${limit}&populate=avatar`)
    .pipe(map((response: any) => response as User[]));
  }

  fetchById(id: string) {
    return this.http.get(`${this.apiUrl}/${id}?populate=avatar`)
    .pipe(map((response: any) => response as User));
  }

  update(user: User) {
    try {
      if (this.authService.getCurrentUser().id !== user.id) {
        throw new Error('Unauthorized: Ngu lam em oi');
      }
      return this.http.put(`${this.apiUrl}/${user.id}`, user)
      .pipe(map((response: any) => response as User));
    } catch (error) {
      // This will be caught by the global error handler
      throw error;
    }
  }

}
