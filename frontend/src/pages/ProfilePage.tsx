import { useParams } from "react-router";
import { useUser } from "@clerk/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Highlight } from "@/components/ui/highlight";

function initials(name?: string) {
  return name ? name.slice(0, 2).toUpperCase() : "?";
}

export function ProfilePage() {
  const { username } = useParams();
  const { user } = useUser();

  const isOwnProfile = !username;
  const name =
    username ??
    user?.username ??
    user?.fullName ??
    user?.primaryEmailAddress?.emailAddress ??
    "Guest";
  const imageUrl = isOwnProfile ? user?.imageUrl : undefined;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold text-foreground">
            {name}
          </h1>
          {isOwnProfile && (
            <p className="truncate text-sm text-muted-foreground">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            <Highlight>{name}</Highlight> on Y Social — posts that{" "}
            <span className="text-foreground">fade with time</span>.
          </p>
        </div>

        <Avatar className="size-20 shrink-0 border border-dashed border-card-edge">
          <AvatarImage src={imageUrl} alt={name} />
          <AvatarFallback>{initials(name)}</AvatarFallback>
        </Avatar>
      </div>

      {isOwnProfile && user && (
        <Button variant="soft" size="sm" iconRight={null}>
          Edit profile
        </Button>
      )}

      <div className="rounded-xl border border-dashed border-card-edge p-6 text-center text-sm text-muted-foreground">
        This profile's threads will appear here.
      </div>
    </div>
  );
}
