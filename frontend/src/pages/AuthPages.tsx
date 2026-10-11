import { SignIn, SignUp } from "@clerk/react";

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      {children}
    </div>
  );
}

export function SignInPage() {
  return (
    <Centered>
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </Centered>
  );
}

export function SignUpPage() {
  return (
    <Centered>
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
    </Centered>
  );
}
