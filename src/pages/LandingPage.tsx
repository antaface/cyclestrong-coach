
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  // Landing page is now accessible anonymously
  // Global routing function will handle redirects if needed via routeAfterAuth
  return <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 bg-cover bg-center bg-no-repeat" style={{
    backgroundImage: `url('/lovable-uploads/674c0ab0-5d8d-43e1-98d1-278835ad1769.png')`,
    backgroundColor: '#F27261' // fallback color matching the coral background
  }}>
      <div className="text-center space-y-8 max-w-md">
        <div className="flex flex-col gap-4 mt-10">
          <Button 
            onClick={() => navigate("/auth", {
              state: {
                tab: 'signup'
              }
            })} 
            className="w-full py-6 text-lg bg-white text-white hover:bg-gray-50 hover:text-white shadow-lg font-bold"
          >
            Get Started
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate("/auth", {
              state: {
                tab: 'login'
              }
            })} 
            className="border-2 border-white bg-transparent text-white hover:text-white w-full py-6 text-lg font-bold shadow-lg"
          >
            I Already Have an Account
          </Button>
        </div>
        
        <p className="text-xs text-white/90 mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>;
};

export default LandingPage;
