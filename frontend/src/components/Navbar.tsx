import { Link } from "react-router";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";

export function Navbar() {
  return (
    <nav className="bg-neutral-900 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-white">
          Y Social
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:text-white"
          >
            Home
          </Link>

          <Show when="signed-in">
            <Link
              to="/profile"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:text-white"
            >
              Profile
            </Link>

            <div className="ml-2">
              <UserButton />
            </div>
          </Show>

          <Show when="signed-out">
            <SignInButton>
              <button className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:text-white">
                Log In
              </button>
            </SignInButton>

            <SignUpButton>
              <button className="rounded-md bg-white px-3 py-2 text-sm font-medium text-black hover:bg-gray-200">
                Sign Up
              </button>
            </SignUpButton>
          </Show>
        </div>
      </div>
    </nav>
  );
}
