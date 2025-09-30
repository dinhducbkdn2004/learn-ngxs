export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UsersStateModel {
  users: User[];
  searchKeyword: string;
}
