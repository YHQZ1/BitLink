/* eslint-disable no-unused-vars */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProtectedRoutes from "./components/ProtectedRoutes";

import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import QRCode from "./pages/QRCode";
import LinkAnalytics from "./pages/LinkAnalytics";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import AuthSuccess from "./pages/AuthSuccess";
import NotFound from "./pages/NotFound";

const protectedRoutes = [
  { path: "/home", component: Home },
  { path: "/qr/:linkId", component: QRCode },
  { path: "/analytics/:linkId", component: LinkAnalytics },
  { path: "/analytics", component: Analytics },
  { path: "/profile", component: Profile },
];

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/success" element={<AuthSuccess />} />

        {protectedRoutes.map(({ path, component: Component }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoutes>
                <Component />
              </ProtectedRoutes>
            }
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
