import { useState } from "react";
import { useUser } from "@clerk/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Composer({
  onSubmit,
  placeholder = "What's new?",
  autoFocus = false,
}: {
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  if (!user) return null;

  const name =
    user.username ??
    user.fullName ??
    user.primaryEmailAddress?.emailAddress ??
    "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || isPosting) return;

    setIsPosting(true);
    try {
      await onSubmit(content);
      setContent("");
    } finally {
      setIsPosting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-3 rounded-xl border border-dashed border-card-edge p-4"
    >
      <Avatar className="size-9 shrink-0 border border-dashed border-card-edge">
        <AvatarImage src={user.imageUrl} alt={name} />
        <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          maxLength={3000}
          rows={2}
          autoFocus={autoFocus}
          className="w-full resize-none bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground outline-none"
        />

        <div className="mt-2 flex items-center justify-end">
          <Button
            type="submit"
            variant="solid"
            size="sm"
            iconRight={null}
            disabled={isPosting || !content.trim()}
          >
            {isPosting ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>
    </form>
  );
}
