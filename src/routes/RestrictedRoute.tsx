import { Navigate } from "react-router-dom";

interface RestrictedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

export function RestrictedRoute({
  isAuthenticated,
  children,
}: RestrictedRouteProps) {
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
