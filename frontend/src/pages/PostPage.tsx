import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getSinglePost, getReplies, createReply } from "../api/post.api";
import type { Post } from "../api/post.api";
import { useAuth } from "../context/useAuth";

export function PostPage() {
  const { postId } = useParams<{ postId: string }>();
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    if (!postId) return;

    async function fetchData() {
      try {
        const [postData, repliesData] = await Promise.all([
          getSinglePost(postId!),
          getReplies(postId!),
        ]);
        setPost(postData.singlePost);
        setReplies(repliesData.replies);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load post");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [postId]);

  async function handleReplySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!postId || !replyContent.trim()) return;

    setIsReplying(true);
    try {
      const data = await createReply(postId, replyContent);
      setReplies([data.reply, ...replies]);
      setReplyContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post reply");
    } finally {
      setIsReplying(false);
    }
  }

  if (isLoading) return <div className="text-neutral-50">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!post) return <div className="text-neutral-400">Post not found.</div>;

  return (
    <div className="bg-neutral-950 max-w-2xl mx-auto p-4 space-y-4">
      <div className="border border-neutral-700 rounded-lg p-4">
        <div className="font-semibold text-neutral-50">
          {post.author.username}
        </div>
        <div className="text-neutral-300">{post.content}</div>
        <div className="text-neutral-500 text-sm mt-2">
          {post.likeCount} Likes • {post.replyCount} Replies
        </div>
      </div>

      {user && (
        <form
          onSubmit={handleReplySubmit}
          className="border border-neutral-700 rounded-lg p-4 space-y-2"
        >
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="bg-neutral-800 text-neutral-300 placeholder:text-neutral-500 border border-neutral-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isReplying}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            {isReplying ? "Posting..." : "Post Reply"}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {replies.map((reply) => (
          <div
            key={reply._id}
            className="border border-neutral-700 rounded-lg p-4"
          >
            <div className="font-semibold text-neutral-50">
              {reply.author.username}
            </div>
            <div className="text-neutral-300">{reply.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
