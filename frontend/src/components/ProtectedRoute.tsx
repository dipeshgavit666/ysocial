import { useAuth } from "@clerk/react";
import { Navigate, Outlet } from "react-router";

export function ProtectedRoute() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}
