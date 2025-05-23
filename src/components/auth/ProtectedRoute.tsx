
import { Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useAuthRouting } from "@/hooks/use-auth-routing";
import WorkoutPageLoading from "@/components/workout/WorkoutPageLoading";
import AuthRoutingLoading from "@/components/auth/AuthRoutingLoading";

const ProtectedRoute = () => {
  const { user, loading: authLoading } = useAuth();
  const { loading: routingLoading } = useAuthRouting();

  if (authLoading || routingLoading) {
    return <AuthRoutingLoading />;
  }

  return user ? <Outlet /> : <WorkoutPageLoading />;
};

export default ProtectedRoute;
