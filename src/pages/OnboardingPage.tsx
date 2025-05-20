
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import PageContainer from "@/components/layout/PageContainer";
import { CalendarIcon, ArrowRight, ArrowLeft } from "lucide-react";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxSteps = 4;

  // First form schema
  const basicFormSchema = z.object({
    cycleLength: z.coerce.number().min(21).max(35),
    lastPeriod: z.date(),
  });

  // Second form schema
  const trainingFormSchema = z.object({
    trainingAge: z.string(),
    goal: z.string(),
  });

  // Third form schema
  const oneRMFormSchema = z.object({
    squat: z.coerce.number().optional(),
    bench: z.coerce.number().optional(),
    deadlift: z.coerce.number().optional(),
    hipThrust: z.coerce.number().optional(),
  });

  // Basic form
  const basicForm = useForm<z.infer<typeof basicFormSchema>>({
    resolver: zodResolver(basicFormSchema),
    defaultValues: {
      cycleLength: 28,
    },
  });

  // Training form
  const trainingForm = useForm<z.infer<typeof trainingFormSchema>>({
    resolver: zodResolver(trainingFormSchema),
    defaultValues: {
      trainingAge: "beginner",
      goal: "strength",
    },
  });

  // One RM form
  const oneRMForm = useForm<z.infer<typeof oneRMFormSchema>>({
    resolver: zodResolver(oneRMFormSchema),
    defaultValues: {
      squat: undefined,
      bench: undefined,
      deadlift: undefined,
      hipThrust: undefined,
    },
  });

  const onSubmitBasic = (data: z.infer<typeof basicFormSchema>) => {
    console.log("Basic form data:", data);
    setStep(2);
  };

  const onSubmitTraining = (data: z.infer<typeof trainingFormSchema>) => {
    console.log("Training form data:", data);
    setStep(3);
  };

  const onSubmitOneRM = (data: z.infer<typeof oneRMFormSchema>) => {
    console.log("One RM form data:", data);
    setStep(4);
  };

  const completeOnboarding = async () => {
    if (!user) {
      toast.error("User not found. Please sign in again.");
      navigate("/auth");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Combine all form data
      const lastPeriodDate = basicForm.getValues().lastPeriod;
      
      const profileData = {
        id: user.id,
        cycle_length: basicForm.getValues().cycleLength,
        last_period: lastPeriodDate.toISOString(), // Convert Date to ISO string format
        goal: trainingForm.getValues().goal,
        training_age: trainingForm.getValues().trainingAge,
        one_rm: {
          squat: oneRMForm.getValues().squat || 0,
          bench: oneRMForm.getValues().bench || 0,
          deadlift: oneRMForm.getValues().deadlift || 0,
          hip_thrust: oneRMForm.getValues().hipThrust || 0,
        }
      };
      
      console.log("Saving profile data:", profileData);
      
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast.success("Profile setup complete!");
      navigate("/");
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error(error.message || "Failed to save profile data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (step < maxSteps) setStep(step + 1);
    else completeOnboarding();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <PageContainer showBackButton={step > 1} title="Set Up Your Profile">
      <div className="space-y-6">
        {/* Progress indicator */}
        <div className="flex justify-between items-center mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={cn(
                "w-full h-1 rounded-full",
                s < step ? "bg-cs-purple" : 
                s === step ? "bg-cs-purple-light" : 
                "bg-cs-neutral-200"
              )}
            ></div>
          ))}
        </div>
        
        {step === 1 && (
          <Form {...basicForm}>
            <form onSubmit={basicForm.handleSubmit(onSubmitBasic)} className="form-container">
              <h2 className="text-xl font-semibold text-cs-neutral-900">Cycle Information</h2>
              <p className="text-cs-neutral-500">Help us tailor your training to your cycle</p>
              
              <FormField
                control={basicForm.control}
                name="cycleLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Average Cycle Length (days)</FormLabel>
                    <FormControl>
                      <Input placeholder="28" {...field} type="number" min={21} max={35} />
                    </FormControl>
                    <FormDescription>
                      The typical number of days from the start of one period to the next
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={basicForm.control}
                name="lastPeriod"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>First Day of Last Period</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                          className="p-3"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      This helps us track where you are in your cycle
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-4">
                <Button type="submit" className="w-full bg-cs-purple hover:bg-cs-purple-dark">
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </form>
          </Form>
        )}
        
        {step === 2 && (
          <Form {...trainingForm}>
            <form onSubmit={trainingForm.handleSubmit(onSubmitTraining)} className="form-container">
              <h2 className="text-xl font-semibold text-cs-neutral-900">Training Background</h2>
              <p className="text-cs-neutral-500">Tell us about your experience and goals</p>
              
              <FormField
                control={trainingForm.control}
                name="trainingAge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Training Experience</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                        <SelectItem value="advanced">Advanced (3+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={trainingForm.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Training Goal</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your primary goal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="strength">Strength</SelectItem>
                        <SelectItem value="muscle">Muscle Building</SelectItem>
                        <SelectItem value="toning">Toning & Definition</SelectItem>
                        <SelectItem value="performance">Athletic Performance</SelectItem>
                        <SelectItem value="general">General Fitness</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-between pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleBack}
                  className="w-1/3"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back
                </Button>
                <Button 
                  type="submit" 
                  className="w-2/3 ml-2 bg-cs-purple hover:bg-cs-purple-dark"
                >
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </form>
          </Form>
        )}
        
        {step === 3 && (
          <Form {...oneRMForm}>
            <form onSubmit={oneRMForm.handleSubmit(onSubmitOneRM)} className="form-container">
              <h2 className="text-xl font-semibold text-cs-neutral-900">Current Strength</h2>
              <p className="text-cs-neutral-500">Enter your one-rep maximums (optional)</p>
              
              <FormField
                control={oneRMForm.control}
                name="squat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Squat 1RM (kg)</FormLabel>
                    <FormControl>
                      <Input placeholder="0" {...field} type="number" min={0} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={oneRMForm.control}
                name="bench"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bench Press 1RM (kg)</FormLabel>
                    <FormControl>
                      <Input placeholder="0" {...field} type="number" min={0} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={oneRMForm.control}
                name="deadlift"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadlift 1RM (kg)</FormLabel>
                    <FormControl>
                      <Input placeholder="0" {...field} type="number" min={0} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={oneRMForm.control}
                name="hipThrust"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hip Thrust 1RM (kg)</FormLabel>
                    <FormControl>
                      <Input placeholder="0" {...field} type="number" min={0} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-between pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleBack}
                  className="w-1/3"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back
                </Button>
                <Button 
                  type="submit" 
                  className="w-2/3 ml-2 bg-cs-purple hover:bg-cs-purple-dark"
                >
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </form>
          </Form>
        )}
        
        {step === 4 && (
          <div className="form-container">
            <h2 className="text-xl font-semibold text-cs-neutral-900">You're All Set!</h2>
            <p className="text-cs-neutral-500 mb-6">Your personalized training program is ready</p>
            
            <div className="bg-cs-neutral-100 rounded-lg p-4 mb-6">
              <p className="text-sm text-cs-neutral-600">
                CycleStrong Coach will adapt your training program based on your menstrual cycle phases:
              </p>
              <ul className="mt-2 space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="w-3 h-3 bg-cs-purple-light rounded-full mr-2"></span>
                  <span><strong>Follicular Phase:</strong> Higher volume/intensity training</span>
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 bg-cs-purple rounded-full mr-2"></span>
                  <span><strong>Ovulation:</strong> Peak strength and power performance</span>
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 bg-cs-pink-dark rounded-full mr-2"></span>
                  <span><strong>Luteal Phase:</strong> Moderate volume and strategic deload</span>
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 bg-cs-pink rounded-full mr-2"></span>
                  <span><strong>Menstrual Phase:</strong> Active recovery and lighter workouts</span>
                </li>
              </ul>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleBack}
                className="w-1/3"
              >
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button 
                onClick={completeOnboarding}
                disabled={isSubmitting}
                className="w-2/3 ml-2 bg-cs-purple hover:bg-cs-purple-dark"
              >
                {isSubmitting ? "Saving..." : "Get Started"} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default OnboardingPage;
