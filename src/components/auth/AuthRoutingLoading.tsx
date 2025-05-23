
import { Skeleton } from "@/components/ui/skeleton";

const AuthRoutingLoading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4 w-full max-w-md">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-12 w-2/3 mx-auto" />
      </div>
    </div>
  );
};

export default AuthRoutingLoading;
