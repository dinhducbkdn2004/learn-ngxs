import { ApiState } from './base-state.model';

export interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  userId: number;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
}

export interface PostStateModel {
  posts: ApiState<PostsResponse>;
  postForm: {
    model?: {
      title?: string;
      body?: string;
      tags?: string;
    };
  };
}
