/* eslint-disable no-unused-vars */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProtectedRoutes from "./components/ProtectedRoutes";
import ScrollToTop from "./components/ScrollToTop";

import LandingPage from "./pages/LandingPage";
import ApiDocs from "./pages/ApiDocs";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import QRCode from "./pages/QRCode";
import LinkAnalytics from "./pages/LinkAnalytics";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import AuthSuccess from "./pages/AuthSuccess";
import NotFound from "./pages/NotFound";

import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Security from "./pages/Security";
import About from "./pages/About";

const protectedRoutes = [
  { path: "/home", component: Home },
  { path: "/profile", component: Profile },
  { path: "/analytics", component: Analytics },
  { path: "/analytics/:linkId", component: LinkAnalytics },
  { path: "/qr/:linkId", component: QRCode },
];

const publicRoutes = [
  { path: "/api-docs", component: ApiDocs },
  { path: "/terms", component: Terms },
  { path: "/privacy", component: Privacy },
  { path: "/security", component: Security },
  { path: "/about", component: About },
];

export default function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/success" element={<AuthSuccess />} />

        {publicRoutes.map(({ path, component: Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}

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
