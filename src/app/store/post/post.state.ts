import { inject, Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import {
  Post,
  PostStateModel,
  PostsResponse,
} from '../../core/models/post.model';
import { tap, catchError, throwError } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { ToastrService } from 'ngx-toastr';
import {
  initialState,
  setLoading,
  setSuccess,
  setError,
  setLoadingKeepData,
} from '../../core/models/base-state.model';
import {
  AddPost,
  UpdatePost,
  DeletePost,
  GetPostsByUserId,
  GetAllPosts,
  ResetPostForm,
  SetPostFormForEdit,
  GetPostComments,
  SearchPosts,
  SortPosts,
} from './post.actions';
import { UpdateFormValue, ResetForm } from '@ngxs/form-plugin';

@State<PostStateModel>({
  name: 'post',
  defaults: {
    posts: initialState<PostsResponse>(),
    postForm: {
      model: undefined,
    },
  },
})
@Injectable()
export class PostState {
  private readonly apiService = inject(ApiService);
  private readonly toastr = inject(ToastrService);

  @Selector()
  static posts(state: PostStateModel): Post[] {
    return state.posts.data?.posts ?? [];
  }

  @Selector()
  static total(state: PostStateModel): number {
    return state.posts.data?.total ?? 0;
  }

  @Selector()
  static postsLoading(state: PostStateModel): boolean {
    return state.posts.loading;
  }

  @Selector()
  static postsError(state: PostStateModel): string | undefined {
    return state.posts.error;
  }

  @Selector()
  static postCountByUser(state: PostStateModel) {
    return (userId: number) => {
      const posts = state.posts.data?.posts ?? [];
      return posts.filter((p) => p.userId === userId).length;
    };
  }

  @Action(GetPostsByUserId)
  getPostsByUserId(
    ctx: StateContext<PostStateModel>,
    action: GetPostsByUserId
  ) {
    ctx.patchState({
      posts: setLoading<PostsResponse>(),
    });

    return this.apiService.GetPostsByUserId(action.userId, action.payload).pipe(
      tap((res) => {
        ctx.patchState({
          posts: setSuccess(res),
        });
      }),
      catchError((error) => {
        const errorMessage =
          error?.error?.message || error?.message || 'Failed to load posts';
        ctx.patchState({
          posts: setError<PostsResponse>(errorMessage),
        });
        this.toastr.error('Failed to load posts', errorMessage);
        return throwError(() => error);
      })
    );
  }

  @Action(GetPostComments)
  getPostComments(ctx: StateContext<PostStateModel>, action: GetPostComments) {
    const currentData = ctx.getState().posts.data;
    ctx.patchState({
      posts: setLoadingKeepData(currentData),
    });

    return this.apiService.getPostComments(action.postId).pipe(
      tap((res) => {
        const state = ctx.getState();
        if (state.posts.data) {
          const updatedPosts = state.posts.data.posts.map((post) =>
            post.id === action.postId ? { ...post, comments: res } : post
          );
          ctx.patchState({
            posts: setSuccess({
              posts: updatedPosts,
              total: state.posts.data.total,
            }),
          });
        }
      }),
      catchError((error) => {
        if (currentData) {
          ctx.patchState({
            posts: setSuccess(currentData),
          });
        }
        return throwError(() => error);
      })
    );
  }

  @Action(GetAllPosts)
  getAllPosts(ctx: StateContext<PostStateModel>, action: GetAllPosts) {
    ctx.patchState({
      posts: setLoading<PostsResponse>(),
    });

    return this.apiService.getAllPosts(action.payload).pipe(
      tap((res) => {
        ctx.patchState({
          posts: setSuccess(res),
        });
      }),
      catchError((error) => {
        const errorMessage =
          error?.error?.message || error?.message || 'Failed to load posts';
        ctx.patchState({
          posts: setError<PostsResponse>(errorMessage),
        });
        this.toastr.error('Failed to load posts', errorMessage);
        return throwError(() => error);
      })
    );
  }

  @Action(SearchPosts)
  searchPosts(ctx: StateContext<PostStateModel>, action: SearchPosts) {
    ctx.patchState({
      posts: setLoading<PostsResponse>(),
    });

    return this.apiService.searchPosts(action.query, action.payload).pipe(
      tap((res) => {
        ctx.patchState({
          posts: setSuccess(res),
        });
      }),
      catchError((error) => {
        const errorMessage =
          error?.error?.message || error?.message || 'Failed to search posts';
        ctx.patchState({
          posts: setError<PostsResponse>(errorMessage),
        });
        this.toastr.error('Failed to search posts', errorMessage);
        return throwError(() => error);
      })
    );
  }

  @Action(SortPosts)
  sortPosts(ctx: StateContext<PostStateModel>, action: SortPosts) {
    ctx.patchState({
      posts: setLoading<PostsResponse>(),
    });

    return this.apiService
      .sortPosts(action.sortBy, action.order, action.payload)
      .pipe(
        tap((res) => {
          ctx.patchState({
            posts: setSuccess(res),
          });
        }),
        catchError((error) => {
          const errorMessage =
            error?.error?.message || error?.message || 'Failed to sort posts';
          ctx.patchState({
            posts: setError<PostsResponse>(errorMessage),
          });
          this.toastr.error('Failed to sort posts', errorMessage);
          return throwError(() => error);
        })
      );
  }

  @Action(AddPost)
  addPost(ctx: StateContext<PostStateModel>, action: AddPost) {
    const state = ctx.getState();
    const currentData = state.posts.data;

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

        if (currentData) {
          ctx.patchState({
            posts: setSuccess({
              posts: [postWithReactions, ...currentData.posts],
              total: currentData.total + 1,
            }),
          });
        }

        this.toastr.success(
          'Create Successful',
          `Post "${newPost.title}" has been created`
        );
      }),
      catchError((error) => {
        const errorMessage =
          error?.error?.message || error?.message || 'Failed to create post';
        this.toastr.error('Failed to create post', errorMessage);
        return throwError(() => error);
      })
    );
  }

  @Action(UpdatePost)
  updatePost(ctx: StateContext<PostStateModel>, action: UpdatePost) {
    const state = ctx.getState();
    const currentData = state.posts.data;

    return this.apiService.updatePost(action.id, action.post).pipe(
      tap((updatedPost) => {
        if (currentData) {
          const posts = currentData.posts.map((post) =>
            post.id === action.id ? { ...post, ...updatedPost } : post
          );
          ctx.patchState({
            posts: setSuccess({
              posts,
              total: currentData.total,
            }),
          });
        }

        this.toastr.success(
          'Update Successful',
          `Post "${updatedPost.title}" has been updated`
        );
      }),
      catchError((error) => {
        const errorMessage =
          error?.error?.message || error?.message || 'Failed to update post';
        this.toastr.error('Failed to update post', errorMessage);
        return throwError(() => error);
      })
    );
  }

  @Action(DeletePost)
  deletePost(ctx: StateContext<PostStateModel>, action: DeletePost) {
    const state = ctx.getState();
    const currentData = state.posts.data;

    return this.apiService.deletePost(action.id).pipe(
      tap(() => {
        if (currentData) {
          const deletedPost = currentData.posts.find((p) => p.id === action.id);
          ctx.patchState({
            posts: setSuccess({
              posts: currentData.posts.filter((post) => post.id !== action.id),
              total: currentData.total - 1,
            }),
          });

          this.toastr.success(
            'Delete Successful',
            deletedPost
              ? `Post "${deletedPost.title}" has been deleted`
              : 'Post has been deleted'
          );
        }
      }),
      catchError((error) => {
        const errorMessage =
          error?.error?.message || error?.message || 'Failed to delete post';
        this.toastr.error('Failed to delete post', errorMessage);
        return throwError(() => error);
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
