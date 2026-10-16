import { AtSign } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-9 items-center justify-center text-foreground",
        className,
      )}
      aria-hidden="true"
    >
      <AtSign className="size-7" strokeWidth={2.5} />
    </span>
  );
}
