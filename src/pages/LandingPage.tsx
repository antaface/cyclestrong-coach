
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-cs-purple-light/10 px-4 py-10">
      <div className="text-center space-y-6 max-w-md">
        <div className="inline-block mb-4">
          <div className="w-20 h-20 rounded-full bg-cs-purple flex items-center justify-center">
            <Dumbbell className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-cs-neutral-900">
          CycleStrong Coach
        </h1>
        
        <p className="text-cs-neutral-600 text-lg">
          Science-based strength training tailored to your menstrual cycle
        </p>
        
        <div className="flex flex-col gap-4 mt-8">
          <Button 
            onClick={() => navigate("/onboarding")}
            className="bg-cs-purple hover:bg-cs-purple-dark w-full py-6 text-lg"
          >
            Get Started
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate("/login")}
            className="border-cs-purple text-cs-purple hover:bg-cs-purple/10 w-full py-6 text-lg"
          >
            I Already Have an Account
          </Button>
        </div>
        
        <p className="text-xs text-cs-neutral-500 mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

import { Dumbbell } from "lucide-react";
export default LandingPage;
