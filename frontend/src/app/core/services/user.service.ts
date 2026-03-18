import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = environment.api.users;

  getProfile(): Observable<User> {
    return this.http.get<{ data: { user: User } }>(`${this.baseUrl}`).pipe(
      map(res => res.data.user)
    );
  }

  updateProfile(id: number, formData: FormData): Observable<User> {
    return this.http.put<{ data: { user: User } }>(`${this.baseUrl}/${id}`, formData).pipe(
      map(res => res.data.user)
    );
  }

  deleteAccount(id: number): Observable<User> {
    return this.http.delete<User>(`${this.baseUrl}/${id}`);
  }
}