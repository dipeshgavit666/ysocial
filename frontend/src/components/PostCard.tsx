import { Link } from "react-router";
import { Heart, MessageCircle, MoreHorizontal, Repeat2, Send } from "lucide-react";
import type { Post } from "@/api/post.api";
import { relativeTime } from "@/lib/time";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function initials(name?: string) {
  if (!name) return "?";
  return name.slice(0, 2).toUpperCase();
}

const actionClass =
  "inline-flex cursor-pointer items-center gap-1.5 rounded-full px-1 text-muted-foreground transition-colors hover:text-foreground";

function ActionButton({
  label,
  count,
  active,
  to,
  onClick,
  children,
}: {
  label: string;
  count?: number;
  active?: boolean;
  to?: string;
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}) {
  const content = (
    <>
      {children}
      {typeof count === "number" && (
        <span className="text-xs tabular-nums">{count}</span>
      )}
    </>
  );

  const className = cn(
    actionClass,
    active && "text-red-500 hover:text-red-500",
  );

  if (to) {
    return (
      <Link to={to} aria-label={label} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" aria-label={label} onClick={onClick} className={className}>
      {content}
    </button>
  );
}

export function PostCard({
  post,
  liked = false,
  onLike,
}: {
  post: Post;
  liked?: boolean;
  onLike?: (postId: string) => void;
}) {
  const username = post.user?.username ?? "deleted user";

  return (
    <article className="group flex gap-3 rounded-xl border border-dashed border-card-edge p-4 transition-colors hover:border-card-edge-hover">
      <Link to={`/profile/${username}`} className="shrink-0">
        <Avatar className="size-9 border border-dashed border-card-edge">
          <AvatarImage src={post.user?.profileImage} alt={username} />
          <AvatarFallback>{initials(username)}</AvatarFallback>
        </Avatar>
      </Link>

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
            {relativeTime(post.createdAt)}
          </span>
          <button
            type="button"
            aria-label="More options"
            className="ml-auto inline-flex size-7 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <MoreHorizontal className="size-4.5" aria-hidden="true" />
          </button>
        </div>

        <Link to={`/post/${post._id}`} className="mt-0.5 block">
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground">
            {post.content}
          </p>

          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt=""
              className="mt-3 max-h-96 w-full rounded-xl border border-dashed border-card-edge object-cover"
            />
          )}
        </Link>

        <div className="mt-3 flex items-center gap-6">
          <ActionButton
            label="Like"
            count={post.likeCount}
            active={liked}
            onClick={() => onLike?.(post._id)}
          >
            <Heart
              className={cn("size-4.5", liked && "fill-current")}
              aria-hidden="true"
            />
          </ActionButton>

          <ActionButton label="Reply" count={post.commentCount} to={`/post/${post._id}`}>
            <MessageCircle className="size-4.5" aria-hidden="true" />
          </ActionButton>

          <ActionButton label="Repost">
            <Repeat2 className="size-5" aria-hidden="true" />
          </ActionButton>

          <ActionButton label="Share">
            <Send className="size-4.5" aria-hidden="true" />
          </ActionButton>
        </div>
      </div>
    </article>
  );
}
