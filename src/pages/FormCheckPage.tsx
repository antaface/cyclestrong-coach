
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import Navbar from "@/components/layout/Navbar";
import FormUploadSection from "@/components/form-check/FormUploadSection";
import FormResultsSection from "@/components/form-check/FormResultsSection";
import { useFormUpload } from "@/hooks/use-form-upload";
import { useFormCheckResults } from "@/hooks/use-form-check-results";
import { v4 as uuidv4 } from 'uuid';

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
    if (!videoFile || !liftType) return;
    
    setIsAnalyzing(true);
    
    // Generate a mock workout ID if one wasn't provided
    const mockWorkoutId = workoutId || uuidv4();
    
    try {
      // Get mock results based on lift type
      const mockResults = getMockResultsForLiftType(liftType);
      
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
      } else {
        setResult(mockResults);
      }
    } catch (error) {
      console.error("Error during form check:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isProcessing = isAnalyzing || isUploading;

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
