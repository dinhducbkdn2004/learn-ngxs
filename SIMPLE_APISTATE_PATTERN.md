# 🎯 Simple ApiState<T> Pattern - Quản lý State Gọn Gàng

Pattern đơn giản để quản lý state khi gọi API với **NGXS** và **Angular Signals**.

## 📦 Tổng quan

Thay vì dùng nhiều state phức tạp, chúng ta dùng **ApiState<T>** generic cho TẤT CẢ API calls.

```typescript
interface ApiState<T> {
  data: T | null; // Dữ liệu từ API
  loading: boolean; // Đang gọi API?
  error?: string; // Thông báo lỗi (nếu có)
}
```

## 🛠️ Helper Functions

### 1. `initialState<T>()` - State ban đầu

```typescript
const state = initialState<User>();
// { data: null, loading: false, error: undefined }
```

### 2. `setLoading<T>()` - Bắt đầu gọi API

```typescript
const state = setLoading<User>();
// { data: null, loading: true, error: undefined }
```

### 3. `setSuccess<T>(data)` - API thành công

```typescript
const user = { id: 1, name: "John" };
const state = setSuccess(user);
// { data: user, loading: false, error: undefined }
```

### 4. `setError<T>(message)` - API thất bại

```typescript
const state = setError<User>("Network error");
// { data: null, loading: false, error: 'Network error' }
```

## 🚀 Ví dụ đầy đủ

### 1. Định nghĩa Models

```typescript
// post.model.ts
import { ApiState } from "./base-state.model";

export interface Post {
  id: number;
  title: string;
  body: string;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
}

export interface PostStateModel {
  posts: ApiState<PostsResponse>; // List posts
  selectedPost: ApiState<Post>; // Chi tiết 1 post
}
```

### 2. NGXS State với Pattern

```typescript
// post.state.ts
import { initialState, setLoading, setSuccess, setError } from "../../core/models/base-state.model";

@State<PostStateModel>({
  name: "post",
  defaults: {
    posts: initialState<PostsResponse>(),
    selectedPost: initialState<Post>(),
  },
})
@Injectable()
export class PostState {
  private readonly apiService = inject(ApiService);
  private readonly toastService = inject(ToastService);

  // ============================================
  // SELECTORS
  // ============================================

  @Selector()
  static posts(state: PostStateModel): Post[] {
    return state.posts.data?.posts ?? [];
  }

  @Selector()
  static postsLoading(state: PostStateModel): boolean {
    return state.posts.loading;
  }

  @Selector()
  static postsError(state: PostStateModel): string | undefined {
    return state.posts.error;
  }

  // ============================================
  // ACTIONS
  // ============================================

  @Action(LoadPosts)
  loadPosts(ctx: StateContext<PostStateModel>) {
    // 1️⃣ Set loading
    ctx.patchState({
      posts: setLoading<PostsResponse>(),
    });

    // 2️⃣ Call API
    return this.apiService.getAllPosts().pipe(
      tap((response) => {
        // 3️⃣ Success: Update state
        ctx.patchState({
          posts: setSuccess(response),
        });

        // 4️⃣ Show toast
        this.toastService.success("Success", "Posts loaded");
      }),
      catchError((error) => {
        // 5️⃣ Error: Update state
        const errorMessage = error?.message || "Failed to load posts";
        ctx.patchState({
          posts: setError<PostsResponse>(errorMessage),
        });

        // 6️⃣ Show error toast
        this.toastService.error("Error", errorMessage);

        return throwError(() => error);
      })
    );
  }
}
```

### 3. Sử dụng trong Component với Signals

```typescript
// post-list.component.ts
import { Component, OnInit, inject } from "@angular/core";
import { Store, select } from "@ngxs/store";
import { PostState, LoadPosts } from "./store/post";

@Component({
  selector: "app-post-list",
  standalone: true,
  template: `
    <div class="container">
      <h2>Posts</h2>

      <!-- Loading State -->
      @if (loading()) {
      <div class="spinner">Loading...</div>
      }

      <!-- Error State -->
      @if (error()) {
      <div class="error">❌ {{ error() }}</div>
      }

      <!-- Success State với Data -->
      @if (posts().length > 0) {
      <ul>
        @for (post of posts(); track post.id) {
        <li>{{ post.title }}</li>
        }
      </ul>
      }

      <!-- Empty State -->
      @if (!loading() && !error() && posts().length === 0) {
      <div class="empty">No posts found</div>
      }
    </div>
  `,
})
export class PostListComponent implements OnInit {
  private store = inject(Store);

  // ✨ Signals from selectors
  posts = select(PostState.posts);
  loading = select(PostState.postsLoading);
  error = select(PostState.postsError);

  ngOnInit() {
    this.store.dispatch(new LoadPosts());
  }
}
```

## 🎨 So sánh: Trước vs Sau

### ❌ Trước đây (Phức tạp)

```typescript
export class StateHelper {
  static loading<T>(): ApiState<T> {
    return { data: null, loading: true, error: null };
  }
  static loaded<T>(data: T): ApiState<T> {
    return { data, loading: false, error: null };
  }
  static error<T>(error: string): ApiState<T> {
    return { data: null, loading: false, error };
  }
  // ... more methods
}

// Usage
ctx.patchState({
  posts: StateHelper.loading(),
});
ctx.patchState({
  posts: StateHelper.loaded(data),
});
```

### ✅ Bây giờ (Đơn giản)

```typescript
// Pure functions
export function setLoading<T>(): ApiState<T> {
  return { data: null, loading: true, error: undefined };
}

export function setSuccess<T>(data: T): ApiState<T> {
  return { data, loading: false, error: undefined };
}

export function setError<T>(error: string): ApiState<T> {
  return { data: null, loading: false, error };
}

// Usage
ctx.patchState({
  posts: setLoading<PostsResponse>(),
});
ctx.patchState({
  posts: setSuccess(data),
});
```

## 📝 Workflow chuẩn cho mọi API call

```typescript
@Action(SomeAction)
someAction(ctx: StateContext<StateModel>, action: SomeAction) {
  // STEP 1: Set loading
  ctx.patchState({
    data: setLoading<YourDataType>(),
  });

  // STEP 2: Call API
  return this.apiService.someMethod().pipe(
    tap((response) => {
      // STEP 3: Success - set data
      ctx.patchState({
        data: setSuccess(response),
      });

      // STEP 4: Optional toast
      this.toastService.success('Success', 'Operation completed');
    }),
    catchError((error) => {
      // STEP 5: Error - set error message
      const errorMessage = error?.message || 'Operation failed';
      ctx.patchState({
        data: setError<YourDataType>(errorMessage),
      });

      // STEP 6: Error toast
      this.toastService.error('Error', errorMessage);

      return throwError(() => error);
    })
  );
}
```

## 💡 Best Practices

### ✅ DO

```typescript
// ✅ Type-safe với generic
posts: ApiState<PostsResponse>
selectedPost: ApiState<Post>

// ✅ Dùng setLoading với type
setLoading<PostsResponse>()
setError<Post>('Error message')

// ✅ Check error trong template
@if (error()) {
  <div>{{ error() }}</div>
}

// ✅ Selectors đơn giản
@Selector()
static posts(state: PostStateModel): Post[] {
  return state.posts.data?.posts ?? [];
}
```

### ❌ DON'T

```typescript
// ❌ Không dùng any
posts: ApiState<any>

// ❌ Không quên xử lý error
catchError((error) => {
  // Missing: ctx.patchState với setError()
  return throwError(() => error);
})

// ❌ Không hardcode initial state
defaults: {
  posts: { data: null, loading: false, error: null } // Use initialState()
}
```

## 🔧 Advanced: Keep Data khi Loading

Khi refresh data nhưng muốn giữ UI (không blink):

```typescript
import { setLoadingKeepData } from '../../core/models/base-state.model';

@Action(RefreshPosts)
refreshPosts(ctx: StateContext<PostStateModel>) {
  const currentData = ctx.getState().posts.data;

  // Giữ data cũ trong lúc loading
  ctx.patchState({
    posts: setLoadingKeepData(currentData),
  });

  return this.apiService.getAllPosts().pipe(
    tap((response) => {
      ctx.patchState({
        posts: setSuccess(response),
      });
    })
  );
}
```

## 🎯 Utility Functions

Thêm các helpers để check state:

```typescript
import { isLoading, hasError, hasData, isLoaded } from "../../core/models/base-state.model";

// Check states
if (isLoading(state.posts)) {
  // Show spinner
}

if (hasError(state.posts)) {
  // Show error message
}

if (isLoaded(state.posts)) {
  // Data ready to display
}
```

## 📊 Type Safety với Type Guards

```typescript
import { stateHasData } from "../../core/models/base-state.model";

const state = ctx.getState().posts;

if (stateHasData(state)) {
  // TypeScript knows state.data is NOT null
  console.log(state.data.posts); // ✅ No error
}
```

## 🚀 Migration Guide

### Từ StateHelper sang Functions mới

1. **Thay thế imports:**

```typescript
// Old
import { StateHelper } from "../../core/models/base-state.model";

// New
import { initialState, setLoading, setSuccess, setError } from "../../core/models/base-state.model";
```

2. **Thay thế trong defaults:**

```typescript
// Old
defaults: {
  posts: StateHelper.initial(),
}

// New
defaults: {
  posts: initialState<PostsResponse>(),
}
```

3. **Thay thế trong actions:**

```typescript
// Old
ctx.patchState({ posts: StateHelper.loading() });
ctx.patchState({ posts: StateHelper.loaded(data) });
ctx.patchState({ posts: StateHelper.error(message) });

// New
ctx.patchState({ posts: setLoading<PostsResponse>() });
ctx.patchState({ posts: setSuccess(data) });
ctx.patchState({ posts: setError<PostsResponse>(message) });
```

## ✨ Tóm tắt

| Feature              | Description                                                         |
| -------------------- | ------------------------------------------------------------------- |
| **ApiState<T>**      | Generic interface cho mọi API state                                 |
| **initialState()**   | State ban đầu: `{ data: null, loading: false, error: undefined }`   |
| **setLoading()**     | Bắt đầu API call: `{ data: null, loading: true, error: undefined }` |
| **setSuccess(data)** | Thành công: `{ data, loading: false, error: undefined }`            |
| **setError(msg)**    | Thất bại: `{ data: null, loading: false, error: msg }`              |

## 🔗 Files liên quan

- `src/app/core/models/base-state.model.ts` - Core definitions
- `src/app/store/auth/auth.state.ts` - Auth example
- `src/app/store/post/post.state.ts` - Post example

---

**Pattern này giúp code:**

- ✅ Đơn giản hơn
- ✅ Type-safe hơn
- ✅ Dễ đọc hơn
- ✅ Dễ maintain hơn
- ✅ Tái sử dụng cao
