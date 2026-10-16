import { SignIn, SignUp } from "@clerk/react";
import { Logo } from "@/components/Logo";
import { Highlight } from "@/components/ui/highlight";
import { clerkAppearance } from "@/lib/clerk-appearance";

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,247,237,0.06),transparent)]"
      />
      <div className="flex flex-col items-center gap-2 text-center">
        <Logo className="size-12 [&_svg]:size-10" />
        <h1 className="text-2xl font-bold text-foreground">
          Say it on <Highlight>Y Social</Highlight>
        </h1>
      </div>
      {children}
    </div>
  );
}

export function SignInPage() {
  return (
    <Centered>
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        appearance={clerkAppearance}
      />
    </Centered>
  );
}

export function SignUpPage() {
  return (
    <Centered>
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        appearance={clerkAppearance}
      />
    </Centered>
  );
}
