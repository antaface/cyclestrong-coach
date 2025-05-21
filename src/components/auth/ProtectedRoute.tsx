
import { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import WorkoutPageLoading from "@/components/workout/WorkoutPageLoading";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, needsOnboarding } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      // If not authenticated, redirect to auth page
      if (!user) {
        navigate("/auth");
      } 
      // If authenticated but needs onboarding and not already on onboarding page
      else if (needsOnboarding && location.pathname !== '/onboarding') {
        navigate("/onboarding");
      }
    }
  }, [user, loading, needsOnboarding, navigate, location.pathname]);

  if (loading) {
    return <WorkoutPageLoading />;
  }

  return user ? <Outlet /> : null;
};

export default ProtectedRoute;
