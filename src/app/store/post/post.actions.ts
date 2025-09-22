export class LoadPosts {
  static readonly type = '[Posts] Load Posts';
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

export class LikePost {
  static readonly type = '[Posts] Like Post';
  constructor(public id: number, public userId: number) {}
}

export class DislikePost {
  static readonly type = '[Posts] Dislike Post';
  constructor(public id: number, public userId: number) {}
}
