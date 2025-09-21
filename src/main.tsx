import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AbilityProvider } from "./context/AbilityContext";

import Home from "./pages/home";
import Layout from "./components/layouts/layout";
import ErrorPage from "./pages/error";
import Register from "./pages/auth/register";
import Login from "./pages/auth/login";
import AuthCallback from "./lib/AuthCallback";
import ProtectedRoute from "./lib/ProtectedRoute";
import UnauthorizedPage from "./pages/unauthorized";
import OrgAdminDashboard from "./pages/dashboard/oa_dashboard";
import OrgStaffDashboard from "./pages/dashboard/os_dashboard";
import SysAdminDashboard from "./pages/dashboard/sa_dashboard";
import OrganizationSetup from "./pages/organization/organizationSetup";
import SetupError from "./pages/organization/setupError";

import "./dist/output.css";

function App() {
  const { user, loading } = useAuth();
  const role = user?.user_metadata?.role || "guest";

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  console.log(role);

  return (
    <AbilityProvider role={role}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* New and Protected Routes */}
          <Route
            path="/organization-setup"
            element={<ProtectedRoute action="read" subject="organization-setup">
                     <OrganizationSetup />
                     </ProtectedRoute>
            }
          />

          <Route
            path="/setup_error"
            element={<ProtectedRoute action="read" subject="setup_error">
                     <SetupError />
                     </ProtectedRoute>
            }
          />

          <Route
            path="/sa_dashboard"
            element={<ProtectedRoute action="read" subject="sa_dashboard">
                     <SysAdminDashboard />
                     </ProtectedRoute>
            }
          />

          <Route
            path="/oa_dashboard"
            element={<ProtectedRoute action="read" subject="oa_dashboard">
                     <OrgAdminDashboard />
                     </ProtectedRoute>
            }
          />

          <Route
            path="/os_dashboard"
            element={<ProtectedRoute action="read" subject="os_dashboard">
                     <OrgStaffDashboard />
                     </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </AbilityProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);