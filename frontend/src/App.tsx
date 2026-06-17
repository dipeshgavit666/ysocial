import { AuthPage } from "./pages/AuthPage"
import {Routes, Route } from "react-router";
function App() {
  

  return (
    <>
    <Routes>
      <Route path="/auth" element={<AuthPage />}/>
    </Routes>
    </>
  )
}

export default App
