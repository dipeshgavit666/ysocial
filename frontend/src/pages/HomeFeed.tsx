import { useState, useEffect } from "react";
import { getAllPosts, createPost, toggleLike } from "../api/post.api";
import type { Post } from "../api/post.api";
import { useAuth } from "../context/useAuth";
import { Link } from "react-router";

export function HomeFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const { user } = useAuth();

  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());

  async function handleLike(postId: string) {
    const alreadyLiked = likedPostIds.has(postId);

    setLikedPostIds((prev) => {
      const next = new Set(prev);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      alreadyLiked ? next.delete(postId) : next.add(postId);
      return next;
    });

    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? { ...p, likeCount: p.likeCount + (alreadyLiked ? -1 : 1) }
          : p,
      ),
    );

    try {
      await toggleLike(postId);
    } catch {
      setLikedPostIds((prev) => {
        const next = new Set(prev);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        alreadyLiked ? next.add(postId) : next.delete(postId);
        return next;
      });
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, likeCount: p.likeCount + (alreadyLiked ? 1 : -1) }
            : p,
        ),
      );
    }
  }

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getAllPosts();
        setPosts(data.posts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load posts");
      } finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setIsPosting(true);
    try {
      const data = await createPost(content);
      setPosts([data.post, ...posts]);
      setContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setIsPosting(false);
    }
  }

  if (isLoading) return <div className="text-neutral-50">Loading...</div>;

  return (
    <div className="bg-neutral-950 text-neutral-50 min-h-screen space-y-4 p-5">
      <div className="bg-neutral-950 max-w-2xl mx-auto p-4 space-y-4 w-full rounded-lg border border-neutral-900">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {user && (
          <form
            onSubmit={handleSubmit}
            className="border border-neutral-700 rounded-lg p-4 space-y-2"
          >
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?"
              maxLength={3000}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-50 placeholder-neutral-500 p-3 resize-none"
              rows={3}
            />
            <button
              type="submit"
              disabled={isPosting || !content.trim()}
              className="rounded-lg bg-neutral-300 hover:bg-neutral-100 px-4 py-2 text-black disabled:opacity-50"
            >
              {isPosting ? "Posting..." : "Post"}
            </button>
          </form>
        )}

        {posts.length === 0 ? (
          <div className="text-neutral-400">No posts yet.</div>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="border border-neutral-700 rounded-lg p-4 text-neutral-50"
            >
              <Link
                to={`/post/${post._id}`}
                className="block border border-neutral-700 rounded-lg p-4 text-neutral-50 hover:border-neutral-500"
              >
                <p className="font-bold">{post.author.username}</p>
                <p>{post.content}</p>
                <div className="flex gap-4 text-sm mt-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLike(post._id);
                    }}
                    className={
                      likedPostIds.has(post._id)
                        ? "text-red-500"
                        : "text-neutral-400"
                    }
                  >
                    {likedPostIds.has(post._id) ? "♥" : "♡"} {post.likeCount}
                  </button>
                  <span className="text-neutral-400">
                    {post.replyCount} replies
                  </span>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
