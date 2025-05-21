
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Dumbbell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-joyful-cream to-white px-4 py-10">
      <div className="text-center space-y-4 max-w-md">
        <div className="inline-block mb-3">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-joyful-orange flex items-center justify-center">
            <Dumbbell className="w-12 h-12 text-white animate-subtle-bounce" />
          </div>
        </div>
        
        <h1 className="text-h1 font-display text-foreground">
          CycleStrong Coach
        </h1>
        
        <p className="text-body text-muted-foreground mb-6">
          Science-based strength training tailored to your menstrual cycle
        </p>
        
        <div className="flex flex-col gap-3 mt-6">
          {user ? (
            <Button 
              onClick={() => navigate("/")}
              className="w-full py-3.5 h-14"
            >
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button 
                onClick={() => navigate("/auth", { state: { tab: 'signup' } })}
                className="w-full py-3.5 h-14"
              >
                Get Started
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => navigate("/auth", { state: { tab: 'login' } })}
                className="border-primary text-primary hover:bg-primary/5 w-full py-3.5 h-14"
              >
                I Already Have an Account
              </Button>
            </>
          )}
        </div>
        
        <p className="text-secondary text-secondary-text mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
