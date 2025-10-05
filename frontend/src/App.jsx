import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import ProtectedRoutes from "./components/ProtectedRoutes";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route 
          path="/home" 
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          } 
        />
      </Routes>
    </Router>
  );
}