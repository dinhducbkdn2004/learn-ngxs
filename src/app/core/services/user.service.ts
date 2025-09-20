import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../store/users/users.state';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/users';

  private readonly httpClient = inject(HttpClient);

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.apiUrl);
  }
}
