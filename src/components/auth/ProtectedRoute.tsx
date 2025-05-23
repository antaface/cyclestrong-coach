
import { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import WorkoutPageLoading from "@/components/workout/WorkoutPageLoading";

const ProtectedRoute = () => {
  const { user, loading, needsOnboarding } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      // If not authenticated and not on landing/auth page, redirect to landing page
      if (!user && !location.pathname.includes('/landing') && !location.pathname.includes('/auth')) {
        console.log("Not authenticated, redirecting to landing");
        navigate("/landing");
      } 
      // If authenticated and needs onboarding and not already on onboarding page
      else if (user && needsOnboarding && location.pathname !== '/onboarding') {
        console.log("Needs onboarding, redirecting to onboarding");
        navigate("/onboarding");
      }
    }
  }, [user, loading, needsOnboarding, navigate, location.pathname]);

  if (loading) {
    return <WorkoutPageLoading />;
  }

  // Allow the user to stay on landing page even when authenticated
  // This prevents unwanted redirects from landing page
  if (location.pathname === '/landing') {
    return <Outlet />;
  }

  return user ? <Outlet /> : null;
};

export default ProtectedRoute;
