import { Routes, Route } from "react-router";

import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { HomeFeed } from "./pages/HomeFeed";
import { ProfilePage } from "./pages/ProfilePage";
import { PostPage } from "./pages/PostPage";

function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<HomeFeed />} />

          <Route path="/post/:postId" element={<PostPage />} />

          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/profile/:username" element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
