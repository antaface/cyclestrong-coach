
import { Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AuthRoutingLoading from "@/components/auth/AuthRoutingLoading";

const ProtectedRoute = () => {
  const { loading } = useAuth();

  if (loading) {
    return <AuthRoutingLoading />;
  }

  // Let the global routing function handle all redirects
  return <Outlet />;
};

export default ProtectedRoute;
