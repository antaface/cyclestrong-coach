
import { Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AuthRoutingLoading from "@/components/auth/AuthRoutingLoading";

const ProtectedRoute = () => {
  const { loading } = useAuth();

  // Show loading while authentication state is being determined
  if (loading) {
    return <AuthRoutingLoading />;
  }

  // Allow access to all protected routes - the routeAfterAuth function
  // handles the actual routing logic based on authentication state
  return <Outlet />;
};

export default ProtectedRoute;
