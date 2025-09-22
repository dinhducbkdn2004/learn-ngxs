import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxsFormDirective } from '@ngxs/form-plugin';
import { Store } from '@ngxs/store';
import { PostState } from '../../store/post/post.state';
import { AuthState } from '../../store/auth/auth.state';
import {
  LoadPosts,
  AddPost,
  UpdatePost,
  DeletePost,
  LikePost,
  DislikePost,
} from '../../store/post/post.actions';
import { AsyncPipe, CommonModule } from '@angular/common';
import { take } from 'rxjs';

@Component({
  selector: 'app-postform',
  imports: [ReactiveFormsModule, NgxsFormDirective, AsyncPipe, CommonModule],
  templateUrl: './postform.component.html',
  styleUrl: './postform.component.css',
})
export class PostformComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  posts$ = this.store.select(PostState.posts);
  currentUser$ = this.store.select(AuthState.user);

  postForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    body: ['', [Validators.required, Validators.minLength(10)]],
    tags: [''],
  });

  // State cho chế độ edit
  editingPost = signal<number | null>(null);
  isEditing = signal<boolean>(false);

  ngOnInit() {
    this.store.dispatch(new LoadPosts());
  }

  onSubmit() {
    if (this.postForm.valid) {
      const formValue = this.postForm.value;

      const tags = formValue.tags
        ? formValue.tags
            .split(',')
            .map((tag: string) => tag.trim())
            .filter((tag: string) => tag)
        : [];

      const postData = {
        title: formValue.title,
        body: formValue.body,
        tags: tags,
      };

      if (this.isEditing()) {
        // Update existing post
        const postId = this.editingPost();
        if (postId) {
          this.store.dispatch(new UpdatePost(postId, postData));
          this.cancelEdit();
        }
      } else {
        // Add new post
        this.currentUser$.pipe(take(1)).subscribe((user) => {
          const userId = user?.id || 1;
          this.store.dispatch(new AddPost(postData, userId));
        });
      }

      this.postForm.reset();
    }
  }

  likePost(id: number) {
    this.currentUser$.pipe(take(1)).subscribe((user) => {
      const userId = user?.id || 1;
      this.store.dispatch(new LikePost(id, userId));
    });
  }

  dislikePost(id: number) {
    this.currentUser$.pipe(take(1)).subscribe((user) => {
      const userId = user?.id || 1;
      this.store.dispatch(new DislikePost(id, userId));
    });
  }

  deletePost(id: number) {
    this.store.dispatch(new DeletePost(id));
  }

  editPost(post: any) {
    this.editingPost.set(post.id);
    this.isEditing.set(true);
    
    // Fill form với data của post hiện tại
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

  isLikedByCurrentUser(post: any): boolean {
    const currentUserId = this.getCurrentUserId();
    return post.likedByUsers?.includes(currentUserId) || false;
  }

  isDislikedByCurrentUser(post: any): boolean {
    const currentUserId = this.getCurrentUserId();
    return post.dislikedByUsers?.includes(currentUserId) || false;
  }

  private getCurrentUserId(): number {
    let userId = 1;
    this.currentUser$.pipe(take(1)).subscribe((user) => {
      userId = user?.id || 1;
    });
    return userId;
  }
}
