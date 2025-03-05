import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';
import { User } from '../models/user.model';
import { Identifier } from '../models/strapi-type.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  me() {
    return this.http.get(`${this.apiUrl}/me?populate=avatar`)
    .pipe(map((response: any) => response as User));
  }

  fetchByPage(page: number, limit: number) {
    return this.http.get(`${this.apiUrl}?_page=${page}&_limit=${limit}&populate=avatar`)
    .pipe(map((response: any) => response as User[]));
  }

  fetchById(id: Identifier) {
    return this.http.get(`${this.apiUrl}/${id}?populate=avatar`)
    .pipe(map((response: any) => response as User));
  }

  update(user: User) {
    return this.http.put(`${this.apiUrl}/${user.id}`, user)
    .pipe(map((response: any) => response as User));
  }
  
}
