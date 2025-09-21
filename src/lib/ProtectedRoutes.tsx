// src/components/ProtectedDashboardRoute.tsx
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

type ProtectedDashboardRouteProps = {
  path: string;
  subject: string;
  element: React.ReactNode;
};

export default function ProtectedDashboardRoute({
  path,
  subject,
  element,
}: ProtectedDashboardRouteProps) {
  return (
    <Route
      path={path}
      element={
        <ProtectedRoute action="read" subject={subject}>
          {element}
        </ProtectedRoute>
      }
    />
  );
}