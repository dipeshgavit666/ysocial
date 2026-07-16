import { Navbar } from "../components/Navbar";
import { Outlet } from "react-router";
export function Layout() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}
