
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Dumbbell } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  // Landing page is now accessible anonymously
  // Global routing function will handle redirects if needed via routeAfterAuth
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-joyful-cream to-white px-6 py-10">
      <div className="text-center space-y-8 max-w-md">
        <div className="inline-block mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-joyful-orange flex items-center justify-center">
            <Dumbbell className="w-12 h-12 text-white animate-subtle-bounce" />
          </div>
        </div>
        
        <h1 className="text-4xl font-display text-foreground">
          CycleStrong Coach
        </h1>
        
        <p className="text-muted-foreground text-lg">
          Science-based strength training tailored to your menstrual cycle
        </p>
        
        <div className="flex flex-col gap-4 mt-10">
          <Button 
            onClick={() => navigate("/auth", { state: { tab: 'signup' } })}
            className="w-full py-6 text-lg"
          >
            Get Started
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate("/auth", { state: { tab: 'login' } })}
            className="border-primary text-primary hover:bg-primary/5 w-full py-6 text-lg"
          >
            I Already Have an Account
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
