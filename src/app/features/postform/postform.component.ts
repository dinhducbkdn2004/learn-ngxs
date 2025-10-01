import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { select, Store } from '@ngxs/store';
import { PostState } from '../../store/post/post.state';
import { AuthState } from '../../store/auth/auth.state';
import {
  AddPost,
  UpdatePost,
  DeletePost,
  GetPostsByUserId,
  ResetPostForm,
  SetPostFormForEdit,
  SearchPosts,
  SortPosts,
  GetAllPosts,
} from '../../store/post/post.actions';
import { CommonModule } from '@angular/common';
import { PaginationService } from '../../core/services/pagination.service';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { NgxsFormDirective } from '@ngxs/form-plugin';
import { Post } from '../../core/models/post.model';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-postform',
  imports: [
    ReactiveFormsModule,
    NgxsFormDirective,
    CommonModule,
    PaginationComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './postform.component.html',
  styleUrl: './postform.component.css',
})
export class PostformComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  public readonly pagination = inject(PaginationService);

  posts = select(PostState.posts);
  currentUser = select(AuthState.user);
  total = select(PostState.total);
  loading = select(PostState.loading);

  postForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    body: ['', [Validators.required, Validators.minLength(10)]],
    tags: [''],
  });

  searchControl = new FormControl('');
  sortControl = new FormControl<'title' | 'views'>('title');
  sortOrderControl = new FormControl<'asc' | 'desc'>('asc');

  editingPost = signal<number | null>(null);
  isEditing = signal<boolean>(false);
  selectedPost = signal<Post | null>(null);

  activeTab = signal<'all' | 'my'>('all');

  currentUserId = computed(() => this.currentUser()?.id ?? null);

  canEditPost = computed(() => {
    return (post: Post) => {
      const userId = this.currentUserId();
      return userId !== null && post.userId === userId;
    };
  });

  constructor() {
    effect(() => {
      const totalValue = this.total();
      this.pagination.setTotal(totalValue);
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((query) => {
        this.onSearchDebounced(query);
      });
  }

  ngOnInit() {
    this.loadPosts();
  }

  switchTab(tab: 'all' | 'my') {
    this.activeTab.set(tab);
    this.pagination.setPage(1);
    this.searchControl.setValue('', { emitEvent: false });
    this.loadPosts();
  }

  loadPosts() {
    const params = {
      limit: this.pagination.pageSize(),
      skip: this.pagination.skip(),
      select: 'id,title,body,tags,views,userId',
    };

    if (this.activeTab() === 'my') {
      const userId = this.currentUserId();
      if (!userId) return;
      this.store.dispatch(new GetPostsByUserId(userId, params));
    } else {
      this.store.dispatch(new GetAllPosts(params));
    }
  }

  onPageChange(page: number) {
    this.pagination.setPage(page);
    this.loadPosts();
  }

  onSearchDebounced(query: string | null) {
    // Reset pagination to page 1 when searching
    this.pagination.setPage(1);

    const trimmedQuery = query?.trim();
    if (!trimmedQuery) {
      this.loadPosts();
      return;
    }

    const params = {
      limit: this.pagination.pageSize(),
      skip: this.pagination.skip(),
      select: 'id,title,body,tags,views,userId',
    };

    this.store.dispatch(new SearchPosts(trimmedQuery, params));
  }

  clearSearch() {
    this.pagination.setPage(1);
    this.searchControl.setValue('', { emitEvent: false });
    this.loadPosts();
  }

  onSort() {
    const sortBy = this.sortControl.value;
    const order = this.sortOrderControl.value;
    if (!sortBy || !order) return;

    // Reset pagination to page 1 when sorting
    this.pagination.setPage(1);

    const params = {
      limit: this.pagination.pageSize(),
      skip: this.pagination.skip(),
      select: 'id,title,body,tags,views,userId',
    };

    this.store.dispatch(new SortPosts(sortBy, order, params));
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
      const userId = this.currentUserId();
      if (userId) {
        this.store.dispatch(new AddPost(postData, userId));
      }
    }

    this.store.dispatch(new ResetPostForm());
  }

  deletePost(id: number) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.store.dispatch(new DeletePost(id));
    }
  }

  editPost(post: Post) {
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
