import { Component, inject, OnInit, signal } from '@angular/core';
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
} from '../../store/post/post.actions';
import { AsyncPipe, CommonModule } from '@angular/common';
import { take } from 'rxjs';

@Component({
  selector: 'app-postform',
  imports: [ReactiveFormsModule, AsyncPipe, CommonModule],
  templateUrl: './postform.component.html',
  styleUrl: './postform.component.css',
})
export class PostformComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  posts$ = this.store.select(PostState.posts);
  currentUser$ = this.store.select(AuthState.user);
  total$ = this.store.select(PostState.total);

  currentPage = signal<number>(1);
  pageSize = signal<number>(5);
  totalPages = signal<number>(0);

  postForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    body: ['', [Validators.required, Validators.minLength(10)]],
    tags: [''],
  });

  editingPost = signal<number | null>(null);
  isEditing = signal<boolean>(false);

  ngOnInit() {
    this.loadPosts();
    this.total$.subscribe((total) =>
      this.totalPages.set(Math.ceil(total / this.pageSize()))
    );
  }

  loadPosts() {
    const skip = (this.currentPage() - 1) * this.pageSize();
    this.store.dispatch(
      new LoadPostsPaginated({
        limit: this.pageSize(),
        skip,
        select: 'id,title,body,tags,reactions,views,userId',
      })
    );
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
    this.postForm.reset();
  }

  deletePost(id: number) {
    this.store.dispatch(new DeletePost(id));
  }

  editPost(post: any) {
    this.editingPost.set(post.id);
    this.isEditing.set(true);
    this.postForm.patchValue({
      title: post.title,
      body: post.body,
      tags: post.tags.join(', '),
    });
  }

  cancelEdit() {
    this.editingPost.set(null);
    this.isEditing.set(false);
    this.postForm.reset();
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
      this.loadPosts();
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
      this.loadPosts();
    }
  }
}
