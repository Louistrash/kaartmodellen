import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { PageTransition } from "@/components/PageTransition";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      // Redirect to login if not authenticated
      navigate("/login", { state: { from: location }, replace: true });
    }
  }, [user, isLoading, navigate, location]);

  // Show nothing while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-muted" />
          <div className="h-4 w-24 rounded bg-muted" />
        </div>
      </div>
    );
  }

  // If not loading and we still have the component rendered, user must be authenticated
  return <PageTransition>{children}</PageTransition>;
}
