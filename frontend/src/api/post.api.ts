import { get, post, patch } from "../lib/api-client";

export interface Post {
  _id: string;
  content: string;
  author: { _id: string; username: string };
  likeCount: number;
  replyCount: number;
  createdAt: number;
}

interface getPostsResponse {
  page: number;
  limit: number;
  posts: Post[];
}

export function getSinglePost(postId: string) {
  return get<{ post: Post }>(`/posts/${postId}`);
}

export function getReplies(postId: string) {
  return get<{ replies: Post[] }>(`/posts/${postId}/replies`);
}

export function createReply(postId: string, content: string) {
  return post<{ reply: Post }>(`/posts/${postId}/replies`, { content });
}

export function getAllPosts(page = 1) {
  return get<getPostsResponse>(`/posts?page=${page}`);
}

export function createPost(content: string) {
  return post<{ post: Post }>("/posts", { content });
}

export function toggleLike(postId: string) {
  return patch<{ liked: boolean }>(`/posts/${postId}/like`);
}
