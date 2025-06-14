
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  // Landing page is now accessible anonymously
  // Global routing function will handle redirects if needed via routeAfterAuth
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-6 py-10 bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: `url('/lovable-uploads/82d0105a-a738-4e72-9ca7-d31c707388ab.png')`,
        backgroundColor: '#E85A4F' // fallback color matching the image
      }}
    >
      <div className="text-center space-y-8 max-w-md">
        <div className="flex flex-col gap-4 mt-10">
          <Button 
            onClick={() => navigate("/auth", { state: { tab: 'signup' } })}
            className="w-full py-6 text-lg bg-white text-primary hover:bg-white/90"
          >
            Get Started
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate("/auth", { state: { tab: 'login' } })}
            className="border-white text-white hover:bg-white/10 w-full py-6 text-lg"
          >
            I Already Have an Account
          </Button>
        </div>
        
        <p className="text-xs text-white/80 mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
