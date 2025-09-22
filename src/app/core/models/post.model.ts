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
  likedByUsers?: number[];
  dislikedByUsers?: number[];
  isDeleted?: boolean;
  deletedOn?: string;
}
