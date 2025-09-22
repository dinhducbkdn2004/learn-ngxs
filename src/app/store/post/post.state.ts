import { inject, Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { Post } from '../../core/models/post.model';
import { tap } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import {
  LoadPosts,
  AddPost,
  UpdatePost,
  DeletePost,
  LikePost,
  DislikePost,
} from './post.actions';

export interface PostStateModel {
  posts: Post[];
  total: number;
  loading: boolean;

  postForm: {
    model: {
      title: string;
      body: string;
      tags: string[];
    };
    dirty: boolean;
    status: string;
    errors: {};
  };
}

@State<PostStateModel>({
  name: 'post',
  defaults: {
    posts: [],
    total: 0,
    loading: false,
    postForm: {
      model: {
        title: '',
        body: '',
        tags: [],
      },
      dirty: false,
      status: '',
      errors: {},
    },
  },
})
@Injectable()
export class PostState {
  private readonly apiService = inject(ApiService);

  @Selector()
  static posts(state: PostStateModel) {
    return state.posts;
  }

  @Selector()
  static total(state: PostStateModel) {
    return state.total;
  }

  @Selector()
  static postCountByUser(state: PostStateModel) {
    return (userId: number) =>
      state.posts.filter((p) => p.userId === userId).length;
  }

  @Selector()
  static totalLikes(state: PostStateModel) {
    return state.posts.reduce((acc, p) => acc + p.reactions.likes, 0);
  }

  @Action(LoadPosts)
  loadPosts(ctx: StateContext<PostStateModel>) {
    ctx.patchState({ loading: true });
    return this.apiService.getPosts().pipe(
      tap((res) => {
        ctx.patchState({
          posts: res.posts,
          total: res.posts.length,
          loading: false,
        });
      })
    );
  }

  @Action(AddPost)
  addPost(ctx: StateContext<PostStateModel>, action: AddPost) {
    const state = ctx.getState();
    return this.apiService.addPost(action.post, action.userId).pipe(
      tap((res) => {
        ctx.patchState({
          posts: [...state.posts, res],
          total: state.total + 1,
        });
      })
    );
  }

  @Action(UpdatePost)
  updatePost(ctx: StateContext<PostStateModel>, action: UpdatePost) {
    const state = ctx.getState();
    return this.apiService.updatePost(action.id, action.post).pipe(
      tap((updatedPost) => {
        const posts = state.posts.map(post => 
          post.id === action.id ? { ...post, ...updatedPost } : post
        );
        ctx.patchState({ posts });
      })
    );
  }

  @Action(DeletePost)
  deletePost(ctx: StateContext<PostStateModel>, action: DeletePost) {
    const state = ctx.getState();
    return this.apiService.deletePost(action.id).pipe(
      tap((deletedPost) => {
        if (deletedPost.isDeleted) {
          // Nếu API trả về isDeleted: true, cập nhật post với trạng thái deleted
          const posts = state.posts.map(post => 
            post.id === action.id ? { ...post, ...deletedPost } : post
          );
          ctx.patchState({ posts });
        } else {
          // Nếu không có isDeleted, xóa hoàn toàn khỏi state
          ctx.patchState({
            posts: state.posts.filter((post) => post.id !== action.id),
            total: state.total - 1,
          });
        }
      })
    );
  }

  @Action(LikePost)
  likePost(ctx: StateContext<PostStateModel>, action: LikePost) {
    const state = ctx.getState();
    const posts = state.posts.map((post) => {
      if (post.id === action.id) {
        const likedByUsers = post.likedByUsers || [];
        const dislikedByUsers = post.dislikedByUsers || [];
        const userAlreadyLiked = likedByUsers.includes(action.userId);
        const userAlreadyDisliked = dislikedByUsers.includes(action.userId);

        if (userAlreadyLiked) {
          return {
            ...post,
            reactions: {
              ...post.reactions,
              likes: Math.max(0, post.reactions.likes - 1),
            },
            likedByUsers: likedByUsers.filter((id) => id !== action.userId),
          };
        } else {
          return {
            ...post,
            reactions: {
              ...post.reactions,
              likes: post.reactions.likes + 1,
              dislikes: userAlreadyDisliked
                ? Math.max(0, post.reactions.dislikes - 1)
                : post.reactions.dislikes,
            },
            likedByUsers: [...likedByUsers, action.userId],
            dislikedByUsers: userAlreadyDisliked
              ? dislikedByUsers.filter((id) => id !== action.userId)
              : dislikedByUsers,
          };
        }
      }
      return post;
    });
    ctx.patchState({ posts });
  }

  @Action(DislikePost)
  dislikePost(ctx: StateContext<PostStateModel>, action: DislikePost) {
    const state = ctx.getState();
    const posts = state.posts.map((post) => {
      if (post.id === action.id) {
        const likedByUsers = post.likedByUsers || [];
        const dislikedByUsers = post.dislikedByUsers || [];
        const userAlreadyLiked = likedByUsers.includes(action.userId);
        const userAlreadyDisliked = dislikedByUsers.includes(action.userId);

        if (userAlreadyDisliked) {
          return {
            ...post,
            reactions: {
              ...post.reactions,
              dislikes: Math.max(0, post.reactions.dislikes - 1),
            },
            dislikedByUsers: dislikedByUsers.filter(
              (id) => id !== action.userId
            ),
          };
        } else {
          return {
            ...post,
            reactions: {
              ...post.reactions,
              dislikes: post.reactions.dislikes + 1,
              likes: userAlreadyLiked
                ? Math.max(0, post.reactions.likes - 1)
                : post.reactions.likes,
            },
            dislikedByUsers: [...dislikedByUsers, action.userId],
            likedByUsers: userAlreadyLiked
              ? likedByUsers.filter((id) => id !== action.userId)
              : likedByUsers,
          };
        }
      }
      return post;
    });
    ctx.patchState({ posts });
  }
}
