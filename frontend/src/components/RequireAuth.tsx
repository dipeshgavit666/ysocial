import { Show, SignInButton } from "@clerk/react";
import type { ReactNode } from "react";
export function RequireAuth({ children }: { children: ReactNode }) {
  return (
    <>
      <Show when="signed-in">{children}</Show>
      <Show when="signed-out">
        <p>Sign in to see this page.</p>
        <SignInButton />
      </Show>
    </>
  );
}
