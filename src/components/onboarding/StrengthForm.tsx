
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface StrengthFormProps {
  formData: {
    oneRM: {
      squat?: number;
      bench?: number;
      deadlift?: number;
      hipThrust?: number;
    };
  };
  updateFormData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const formSchema = z.object({
  squat: z.coerce.number().optional(),
  bench: z.coerce.number().optional(),
  deadlift: z.coerce.number().optional(),
  hipThrust: z.coerce.number().optional(),
});

const StrengthForm = ({ 
  formData, 
  updateFormData, 
  onNext, 
  onBack 
}: StrengthFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      squat: formData.oneRM.squat,
      bench: formData.oneRM.bench,
      deadlift: formData.oneRM.deadlift,
      hipThrust: formData.oneRM.hipThrust,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateFormData({ oneRM: data });
    onNext();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="form-container">
        <h2 className="text-xl font-semibold text-cs-neutral-900">Current Strength</h2>
        <p className="text-cs-neutral-500">Enter your one-rep maximums (optional)</p>
        
        <FormField
          control={form.control}
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
          control={form.control}
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
          control={form.control}
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
          control={form.control}
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

export default StrengthForm;
