export class FetchUsers {
  static readonly type = '[Users] Fetch Users';
}

export class SearchUsers {
  static readonly type = '[Users] Search Users';
  constructor(public keyword: string) {}
}
