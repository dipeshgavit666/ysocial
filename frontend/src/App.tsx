import { Routes, Route } from "react-router";
import { Layout } from "./components/Layout";
import { HomeFeed } from "./pages/HomeFeed";
import { ProfilePage } from "./pages/ProfilePage";
import { AuthPage } from "./pages/AuthPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomeFeed />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
      </Route>
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
}

export default App;
