import { inject, Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { Post } from '../../core/models/post.model';
import { tap } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import {
  AddPost,
  UpdatePost,
  DeletePost,
  LoadPostsByUserId,
  LoadPostsPaginated,
  ResetPostForm,
  SetPostFormForEdit,
} from './post.actions';
import { UpdateFormValue, ResetForm } from '@ngxs/form-plugin';

export interface PostStateModel {
  posts: Post[];
  total: number;
  loading: boolean;

  postForm: {
    model?: {
      title?: string;
      body?: string;
      tags?: string;
    };
  };
}

@State<PostStateModel>({
  name: 'post',
  defaults: {
    posts: [],
    total: 0,
    loading: false,
    postForm: {
      model: undefined,
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

  @Action(LoadPostsByUserId)
  loadPosts(ctx: StateContext<PostStateModel>, action: LoadPostsByUserId) {
    ctx.patchState({ loading: true });
    return this.apiService.getPostsByUserId(action.userId).pipe(
      tap((res) => {
        ctx.patchState({
          posts: res.posts,
          total: res.posts.length,
          loading: false,
        });
      })
    );
  }

  @Action(LoadPostsPaginated)
  loadPostsPaginated(
    ctx: StateContext<PostStateModel>,
    action: LoadPostsPaginated
  ) {
    ctx.patchState({ loading: true });
    return this.apiService.getAllPosts(action.payload).pipe(
      tap((res) => {
        ctx.patchState({
          posts: res.posts,
          total: res.total,
          loading: false,
        });
      })
    );
  }

  @Action(AddPost)
  addPost(ctx: StateContext<PostStateModel>, action: AddPost) {
    const state = ctx.getState();
    return this.apiService.addPost(action.post, action.userId).pipe(
      tap((newPost) => {
        const postWithReactions = {
          ...newPost,
          reactions: {
            likes: 0,
            dislikes: 0,
          },
        };
        ctx.patchState({
          posts: [...state.posts, postWithReactions],
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
        const posts = state.posts.map((post) =>
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
      tap(() => {
        ctx.patchState({
          posts: state.posts.filter((post) => post.id !== action.id),
          total: state.total - 1,
        });
      })
    );
  }

  @Action(ResetPostForm)
  resetPostForm(ctx: StateContext<PostStateModel>, action: ResetPostForm) {
    ctx.dispatch(
      new ResetForm({
        path: 'post.postForm',
        value: action.value || undefined,
      })
    );
  }

  @Action(SetPostFormForEdit)
  setPostFormForEdit(
    ctx: StateContext<PostStateModel>,
    action: SetPostFormForEdit
  ) {
    const formValue = {
      title: action.post.title,
      body: action.post.body,
      tags: action.post.tags.join(', '),
    };

    ctx.dispatch(
      new UpdateFormValue({
        path: 'post.postForm',
        value: formValue,
      })
    );
  }
}
