import { useState, useEffect } from "react";
import { getAllPosts } from "../api/post.api";
import type { Post } from "../api/post.api";

export function HomeFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getAllPosts();
        setPosts(data.posts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "failed to load posts");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (isLoading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (posts.length === 0) {
    return <div className="text-gray-400">No posts yet.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {posts.map((post) => (
        <div
          key={post._id}
          className="border border-gray-700 rounded-lg p-4 text-white"
        >
          <p className="font-bold">{post.author.username}</p>
          <p>{post.content}</p>
          <div className="flex gap-4 text-gray-400 text-sm mt-2">
            <span>{post.likeCount} likes</span>
            <span>{post.replyCount} replies</span>
          </div>
        </div>
      ))}
    </div>
  );
}
