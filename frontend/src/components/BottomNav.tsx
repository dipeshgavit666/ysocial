import { NavLink } from "react-router";
import { Home, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/profile", label: "Profile", icon: UserRound, end: false },
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-dashed border-card-edge bg-background/80 backdrop-blur-lg md:hidden">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          aria-label={label}
          className={({ isActive }) =>
            cn(
              "flex flex-1 flex-col items-center gap-1 py-3 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground",
              isActive && "text-foreground",
            )
          }
        >
          <Icon className="size-6" aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
