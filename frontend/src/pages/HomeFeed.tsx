import { useState, useEffect } from "react";
import { getAllPosts, createPost, toggleLike } from "@/api/post.api";
import type { Post } from "@/api/post.api";
import { Composer } from "@/components/Composer";
import { PostCard } from "@/components/PostCard";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

function FeedSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex gap-3 rounded-xl border border-dashed border-card-edge p-4">
          <Skeleton className="size-9 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function HomeFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());

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

  async function handleCreate(content: string) {
    try {
      const data = await createPost(content);
      setPosts((prev) => [data.post, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    }
  }

  async function handleLike(postId: string) {
    const alreadyLiked = likedPostIds.has(postId);

    setLikedPostIds((prev) => {
      const next = new Set(prev);
      if (alreadyLiked) next.delete(postId);
      else next.add(postId);
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
        if (alreadyLiked) next.add(postId);
        else next.delete(postId);
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

  return (
    <div className="space-y-4">
      <h1 className="text-center text-base font-semibold text-foreground">
        For you
      </h1>

      <Composer onSubmit={handleCreate} />

      {error && <Alert tone="danger">{error}</Alert>}

      {isLoading ? (
        <FeedSkeleton />
      ) : posts.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No posts yet. Be the first to share something.
        </p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              liked={likedPostIds.has(post._id)}
              onLike={handleLike}
            />
          ))}
        </div>
      )}

      {!isLoading && posts.length > 0 && (
        <>
          <p className="py-3 text-center text-xs text-muted-foreground">
            Posts fade away, so make them count.
          </p>
          <Separator />
        </>
      )}
    </div>
  );
}
