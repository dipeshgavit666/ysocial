import { NavLink, Link } from "react-router";
import { Home, UserRound } from "lucide-react";
import { Show, SignInButton, UserButton } from "@clerk/react";
import { Logo } from "@/components/Logo";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/profile", label: "Profile", icon: UserRound, end: false },
];

function RailLink({
  to,
  label,
  icon: Icon,
  end,
}: {
  to: string;
  label: string;
  icon: typeof Home;
  end: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      aria-label={label}
      className={({ isActive }) =>
        cn(
          "inline-flex size-12 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
          isActive && "text-foreground",
        )
      }
    >
      <Icon className="size-6" aria-hidden="true" />
    </NavLink>
  );
}

export function Navbar() {
  return (
    <>
      {/* Desktop rail */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[76px] flex-col items-center gap-2 border-r border-card-edge bg-background/80 py-5 backdrop-blur-lg md:flex">
        <Link to="/" aria-label="Y Social home" className="mb-2">
          <Logo />
        </Link>

        {items.map((item) => (
          <RailLink key={item.to} {...item} />
        ))}

        <div className="mt-auto flex flex-col items-center gap-2">
          <ThemeSwitcher />
          <Show when="signed-in">
            <UserButton />
          </Show>
          <Show when="signed-out">
            <SignInButton mode="redirect">
              <button className="text-xs font-medium text-muted-foreground hover:text-foreground">
                Log in
              </button>
            </SignInButton>
          </Show>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-dashed border-card-edge bg-background/80 px-4 py-2 backdrop-blur-lg md:hidden">
        <Link to="/" aria-label="Home">
          <Logo />
        </Link>
        <div className="flex items-center gap-1">
          <ThemeSwitcher />
          <Show when="signed-in">
            <UserButton />
          </Show>
          <Show when="signed-out">
            <SignInButton mode="redirect">
              <button className="rounded-md px-2 py-1 text-sm font-medium text-muted-foreground hover:text-foreground">
                Log in
              </button>
            </SignInButton>
          </Show>
        </div>
      </header>
    </>
  );
}
