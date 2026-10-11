import { get, post, patch } from "../lib/api-client";

export interface PostAuthor {
  _id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
}

export interface Post {
  _id: string;
  content: string;
  imageUrl?: string;
  user: PostAuthor;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  expiredAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  user: PostAuthor;
  likeCount: number;
  replyCount: number;
  parentComment: string | null;
  createdAt: string;
}

interface GetPostsResponse {
  posts: Post[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export function getAllPosts(page = 1) {
  return get<GetPostsResponse>(`/posts?page=${page}`);
}

export function getSinglePost(postId: string) {
  return get<{ post: Post }>(`/posts/${postId}`);
}

export function createPost(content: string) {
  return post<{ post: Post }>("/posts", { content });
}

export function toggleLike(postId: string) {
  return patch<{ liked: boolean; likeCount: number }>(`/posts/${postId}/like`);
}

export function getComments(postId: string) {
  return get<{ comments: Comment[] }>(`/comments/post/${postId}`);
}

export function createComment(postId: string, content: string) {
  return post<{ comment: Comment }>(`/comments/post/${postId}`, { content });
}
