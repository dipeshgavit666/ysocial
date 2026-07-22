import { Link } from "react-router";
import { useAuth } from "../context/useAuth";

export function Navbar() {
  const { user, isLoading, logout } = useAuth();

  return (
    <nav className="bg-neutral-900 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">Y Social</div>
        <div>
          <Link
            to="/"
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Home
          </Link>
          <Link
            to="/profile"
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Profile
          </Link>

          {isLoading ? null : user ? (
            <>
              <span className="text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                {user.username}
              </span>
              <button
                onClick={logout}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Log Out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
