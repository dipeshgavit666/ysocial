import { Outlet, Route, Routes } from "react-router";
import { Navbar } from "../components/Navbar";
import { HomeFeed } from "../pages/HomeFeed";
import { ProfilePage } from "../pages/ProfilePage";
import { AuthPage } from "../pages/AuthPage";
export function Layout() {
  return (
    <div>
      <Navbar />
      <Outlet /> {/* child route renders here */}
    </div>
  );
}

<Routes>
  <Route element={<Layout />}>
    <Route path="/" element={<HomeFeed />} />
    <Route path="/profile/:username" element={<ProfilePage />} />
  </Route>
  <Route path="/auth" element={<AuthPage />} />{" "}
  {/* outside Layout, no navbar */}
</Routes>;
