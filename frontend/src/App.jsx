import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import QRCode from "./pages/QRCode";
import LinkAnalytics from "./pages/LinkAnalytics";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AuthSuccess from "./pages/AuthSuccess";

import ProtectedRoutes from "./components/ProtectedRoutes";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route
          path="/home"
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/qr/:linkId"
          element={
            <ProtectedRoutes>
              <QRCode />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/analytics/:linkId"
          element={
            <ProtectedRoutes>
              <LinkAnalytics />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoutes>
              <Analytics />
            </ProtectedRoutes>
          }
        />
        {/* <Route
          path="/settings"
          element={
            <ProtectedRoutes>
              <Settings />
            </ProtectedRoutes>
          }
        /> */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoutes>
              <Profile/>
            </ProtectedRoutes>
          }
        />
      </Routes>
    </Router>
  );
}
