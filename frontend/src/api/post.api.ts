import { get, post } from "../lib/api-client";

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

export function getAllPosts(page = 1) {
  return get<getPostsResponse>(`/posts?page=${page}`);
}

export function createPost(content: string) {
  return post<{ post: Post }>("/posts", { content });
}
