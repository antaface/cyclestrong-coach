
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
    <Card className="p-4 sm:p-5 border border-border/40">
      <div className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="video" className="font-medium">Upload Form Video</Label>
          <Input
            id="video"
            type="file"
            accept="video/*"
            onChange={onFileChange}
            className="cursor-pointer"
          />
        </div>
        
        {videoFile && (
          <div className="bg-accent/20 p-3 rounded-md">
            <p className="text-sm text-foreground font-medium mb-1">Selected file:</p>
            <p className="text-xs text-muted-foreground">{videoFile.name}</p>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="lift-type" className="font-medium">Exercise Type</Label>
          <Select 
            value={liftType} 
            onValueChange={onLiftTypeChange}
          >
            <SelectTrigger id="lift-type" className="w-full bg-white/80">
              <SelectValue placeholder="Select exercise" />
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
          className="w-full mt-2"
          disabled={!videoFile || !liftType || isProcessing}
          onClick={onCheckForm}
        >
          {isProcessing ? "Analyzing Form..." : "Analyze Form"}
        </Button>
      </div>
    </Card>
  );
};

export default FormUploadSection;
