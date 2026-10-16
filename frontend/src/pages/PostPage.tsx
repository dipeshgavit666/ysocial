import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Heart, MessageCircle } from "lucide-react";
import { useUser } from "@clerk/react";
import {
  getSinglePost,
  getComments,
  createComment,
  toggleLike,
} from "@/api/post.api";
import type { Post, Comment } from "@/api/post.api";
import { relativeTime } from "@/lib/time";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

function initials(name?: string) {
  return name ? name.slice(0, 2).toUpperCase() : "?";
}

function Reply({ reply }: { reply: Comment }) {
  const username = reply.user?.username ?? "deleted user";
  return (
    <div className="flex gap-3 rounded-xl border border-dashed border-card-edge p-4 transition-colors hover:border-card-edge-hover">
      <Avatar className="size-8 shrink-0 border border-dashed border-card-edge">
        <AvatarImage src={reply.user?.profileImage} alt={username} />
        <AvatarFallback>{initials(username)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Link
            to={`/profile/${username}`}
            className="truncate text-sm font-semibold text-foreground hover:underline"
          >
            {username}
          </Link>
          <span className="text-muted-foreground">·</span>
          <span className="text-sm text-muted-foreground">
            {relativeTime(reply.createdAt)}
          </span>
        </div>
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground">
          {reply.content}
        </p>
        <div className="mt-1.5 flex items-center gap-6 text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Heart className="size-4.5" aria-hidden="true" />
            <span className="text-xs tabular-nums">{reply.likeCount}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MessageCircle className="size-4.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </div>
  );
}

export function PostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [post, setPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!postId) return;

    async function fetchData() {
      try {
        const [postData, repliesData] = await Promise.all([
          getSinglePost(postId!),
          getComments(postId!),
        ]);
        setPost(postData.post);
        setReplies(repliesData.comments);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load post");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [postId]);

  async function handleLike() {
    if (!post) return;
    const nextLiked = !liked;
    setLiked(nextLiked);
    setPost({ ...post, likeCount: post.likeCount + (nextLiked ? 1 : -1) });
    try {
      await toggleLike(post._id);
    } catch {
      setLiked(!nextLiked);
      setPost({ ...post, likeCount: post.likeCount + (nextLiked ? -1 : 1) });
    }
  }

  async function handleReplySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!postId || !replyContent.trim()) return;

    setIsReplying(true);
    try {
      const data = await createComment(postId, replyContent);
      setReplies([data.comment, ...replies]);
      setReplyContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post reply");
    } finally {
      setIsReplying(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Back"
          onClick={() => navigate(-1)}
          className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </button>
        <span className="text-base font-semibold text-foreground">Thread</span>
        <span className="size-9" />
      </div>

      {error && <Alert tone="danger">{error}</Alert>}

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      ) : !post ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Post not found.
        </p>
      ) : (
        <>
          <div className="flex gap-3 rounded-xl border border-dashed border-card-edge p-4">
            <Avatar className="size-9 shrink-0 border border-dashed border-card-edge">
              <AvatarImage
                src={post.user?.profileImage}
                alt={post.user?.username}
              />
              <AvatarFallback>{initials(post.user?.username)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Link
                  to={`/profile/${post.user?.username}`}
                  className="truncate text-sm font-semibold text-foreground hover:underline"
                >
                  {post.user?.username ?? "deleted user"}
                </Link>
                <span className="text-muted-foreground">·</span>
                <span className="text-sm text-muted-foreground">
                  {relativeTime(post.createdAt)}
                </span>
              </div>
              <p className="mt-0.5 whitespace-pre-wrap text-[15px] leading-relaxed text-foreground">
                {post.content}
              </p>
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt=""
                  className="mt-3 max-h-96 w-full rounded-xl border border-dashed border-card-edge object-cover"
                />
              )}
              <div className="mt-3 flex items-center gap-6 text-muted-foreground">
                <button
                  type="button"
                  aria-label="Like"
                  onClick={handleLike}
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-1.5 transition-colors hover:text-foreground",
                    liked && "text-red-500 hover:text-red-500",
                  )}
                >
                  <Heart
                    className={cn("size-4.5", liked && "fill-current")}
                    aria-hidden="true"
                  />
                  <span className="text-xs tabular-nums">
                    {post.likeCount}
                  </span>
                </button>
                <span className="inline-flex items-center gap-1.5">
                  <MessageCircle className="size-4.5" aria-hidden="true" />
                  <span className="text-xs tabular-nums">
                    {post.commentCount}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {user && (
            <form
              onSubmit={handleReplySubmit}
              className="flex gap-3 rounded-xl border border-dashed border-card-edge p-4"
            >
              <div className="min-w-0 flex-1">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Say something..."
                  maxLength={3000}
                  rows={2}
                  className="w-full resize-none bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground outline-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isReplying || !replyContent.trim()}
                    className="rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isReplying ? "Posting..." : "Reply"}
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {replies.map((reply) => (
              <Reply key={reply._id} reply={reply} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
