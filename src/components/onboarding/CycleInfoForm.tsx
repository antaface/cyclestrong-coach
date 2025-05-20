
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ArrowRight, CalendarIcon } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface CycleInfoFormProps {
  formData: {
    cycleLength: number;
    lastPeriod?: Date;
  };
  updateFormData: (data: any) => void;
  onNext: () => void;
}

const formSchema = z.object({
  cycleLength: z.coerce.number().min(21).max(35),
  lastPeriod: z.date(),
});

const CycleInfoForm = ({ formData, updateFormData, onNext }: CycleInfoFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cycleLength: formData.cycleLength,
      lastPeriod: formData.lastPeriod,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateFormData(data);
    onNext();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="form-container">
        <h2 className="text-xl font-semibold text-cs-neutral-900">Cycle Information</h2>
        <p className="text-cs-neutral-500">Help us tailor your training to your cycle</p>
        
        <FormField
          control={form.control}
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
          control={form.control}
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
  );
};

export default CycleInfoForm;
