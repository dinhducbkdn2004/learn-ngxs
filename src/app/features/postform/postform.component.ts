import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngxs/store';
import { PostState } from '../../store/post/post.state';
import { AuthState } from '../../store/auth/auth.state';
import {
  AddPost,
  UpdatePost,
  DeletePost,
  LoadPostsPaginated,
  ResetPostForm,
  SetPostFormForEdit,
} from '../../store/post/post.actions';
import { AsyncPipe, CommonModule } from '@angular/common';
import { take } from 'rxjs';
import { PaginationService } from '../../core/services/pagination.service';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { NgxsFormDirective } from '@ngxs/form-plugin';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-postform',
  imports: [
    ReactiveFormsModule,
    NgxsFormDirective,
    AsyncPipe,
    CommonModule,
    PaginationComponent,
  ],
  templateUrl: './postform.component.html',
  styleUrl: './postform.component.css',
})
export class PostformComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  public readonly pagination = inject(PaginationService);

  posts$ = this.store.select(PostState.posts);
  currentUser$ = this.store.select(AuthState.user);
  total$ = this.store.select(PostState.total);

  postForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    body: ['', [Validators.required, Validators.minLength(10)]],
    tags: [''],
  });

  editingPost = signal<number | null>(null);
  isEditing = signal<boolean>(false);

  ngOnInit() {
    this.loadPosts();

    this.total$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((total) => {
      this.pagination.setTotal(total || 0);
    });
  }

  loadPosts() {
    this.store.dispatch(
      new LoadPostsPaginated({
        limit: this.pagination.pageSize(),
        skip: this.pagination.skip(),
        select: 'id,title,body,tags,reactions,views,userId',
      })
    );
  }

  onPageChange(page: number) {
    this.pagination.setPage(page);
    this.loadPosts();
  }

  onSubmit() {
    if (!this.postForm.valid) return;

    const { title, body, tags: tagsStr } = this.postForm.value;
    const tags = tagsStr
      ? tagsStr
          .split(',')
          .map((tag: string) => tag.trim())
          .filter(Boolean)
      : [];
    const postData = { title, body, tags };

    if (this.isEditing()) {
      const postId = this.editingPost();
      if (postId) {
        this.store.dispatch(new UpdatePost(postId, postData));
        this.cancelEdit();
      }
    } else {
      this.currentUser$.pipe(take(1)).subscribe((user) => {
        this.store.dispatch(new AddPost(postData, user?.id || 1));
      });
    }

    this.store.dispatch(new ResetPostForm());
  }

  deletePost(id: number) {
    this.store.dispatch(new DeletePost(id));
  }

  editPost(post: any) {
    this.editingPost.set(post.id);
    this.isEditing.set(true);
    this.store.dispatch(new SetPostFormForEdit(post));
  }

  cancelEdit() {
    this.editingPost.set(null);
    this.isEditing.set(false);
    this.store.dispatch(new ResetPostForm());
  }
}
