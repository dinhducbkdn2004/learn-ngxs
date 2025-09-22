export class LoadPostsByUserId {
  static readonly type = '[Posts] Load Posts';
  constructor(public userId: number) {}
}

export class LoadPostsPaginated {
  static readonly type = '[Post] Load Posts Paginated';
  constructor(public payload: { limit: number; skip: number; select?: string }) {}
}

export class AddPost {
  static readonly type = '[Posts] Add Post';
  constructor(
    public post: { title: string; body: string; tags: string[] },
    public userId: number
  ) {}
}

export class UpdatePost {
  static readonly type = '[Posts] Update Post';
  constructor(
    public id: number,
    public post: Partial<{ title: string; body: string; tags: string[] }>
  ) {}
}

export class DeletePost {
  static readonly type = '[Posts] Delete Post';
  constructor(public id: number) {}
}
