import logo from "@/assets/logo.svg";
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
      <img src={logo as string} alt="Y Social Logo" className="size-7" />
    </span>
  );
}
