import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../store/users/users.state';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/users';
  private readonly apiDummyUrl = 'https://dummyjson.com';

  private readonly httpClient = inject(HttpClient);

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.apiUrl);
  }

  login(username: string, password: string): Observable<any> {
    return this.httpClient.post(`${this.apiDummyUrl}/auth/login`, {
      username,
      password,
    });
  }

  getProducts(): Observable<{ products: Product[] }> {
    return this.httpClient.get<{ products: Product[] }>(
      `${this.apiDummyUrl}/products`
    );
  }
}
