// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAbility } from "../context/AbilityContext";

export default function ProtectedRoute({ action, subject, children }) {
  const ability = useAbility();

  if (!ability.can(action, subject)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
}
