export class GetPostsByUserId {
  static readonly type = '[Posts] Load Posts';
  constructor(
    public userId: number,
    public payload?: { limit?: number; skip?: number; select?: string }
  ) {}
}

export class GetPostById {
  static readonly type = '[Posts] Load Post By Id';
  constructor(public id: number) {}
}

export class GetPostComments {
  static readonly type = '[Posts] Load Post Comments';
  constructor(public postId: number) {}
}

export class GetAllPosts {
  static readonly type = '[Post] Load Posts Paginated';
  constructor(
    public payload: { limit: number; skip: number; select?: string }
  ) {}
}

export class SearchPosts {
  static readonly type = '[Posts] Search Posts';
  constructor(
    public query: string,
    public payload?: { limit?: number; skip?: number; select?: string }
  ) {}
}

export class SortPosts {
  static readonly type = '[Posts] Sort Posts';
  constructor(
    public sortBy: 'title' | 'views' | 'reactions' | 'userId',
    public order: 'asc' | 'desc' = 'asc',
    public payload?: { limit?: number; skip?: number; select?: string }
  ) {}
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

export class ResetPostForm {
  static readonly type = '[Posts] Reset Form';
  constructor(
    public value?: { title?: string; body?: string; tags?: string }
  ) {}
}

export class SetPostFormForEdit {
  static readonly type = '[Posts] Set Form For Edit';
  constructor(public post: { title: string; body: string; tags: string[] }) {}
}
