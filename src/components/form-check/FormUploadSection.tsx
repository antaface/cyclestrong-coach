
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormUploadSectionProps {
  videoFile: File | null;
  liftType: string;
  isProcessing: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLiftTypeChange: (value: string) => void;
  onCheckForm: () => void;
}

const FormUploadSection = ({
  videoFile,
  liftType,
  isProcessing,
  onFileChange,
  onLiftTypeChange,
  onCheckForm,
}: FormUploadSectionProps) => {
  return (
    <Card className="p-5">
      <div className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="video">Upload Video</Label>
          <Input
            id="video"
            type="file"
            accept="video/*"
            onChange={onFileChange}
          />
        </div>
        
        {videoFile && (
          <div className="bg-accent/20 p-3 rounded-md">
            <p className="text-sm text-foreground font-medium mb-1">Selected file:</p>
            <p className="text-xs text-muted-foreground">{videoFile.name}</p>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="lift-type">Lift Type</Label>
          <Select 
            value={liftType} 
            onValueChange={onLiftTypeChange}
          >
            <SelectTrigger id="lift-type" className="w-full">
              <SelectValue placeholder="Select lift type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Squat">Squat</SelectItem>
              <SelectItem value="Deadlift">Deadlift</SelectItem>
              <SelectItem value="Bench Press">Bench Press</SelectItem>
              <SelectItem value="RDL">Romanian Deadlift (RDL)</SelectItem>
              <SelectItem value="Overhead Press">Overhead Press</SelectItem>
              <SelectItem value="Pull-up">Pull-up</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          className="w-full"
          disabled={!videoFile || !liftType || isProcessing}
          onClick={onCheckForm}
        >
          {isProcessing ? "Processing..." : "Check Form"}
        </Button>
      </div>
    </Card>
  );
};

export default FormUploadSection;
