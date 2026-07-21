import { Routes, Route } from "react-router";
import { Layout } from "./components/Layout";
import { HomeFeed } from "./pages/HomeFeed";
import { ProfilePage } from "./pages/ProfilePage";
import { AuthPage } from "./pages/AuthPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomeFeed />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
}

export default App;
