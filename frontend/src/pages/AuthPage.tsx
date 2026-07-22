import { useState } from "react";
import { LoginForm } from "../components/LoginForm";
import { SignupForm } from "../components/SignupForm";

export function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <div className="bg-neutral-950 min-h-screen flex flex-col items-center justify-center">
      {mode === "login" ? <LoginForm /> : <SignupForm />}

      <button
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        className="text-gray-400 hover:text-white text-sm mt-4"
      >
        {mode === "login"
          ? "Need an account? Sign up"
          : "Already have an account? Log in"}
      </button>
    </div>
  );
}
