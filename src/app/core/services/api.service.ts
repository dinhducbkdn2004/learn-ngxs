import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../store/users/data-access/users.model';
import { Product } from '../models/product.model';
import { Post } from '../models/post.model';

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

  getPostsByUserId(userId: number): Observable<{ posts: Post[] }> {
    return this.httpClient.get<{ posts: Post[] }>(
      `${this.apiDummyUrl}/posts/user/${userId}`
    );
  }

  getAllPosts(params: {
    limit?: number;
    skip?: number;
    select?: string;
  }): Observable<{
    posts: Post[];
    total: number;
    skip: number;
    limit: number;
  }> {
    const query = new URLSearchParams();
    if (params.limit !== undefined)
      query.append('limit', params.limit.toString());
    if (params.skip !== undefined) query.append('skip', params.skip.toString());
    if (params.select) query.append('select', params.select);
    return this.httpClient.get<{
      posts: Post[];
      total: number;
      skip: number;
      limit: number;
    }>(`${this.apiDummyUrl}/posts?${query.toString()}`);
  }

  addPost(post: Partial<Post>, userId: number): Observable<Post> {
    return this.httpClient.post<Post>(`${this.apiDummyUrl}/posts/add`, {
      ...post,
      userId,
    });
  }

  updatePost(id: number, post: Partial<Post>): Observable<Post> {
    return this.httpClient.put<Post>(`${this.apiDummyUrl}/posts/${id}`, post);
  }

  deletePost(id: number): Observable<Post> {
    return this.httpClient.delete<Post>(`${this.apiDummyUrl}/posts/${id}`);
  }
}
