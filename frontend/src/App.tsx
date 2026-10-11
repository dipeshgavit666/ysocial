import { Routes, Route } from "react-router";

import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { HomeFeed } from "./pages/HomeFeed";
import { PostPage } from "./pages/PostPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SignInPage, SignUpPage } from "./pages/AuthPages";

function App() {
  return (
    <Routes>
      {/* Clerk's hosted-in-app auth screens (the /* lets Clerk use sub-paths) */}
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />

      <Route element={<Layout />}>
        {/* Reading is public; the UI hides write actions when signed out */}
        <Route path="/" element={<HomeFeed />} />
        <Route path="/post/:postId" element={<PostPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />

        {/* Requires a signed-in user */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
