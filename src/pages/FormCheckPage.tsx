
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import Navbar from "@/components/layout/Navbar";
import FormUploadSection from "@/components/form-check/FormUploadSection";
import FormResultsSection from "@/components/form-check/FormResultsSection";
import { useFormUpload } from "@/hooks/use-form-upload";
import { useFormCheckResults } from "@/hooks/use-form-check-results";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "@/hooks/use-toast";

const FormCheckPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { exerciseName, workoutId } = location.state || { exerciseName: "Exercise", workoutId: "" };
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [liftType, setLiftType] = useState(exerciseName || "");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { isUploading, videoUrl, uploadAndSaveForm } = useFormUpload();
  const { result, setResult, getMockResultsForLiftType } = useFormCheckResults();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
      // Reset results when a new file is selected
      setResult(null);
    }
  };

  const handleLiftTypeChange = (value: string) => {
    setLiftType(value);
  };

  const handleCheckForm = async () => {
    if (!videoFile || !liftType) {
      toast({
        title: "Missing information",
        description: "Please select a video file and exercise type",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    console.log("Starting form analysis for:", liftType);
    
    // Generate a mock workout ID if one wasn't provided
    const mockWorkoutId = workoutId || uuidv4();
    
    try {
      // Get mock results based on lift type
      const mockResults = getMockResultsForLiftType(liftType);
      console.log("Mock results generated:", mockResults);
      
      // Create mock issues for database storage
      const mockIssues = mockResults.notes.map((note, index) => ({
        timestamp: `00:${(index + 1) * 5}`,
        issue: note,
        fix: `Focus on ${['form', 'technique', 'position', 'stability'][index % 4]}`
      }));
      
      // Upload the video and save form review data
      const uploadedVideoUrl = await uploadAndSaveForm(
        mockWorkoutId, 
        liftType, 
        videoFile, 
        mockResults.score,
        mockIssues
      );
      
      // Set results for display with video URL
      if (uploadedVideoUrl) {
        setResult({
          ...mockResults,
          videoUrl: uploadedVideoUrl
        });
        console.log("Setting result with video URL:", { ...mockResults, videoUrl: uploadedVideoUrl });
      } else {
        setResult(mockResults);
        console.log("Setting result without video URL:", mockResults);
      }
      
      toast({
        title: "Analysis complete",
        description: "Form analysis has been completed successfully",
      });
    } catch (error) {
      console.error("Error during form check:", error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your form",
        variant: "destructive",
      });
      setResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isProcessing = isAnalyzing || isUploading;

  console.log("Current result state:", result);

  return (
    <>
      <PageContainer title="Form Check" showBackButton>
        <div className="space-y-6">
          <FormUploadSection
            videoFile={videoFile}
            liftType={liftType}
            isProcessing={isProcessing}
            onFileChange={handleFileChange}
            onLiftTypeChange={handleLiftTypeChange}
            onCheckForm={handleCheckForm}
          />
          
          <FormResultsSection result={result} />
        </div>
      </PageContainer>
      
      <Navbar />
    </>
  );
};

export default FormCheckPage;
