import { inject, Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { Post } from '../../core/models/post.model';
import { tap } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import {
  AddPost,
  UpdatePost,
  DeletePost,
  GetPostsByUserId,
  GetAllPosts,
  ResetPostForm,
  SetPostFormForEdit,
  GetPostById,
  GetPostComments,
  SearchPosts,
  SortPosts,
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

  @Selector()
  static loading(state: PostStateModel) {
    return state.loading;
  }

  @Action(GetPostsByUserId)
  getPostsByUserId(
    ctx: StateContext<PostStateModel>,
    action: GetPostsByUserId
  ) {
    ctx.patchState({ loading: true });
    return this.apiService.GetPostsByUserId(action.userId, action.payload).pipe(
      tap((res) => {
        ctx.patchState({
          posts: res.posts,
          total: res.total,
          loading: false,
        });
      })
    );
  }

  @Action(GetPostById)
  getPostById(ctx: StateContext<PostStateModel>, action: GetPostById) {
    ctx.patchState({ loading: true });
    return this.apiService.getPostById(action.id).pipe(
      tap((res) => {
        ctx.patchState({
          posts: [res],
          total: 1,
          loading: false,
        });
      })
    );
  }

  @Action(GetPostComments)
  getPostComments(ctx: StateContext<PostStateModel>, action: GetPostComments) {
    ctx.patchState({ loading: true });
    return this.apiService.getPostComments(action.postId).pipe(
      tap((res) => {
        ctx.patchState({
          posts: ctx
            .getState()
            .posts.map((post) =>
              post.id === action.postId ? { ...post, comments: res } : post
            ),
          loading: false,
        });
      })
    );
  }

  @Action(GetAllPosts)
  getAllPosts(ctx: StateContext<PostStateModel>, action: GetAllPosts) {
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

  @Action(SearchPosts)
  searchPosts(ctx: StateContext<PostStateModel>, action: SearchPosts) {
    ctx.patchState({ loading: true });
    return this.apiService.searchPosts(action.query, action.payload).pipe(
      tap((res) => {
        ctx.patchState({
          posts: res.posts,
          total: res.total,
          loading: false,
        });
      })
    );
  }

  @Action(SortPosts)
  sortPosts(ctx: StateContext<PostStateModel>, action: SortPosts) {
    ctx.patchState({ loading: true });
    return this.apiService
      .sortPosts(action.sortBy, action.order, action.payload)
      .pipe(
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
          views: 0,
          reactions: {
            likes: 0,
            dislikes: 0,
          },
        };
        ctx.patchState({
          posts: [postWithReactions, ...state.posts],
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
