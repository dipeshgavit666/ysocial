import { ClerkProvider } from "@clerk/react";
import { useNavigate } from "react-router";
import { clerkAppearance } from "@/lib/clerk-appearance";

// const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const publishableKey =
  "pk_test_dG91Y2hlZC1zaGVwaGVyZC05MDc5LmNsZXJrLmFjY291bnRzLmRldiQ";
if (!publishableKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in frontend/.env");
}

export function ClerkWithRouter({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
      appearance={clerkAppearance}
    >
      {children}
    </ClerkProvider>
  );
}
