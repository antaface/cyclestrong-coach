
import { Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AuthRoutingLoading from "@/components/auth/AuthRoutingLoading";

const ProtectedRoute = () => {
  const { loading } = useAuth();

  // TEMPORARILY DISABLED - Skip loading check and allow all routes
  // if (loading) {
  //   return <AuthRoutingLoading />;
  // }

  // Allow access to all protected routes without authentication
  return <Outlet />;
};

export default ProtectedRoute;
