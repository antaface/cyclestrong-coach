
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TrainingBackgroundFormProps {
  formData: {
    trainingAge: string;
    goal: string;
  };
  updateFormData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const formSchema = z.object({
  trainingAge: z.string(),
  goal: z.string().min(10, "Please describe your fitness goals in at least 10 characters"),
});

const TrainingBackgroundForm = ({ 
  formData, 
  updateFormData, 
  onNext, 
  onBack 
}: TrainingBackgroundFormProps) => {
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trainingAge: formData.trainingAge,
      goal: formData.goal,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateFormData(data);
    onNext();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="form-container">
        <h2 className="text-xl font-semibold text-cs-neutral-900">Training Background</h2>
        <p className="text-cs-neutral-500">Tell us about your experience and goals</p>
        
        <FormField
          control={form.control}
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
          control={form.control}
          name="goal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Training Goals</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your fitness goals in detail..." 
                  className="min-h-24 resize-none"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Tell us what you're hoping to achieve with your training
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-between pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBack}
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
  );
};

export default TrainingBackgroundForm;
